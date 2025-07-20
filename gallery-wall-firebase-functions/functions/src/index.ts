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
import {createClient} from "@supabase/supabase-js";
import {removeBackground} from "@imgly/background-removal-node";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import {CloudTasksClient, protos} from "@google-cloud/tasks";
const {HttpMethod} = protos.google.cloud.tasks.v2;

setGlobalOptions({maxInstances: 60});

const tasksClient = new CloudTasksClient({
  credentials: {
    client_email: "665982940607-compute@developer.gserviceaccount.com",
    // eslint-disable-next-line max-len
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCz7L7nvRLxdyh3\nkOVMSSYgWmMf52Xwi4xZ5P+8xeBs1eV2VvMIJr7ZsVwt9d39dqjbDbMysQrA1mvI\nZPgMFa+gfHyO4PSEC3pt4W2gcgg/NP/OMBCp4zpU2i9zsbNz+yqRakQx1ehKqdVG\nStr4Q3v/UNe9VmI4r54/v46q9twquHHf8Kr9WBRAHLgSIXNekjMuYUd0WdaiwHkw\nQnc8TizLCn8gQuyhUKO6/iq0zUTeeVsjBqPbDM54gEJyeR5AOCQ6P0EUX0QuhUI3\nAP/yWAKmEIC0tT0+8jqY8vi56BpDwu/zerTWw45rXJzVL7DeD7Deiv8wzwNXfzPI\ndZxzMCOdAgMBAAECggEAToEmztA1mrvmIT1MfxuPkiA+DeaWGP2acIK1fvVLtdEi\nPJ81jUHyleOIF9mmUXhbtrBkluKekYM9JgPAIu23YqvOYT0QEyk68wSgI5h9tq52\nSs24B5hIlEta1v0bEqjtauNV+/ScVS+DCheRMS+ow77PUyKE2rztrFz1b+0kJVL2\nFik0wQ1tCxFpZuOrUyvuAicz7EKygW/0R9QLIRmd57J0kYuYsePflOnyUaJPsUDJ\nYlqQQxGpjA5MK6mBDV9ShkrmTZ+/JXNZsyALkFTUdcvUAtvohboc/lE2HiuuVxUv\nS9qc6oIhD6gIYyE1nS3z/2x5JwIzOufp5buk3gyUlQKBgQD1BOjKo4YY/mRHEQWx\nvnKbZ6A0HKR3uO6adIUKciN2OwlRIDZt4X4HXoF5WblH/IUZokMXWDHofapwjRG+\n26h4tv3g7rb4+M5eOKVdHKStQ9KIdKE/jl0MIKHqM0eyobUI/uTuHBgck1dndKvx\nhqCNns0AD2As9WqKvMUctedG6wKBgQC7/QMkJY2i6GxLlGe3pQ3US5mjfAhayPWn\n+yqTWzXeOEQJEhY7wKZzx+5/EFFvhlZ12QBU5FBcLwfGAeTYmCtv+zUorAki4q71\nDZIbR6VXq4aM4B2hKKiRAe8zZfXVxSuzuCD90o4MVQHHfb1VO08TqLv1jlII5JBT\nFfidqWotlwKBgBwqulBBSDMrW3/H9y2dxTMUUJhtCoMw4U0kQ/8Va/o1gzauS1OK\nbqCOPrgilmguIWb2/lt6qhIeEC/sJ7QXMGDgOINZLfOlNqQiQvBXUJ8Sguto7PiP\ndybjwXlY988TQ+qK0uqElEkErzGXegTEA0UEknCFU/sXI25bkRVh2/qNAoGAMTgq\nhWFLtzaRfCxsB3owp7/vhw1nhpWNNCEf4ZsE/JzQu2s/5P8o1bGoMR6No9yRcKOT\nYaaxn6E0sNQ4Hbmhzd0A6xg4AClH06Ns+LWGhfDD9siLGXHyyJywC04L0p+gNJrm\nEG77gCEVqSyz0MgJiUUpiT5tHiTx4L8k6+q6gRsCgYEA6KdOjcHtBV5a3mlkJe1y\n6YMWa0v77O1Ru05YFGUWUfQL/Hw5xGrbjrm5aUyvRObzB3+KWfxps0TFAd/7g5te\n4NTKQljjdfM+l367r6QkXRPhwDzm7JCFIuht5iIKptAljcklZnF/reo5Dac7Ezq9\nH1q3QJMs5Q9fHhi04Jr4nSI=\n-----END PRIVATE KEY-----\n",
  },
  projectId: "pub-coastal",
});

const PROJECT_NAME = "pub-coastal";
const PROJECT_LOCATION = "asia-southeast1";
const QUEUE_NAME = "removeframebackground";

// ffmpeg.setFfmpegPath(ffmpegPath!);

