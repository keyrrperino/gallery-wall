/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import ffmpeg from "fluent-ffmpeg";
// import ffmpegPath from "ffmpeg-static";
import {z} from "zod";
import cors from "cors";

setGlobalOptions({maxInstances: 10});

// ffmpeg.setFfmpegPath(ffmpegPath!);

const inputSchema = z.object({
  videoUrl: z.string().url(),
});

export const convertVideoUrlToGIF = onRequest(async (req, res) => {
  // Enable CORS for all origins
  cors({origin: true})(req, res, async () => {
    try {
      const parsed = inputSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({
          error: "Invalid input",
          details: parsed.error.flatten(),
        });
        return;
      }
      const {videoUrl} = parsed.data;

      // Set response headers for GIF download
      res.setHeader("Content-Type", "image/gif");
      res.setHeader("Content-Disposition", "attachment; filename=output.gif");

      // Convert video to GIF and stream to response
      ffmpeg(videoUrl)
        .outputOptions([
          "-t", "5",
          "-vf", "fps=30,scale=1080:-1:flags=lanczos",
        ])
        .toFormat("gif")
        .on("error", (err) => {
          logger.error("ffmpeg error", err);
          if (!res.headersSent) {
            res.status(500).send("Error processing video");
          } else {
            res.end();
          }
        })
        .pipe(res, {end: true});
    } catch (err: any) {
      logger.error("Unexpected error", err);
      res.status(500).json({error: err.message});
    }
  });
});
