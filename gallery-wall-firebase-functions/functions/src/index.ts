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
import stream from "stream";
import { createClient } from '@supabase/supabase-js';

setGlobalOptions({maxInstances: 10});

// ffmpeg.setFfmpegPath(ffmpegPath!);

const inputSchema = z.object({
  videoUrl: z.string().url(),
  width: z.string()
});

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://lbrxffrgccdojnugwkgn.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicnhmZnJnY2Nkb2pudWd3a2duIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU0ODE0OCwiZXhwIjoyMDY4MTI0MTQ4fQ.eLxwP-fJbkW_m7gzJ3t73Z6U0epdnjPLumqt9ZuN9rg'
);

const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'gifs';

async function uploadGIFToSupabase(buffer: Buffer, key: string): Promise<{url: string; path: key}> {
  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(key, buffer, {
      contentType: 'image/gif',
      upsert: true,
    });

  if (error) throw error;

  // Get a signed URL valid for 1 hour (3600 seconds)
  const { data: signedData, error: signedError } = await supabase
    .storage
    .from(SUPABASE_BUCKET)
    .createSignedUrl(key, 631152000);

  if (signedError) throw signedError;
  return {
    url: signedData.signedUrl,
    path: key
  };
}

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
      const {videoUrl, width} = parsed.data;

      // Set response headers for GIF download
      res.setHeader("Content-Type", "image/gif");
      res.setHeader("Content-Disposition", "attachment; filename=output.gif");

      // Convert video to GIF and stream to response
      ffmpeg(videoUrl)
        .outputOptions([
          "-t", "5",
          "-vf", `fps=30,scale=${width}:-1:flags=lanczos`,
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

export const convertAndUploadVideoUrlToGIF = onRequest(async (req, res) => {
  cors({origin: true})(req, res, async () => {
    let responseSent = false; // Track if response is already sent
    try {
      const parsed = inputSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({
          error: "Invalid input",
          details: parsed.error.flatten(),
        });
        responseSent = true;
        return;
      }
      const { videoUrl } = parsed.data;

      const passThrough = new stream.PassThrough();
      const chunks: Buffer[] = [];
      passThrough.on("data", (chunk) => chunks.push(chunk));
      passThrough.on("end", async () => {
        if (responseSent) return; // Prevent double response
        responseSent = true;
        const buffer = Buffer.concat(chunks);
        const key = `gifs/${Date.now()}-${Math.floor(Math.random()*1e6)}.gif`;
        try {
          const uploadResponse = await uploadGIFToSupabase(buffer, key);
          res.status(200).json(uploadResponse);
        } catch (uploadErr: any) {
          logger.error("Supabase upload error", uploadErr);
          res.status(500).json({ error: "Failed to upload GIF to Supabase" });
        }
      });

      ffmpeg(videoUrl)
        .outputOptions([
          "-t", "5",
          "-vf", "fps=30,scale=1080:-1:flags=lanczos",
        ])
        .toFormat("gif")
        .on("error", (err) => {
          logger.error("ffmpeg error", err);
          if (!responseSent) {
            responseSent = true;
            res.status(500).send("Error processing video");
          }
          // No need to call res.end() here, as error response is sent
        })
        .pipe(passThrough, { end: true });
    } catch (err: any) {
      logger.error("Unexpected error", err);
      if (!responseSent) {
        res.status(500).json({error: err.message});
      }
    }
  });
});