const inputSchema = z.object({
  videoUrl: z.string().url(),
  width: z.string(),
});

const keyPart1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.";
const keyPart2 = "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicnhmZnJnY2Nkb2pudWd3a2";
const keyPart3 = "duIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU0ODE0OCwi";
const keyPart4 = "ZXhwIjoyMDY4MTI0MTQ4fQ.eLxwP-";
const keyPart5 = "fJbkW_m7gzJ3t73Z6U0epdnjPLumqt9ZuN9rg";

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL || "https://lbrxffrgccdojnugwkgn.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || (
    keyPart1+keyPart2+keyPart3+keyPart4+keyPart5)
);

const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "gifs";


const replaceFrameBackground = (
  params: {
    userId: string;
    userGifRequestId: string;
    frameNumber: number;
    imageUrl: string;
  }) => {
  const {
    userId,
    userGifRequestId,
    frameNumber,
    imageUrl,
  } = params;
  const removeBackgroundUrl = "https://python-functions-665982940607.asia-southeast1.run.app/"+
    `remove-image-background?userId=${
      userId
    }&userGifRequestId=${
      userGifRequestId
    }&frameNumber=${frameNumber}&imageUrl=${
      imageUrl
    }`;

  const task = {
    httpRequest: {
      httpMethod: HttpMethod.POST,
      url: removeBackgroundUrl,
    },
  };

  const parent = tasksClient.queuePath(
    PROJECT_NAME, PROJECT_LOCATION, QUEUE_NAME);

  tasksClient.createTask({parent, task}).then();
};

/**
 * Uploads a GIF buffer to Supabase Storage and returns
 * a signed URL and storage path.
 *
 * @param {Buffer} buffer - The GIF file buffer to upload.
 * @param {string} key - The storage key (path) for the GIF
 * in the Supabase bucket.
 * @return {Promise<{url: string, path: string}>} An object
 * containing the signed URL and storage path.
 * @throws Will throw an error if the upload or signed
 * URL creation fails.
 */
async function uploadGIFToSupabase(
  buffer: Buffer, key: string): Promise<{url: string; path: string}> {
  const {error} = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(key, buffer, {
      contentType: "image/gif",
      upsert: true,
    });

  if (error) throw error;

  // Get a signed URL valid for 1 hour (3600 seconds)
  const {data: signedData, error: signedError} = await supabase
    .storage
    .from(SUPABASE_BUCKET)
    .createSignedUrl(key, 631152000);

  if (signedError) throw signedError;
  return {
    url: signedData.signedUrl,
    path: key,
  };
}

export const convertVideoUrlToGIF = onRequest(async (req, res) => {
  // Enable CORS for all origins
  cors({
    origin: true,
  })(req, res, async () => {
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
      const {videoUrl} = parsed.data;

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
          res.status(500).json({error: "Failed to upload GIF to Supabase"});
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
        .pipe(passThrough, {end: true});
    } catch (err: any) {
      logger.error("Unexpected error", err);
      if (!responseSent) {
        res.status(500).json({error: err.message});
      }
    }
  });
});

export const convertRemoveBGAndUploadVideoUrlToGIF = onRequest({
  timeoutSeconds: 540,
  memory: "1GiB",
}, async (req, res) => {
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
      const {videoUrl} = parsed.data;

      // Prepare temp directories
      const framesDir = "/tmp/frames";
      if (fs.existsSync(framesDir)) {
        fs.rmSync(framesDir, {recursive: true, force: true});
      }
      fs.mkdirSync(framesDir);
      const outputGifPath = "/tmp/output.gif";
      if (fs.existsSync(outputGifPath)) fs.unlinkSync(outputGifPath);

      // 1. Extract frames from video (as PNG for compatibility)
      await new Promise((resolve, reject) => {
        ffmpeg(videoUrl)
          .outputOptions([
            "-t", "3",
            "-vf", "fps=30,scale=1080:-1:flags=lanczos",
          ])
          .save(path.join(framesDir, "frame-%03d.png"))
          .on("end", resolve)
          .on("error", reject);
      });

      // 2. Remove background from each frame
      // (PNG, check with sharp, try file path then buffer)
      const frameFiles = fs.readdirSync(framesDir)
        .filter((f) => f.endsWith(".png"));
      for (const file of frameFiles) {
        const filePath = path.join(framesDir, file);
        // Log file info for debugging
        const stats = fs.statSync(filePath);
        console.log("Processing:", filePath, "size:", stats.size);
        // Check PNG validity with sharp
        try {
          await sharp(filePath).metadata();
        } catch (e) {
          console.error("Sharp could not decode:", filePath, e);
          continue; // skip this frame
        }
        // Try removeBackground with file path, then buffer
        let blob;
        try {
          blob = await removeBackground(filePath);
        } catch (e1) {
          console.error(
            "removeBackground failed with file path:", filePath, e1
          );
          try {
            const inputBuffer = fs.readFileSync(filePath);
            blob = await removeBackground(inputBuffer);
          } catch (e2) {
            console.error(
              "removeBackground failed with buffer:", filePath, e2)
            ;
            continue; // skip this frame
          }
        }
        // Composite the result over a solid color (white) background
        const outputBuffer = Buffer.from(await blob.arrayBuffer());

        const composited = await sharp(outputBuffer)
          .flatten({background: {r: 255, g: 255, b: 255}}) // white background
          .png()
          .toBuffer();
        fs.writeFileSync(filePath, composited);
      }

      // 3. Re-encode frames into a GIF
      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(path.join(framesDir, "frame-%03d.png"))
          .outputOptions(["-t", "3",
            "-vf", "fps=30,scale=1080:-1:flags=lanczos"])
          .toFormat("gif")
          .save(outputGifPath)
          .on("end", resolve)
          .on("error", reject);
      });

      // 4. Upload the GIF to Supabase
      const buffer = fs.readFileSync(outputGifPath);
      const key = `gifs/${Date.now()}-${Math.floor(Math.random()*1e6)}.gif`;
      try {
        const uploadResponse = await uploadGIFToSupabase(buffer, key);
        res.status(200).json(uploadResponse);
      } catch (uploadErr: any) {
        logger.error("Supabase upload error", uploadErr);
        res.status(500).json({error: "Failed to upload GIF to Supabase"});
      }
    } catch (err: any) {
      logger.error("Unexpected error", err);
      if (!responseSent) {
        res.status(500).json({error: err.message});
      }
    }
  });
});

