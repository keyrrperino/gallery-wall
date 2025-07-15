import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";
import { unlink } from "fs/promises";
import { Readable, PassThrough } from "stream";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";

ffmpeg.setFfmpegPath(ffmpegPath!);

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

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
      const videoUrl = await getS3SignedUrl(
        s3,
        new GetObjectCommand({ Bucket: bucket, Key: key }),
        { expiresIn: 60 * 5 } // 5 minutes
      );

      // 2. Prepare S3 upload stream for GIF
      const gifKey = key.replace(/\.webm$/, ".gif");
      const passThrough = new PassThrough();
      const uploadPromise = s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: gifKey,
        Body: passThrough,
        ContentType: "image/gif",
      }));

      // 3. Convert to GIF using ffmpeg with the S3 URL as input, pipe to S3
      await new Promise<void>((resolve, reject) => {
        ffmpeg(videoUrl)
          .outputOptions([
            "-t 5",
            "-vf", "fps=30,scale=1080:-1:flags=lanczos",
          ])
          .toFormat("gif")
          .on("end", resolve)
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