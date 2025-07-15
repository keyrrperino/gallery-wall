import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";
import { unlink } from "fs/promises";
import { Readable, PassThrough } from "stream";
import { getSignedUrl, uploadStreamToS3 } from "storage";

ffmpeg.setFfmpegPath(ffmpegPath!);

export const processVideo = publicProcedure
  .input(
    z.object({
      key: z.string().min(1),
      bucket: z.string().min(1),
    })
  )
  .mutation(async ({ input: { key, bucket } }) => {
    try {
      // 1. Generate a signed S3 URL for the video
      const videoUrl = await getSignedUrl(key, { bucket, expiresIn: 60 * 5 });

      // 2. Prepare S3 upload stream for GIF
      const gifKey = key.replace(/\.webm$/, ".gif");
      const passThrough = new PassThrough();
      const uploadPromise = uploadStreamToS3({
        bucket,
        key: gifKey,
        stream: passThrough,
        contentType: "image/gif",
      });

      // 3. Convert to GIF using ffmpeg with the S3 URL as input, pipe to S3
      await new Promise<void>((resolve, reject) => {
        ffmpeg(videoUrl)
          .outputOptions([
            "-t 5",
            "-vf", "fps=30,scale=1080:-1:flags=lanczos",
          ])
          .toFormat("gif")
          .on("end", (_stdout, _stderr) => resolve())
          .on("error", reject)
          .pipe(passThrough, { end: true });
      });

      // 4. Wait for S3 upload to finish
      await uploadPromise;

      return { gifKey };
    } catch (err: any) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
    }
  }); 