export const extractFramesFromVideoUrl = onRequest(async (req, res) => {
  cors({origin: true})(req, res, async () => {
    try {
      const {videoUrl, width, userGifRequestId, userId} = req.query;
      if (
        typeof videoUrl !== "string" ||
        typeof width !== "string" ||
        typeof userGifRequestId !== "string" ||
        typeof userId !== "string"
      ) {
        res.status(400).json({
          error:
            "Missing or invalid required parameters: "+
            "videoUrl, width, userGifRequestId, userId",
        });
        return;
      }

      supabase
        .from("UserGifRequest")
        .update({
          requestStatus: "EXTRACTING_FRAMES",
        }).eq("id", userGifRequestId).then((value) => {
          console.log(value);
        });

      // Respond immediately
      res.status(202).json({
        status: "processing",
        code: 202,
        message: "Frame extraction started. Check frame statuses in DB.",
      });

      // Start background processing (do not await)
      (async () => {
        /**
         * Extracts WebP images from a buffer.
         * @param {Buffer} buffer - The buffer containing WebP images.
         * @return {Buffer[]} Array of WebP image buffers.
         */
        function extractWebPs(buffer: Buffer): Buffer[] {
          const webpHeader = Buffer.from("RIFF");
          const webpType = Buffer.from("WEBP");
          let offset = 0;
          const results: Buffer[] = [];
          while (offset < buffer.length) {
            const riffIndex = buffer.indexOf(webpHeader, offset);
            if (riffIndex === -1 || riffIndex + 12 > buffer.length) break;
            // Get chunk size (bytes 4-7, little endian)
            const size = buffer.readUInt32LE(riffIndex + 4);
            // Check for WEBP type
            if (
              buffer.slice(riffIndex + 8, riffIndex + 12).equals(webpType) &&
              riffIndex + 8 + size <= buffer.length
            ) {
              const end = riffIndex + 8 + size;
              results.push(buffer.slice(riffIndex, end));
              offset = end;
            } else {
              break;
            }
          }
          return results;
        }

        const frameStream = new stream.PassThrough();
        const frameBuffers: Buffer[] = [];
        let leftover = Buffer.alloc(0);
        let count = 0;

        frameStream.on("data", (chunk: Buffer) => {
          leftover = Buffer.concat([leftover, chunk]);
          const webps = extractWebPs(leftover);
          let totalLength = 0;

          webps.forEach((buffer) => {
            count++;
            const key = `frames/${
              userId}/${userGifRequestId}/${count}.webp`;
            try {
              supabase.storage
                .from(SUPABASE_BUCKET)
                .upload(key, buffer, {
                  contentType: "image/webp",
                  upsert: true,
                });

              supabase.storage
                .from(SUPABASE_BUCKET)
                .createSignedUrl(key, 631152000).then((value) => {
                  replaceFrameBackground({
                    userId,
                    userGifRequestId,
                    frameNumber: count,
                    imageUrl: value.data?.signedUrl || "",
                  });

                  supabase
                    .from("Frame")
                    .upsert(
                      {
                        id: `${userId}${userGifRequestId}${count}`,
                        userGifRequestId: userGifRequestId,
                        imageUrl: value?.data?.signedUrl,
                        frameStatus: "SUCCESS",
                      }).then((value) => {
                      console.log(value);
                    });
                }).catch(() => {
                  supabase
                    .from("Frame")
                    .upsert(
                      {
                        id: `${userId}${userGifRequestId}${count}`,
                        userGifRequestId: userGifRequestId,
                        frameStatus: "FAILED",
                      },
                    ).then((value) => {
                      console.log(value);
                    });
                });
            } catch (err) {
              logger.error("Unexpected error in background frame save", err);
            }

            frameBuffers.push(buffer);
            totalLength += buffer.length;
          });

          leftover = leftover.slice(totalLength);
        });

        frameStream.on("error", (err) => {
          logger.error("Frame stream error", err);
        });
        frameStream.on("end", () => {
          supabase
            .from("UserGifRequest")
            .update({
              requestStatus: "DONE_EXTRACTING_FRAMES",
            }).eq("id", userGifRequestId).then((value) => {
              console.log(value);
            });
        });

        // Start ffmpeg process
        ffmpeg(videoUrl as string)
          .outputOptions([
            "-t",
            "2",
            "-vf",
            `fps=30,scale=${width}:-1:flags=lanczos`,
            "-f",
            "image2pipe",
            "-vcodec",
            "libwebp",
            "-lossless", "1", // or remove for lossy, or use "-qscale", "80"
          ])
          .format("image2pipe")
          .on("error", (err) => {
            logger.error("ffmpeg error", err);
          })
          .pipe(frameStream, {end: true});
      })();
    } catch (err) {
      logger.error(
        "Unexpected error",
        err instanceof Error ? err : String(err)
      );
      res.status(500).json({
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });
});

export const removeImageUrlBackground = onRequest({
  timeoutSeconds: 540,
  memory: "2GiB",
}, async (req, res) => {
  cors({origin: true})(req, res, async () => {
    try {
      const {imageUrl, userGifRequestId, userId, frameNumber} = req.query;
      if (
        typeof imageUrl !== "string" ||
        typeof frameNumber !== "string" ||
        typeof userGifRequestId !== "string" ||
        typeof userId !== "string"
      ) {
        res.status(400).json({
          error:
            "Missing or invalid required parameters: "+
            "videoUrl, width, userGifRequestId, userId",
        });
        return;
      }
      const frameId = `${userId}${userGifRequestId}${frameNumber}`;

      removeBackground(imageUrl as string).then((blob) => {
        blob.arrayBuffer()
          .then((arrayBuffer) => {
            const outputBuffer = Buffer.from(arrayBuffer);
            sharp(outputBuffer)
              .flatten({background: {r: 255, g: 255, b: 255}})
              .png()
              .toBuffer().then((compositedBuffer) => {
                // update
                const key = `frames/${
                  userId}/${userGifRequestId}/${frameNumber}-composited.png`;
                try {
                  supabase.storage
                    .from(SUPABASE_BUCKET)
                    .upload(key, compositedBuffer, {
                      contentType: "image/webp",
                      upsert: true,
                    }).then(() => {
                      supabase.storage
                        .from(SUPABASE_BUCKET)
                        .createSignedUrl(key, 631152000).then((value) => {
                          supabase
                            .from("Frame")
                            .update(
                              {
                                imageUrlComposited: value?.data?.signedUrl,
                                frameStatus: "SUCCESS",
                              }
                            )
                            .eq("id", frameId)
                            .then((value) => {
                              console.log(value);
                              res.status(201).json({
                                status: "SUCCEsS", message: value,
                              });
                            });
                        }).catch((ex) => {
                          supabase
                            .from("Frame")
                            .update(
                              {
                                frameStatus: "FAILED",
                              })
                            .eq("id", frameId).then((value) => {
                              console.log(value);
                            });

                          console.error(ex);
                          res.status(500).json({
                            status: "ERROR", message: `${ex}`,
                          });
                        });
                    })
                    .catch((ex) => {
                      console.error(ex);
                      res.status(500).json({
                        status: "ERROR", message: `${ex}`,
                      });
                    });
                } catch (ex) {
                  console.error(ex);
                  res.status(500).json({status: "ERROR", message: `${ex}`});
                }
              }).catch((ex) => {
                console.error(ex);
                res.status(500).json({status: "ERROR", message: `${ex}`});
              });
          }).catch((ex) => {
            console.error(ex);
            res.status(500).json({status: "ERROR", message: `${ex}`});
          });
      }).catch((ex) => {
        console.error(ex);
        res.status(500).json({status: "ERROR", message: `${ex}`});
      });
    } catch (ex) {
      console.error(ex);
      res.status(500).json({status: "ERROR", message: `${ex}`});
    }
  });
});
