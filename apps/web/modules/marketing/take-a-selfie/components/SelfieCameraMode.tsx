/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Webcam from "react-webcam";
import { Cross2Icon } from "@radix-ui/react-icons";

import { useUser } from "@saas/auth/hooks/use-user";
import SimpleButton from "@marketing/home/components/Button";
import SnapButton from "@marketing/home/components/SnapButton";
import Modal from "@marketing/home/components/Popups/Modal";
import { v4 } from "uuid";
import { CountdownTimer } from "@marketing/home/components/CountdownTimer";
import { KEY, openDB, STORE_NAME } from "../../../../lib/indexDB";
import { Button } from "@ui/components/button";

enum COUNTDOWN_TIMER_STATE {
  STARTED = "STARTED",
  END = "END",
  PAUSE = "PAUSE",
  STOP = "STOP",
}

type SelfieCameraModePropType = {
  onExit: () => void;
  onGenerateGIF: (gifUrl: string, videoUrl: string) => void;
  pledge: string;
  userGifRequestId: string;
};

export default function SelfieCameraMode({
  onExit,
  onGenerateGIF,
  pledge,
  userGifRequestId,
}: SelfieCameraModePropType) {
  const router = useRouter();
  const { user, getGifUrl } = useUser();
  const searchParams = useSearchParams();
  const noRemoveBackground = searchParams.get("noRemoveBackground");
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}`
    : "";

  const webcamRef = useRef<Webcam | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  const [isRecording, setRecording] = useState(false);
  const [, setStream] = useState<MediaStream | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [isCountingKey, setIsCountingKey] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [, setTimer] = useState<number>(60);
  const [, setError] = useState<string | null>(null);
  const [countdownState, setCountdownState] = useState<COUNTDOWN_TIMER_STATE>(
    COUNTDOWN_TIMER_STATE.STOP
  );
  const [hasError, setHasError] = useState(false);
  const [videoTaken, setVideoTaken] = useState<boolean>(false);

  useEffect(() => {
    if (countdownState === COUNTDOWN_TIMER_STATE.STARTED) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 1) {
            return prevTimer - 1;
          }
          setCountdownState(COUNTDOWN_TIMER_STATE.END);
          return 0;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [countdownState]);

  useEffect(() => {
    if (user !== null && !user?.name) {
      router.push("/" + additionUrl);
    }
  }, [user]);

  const capture = () => {
    setIsCountingKey(v4());
    setVideoTaken(false);
    setIsCounting(true);
    setImageUrl(null);
  };

  const getStream = () => {
    const video = webcamRef.current?.video as HTMLVideoElement | undefined;
    const streamPartial = video?.srcObject as MediaStream | null;
    setStream(streamPartial);

    return streamPartial;
  };

  const handleRecord = () => {
    setError(null);
    setRecording(true);
    setPreviewUrl(null);
    const stream: MediaStream = webcamRef.current?.video
      ?.srcObject as MediaStream;
    if (!stream) {
      setError("Camera not ready");
      setRecording(false);
      return;
    }
    let options: MediaRecorderOptions = {};
    if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      options = { mimeType: "video/webm;codecs=vp9" };
    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
      options = { mimeType: "video/webm;codecs=vp8" };
    } else if (MediaRecorder.isTypeSupported("video/webm")) {
      options = { mimeType: "video/webm" };
    } else if (MediaRecorder.isTypeSupported("video/mp4")) {
      options = { mimeType: "video/mp4" };
    } else {
      options = {}; // Let the browser pick
    }

    const recorder = new MediaRecorder(stream, options);
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        console.log(e.data);
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      setPreviewUrl(URL.createObjectURL(videoBlob));
      setRecording(false);
      setVideoTaken(true);

      saveBlobToIndexedDB(videoBlob);

      // // Save to localStorage as Data URL
      // const reader = new FileReader();
      // reader.onload = function () {
      //   // Save the Data URL string to localStorage
      //   localStorage.setItem("videoPreviewBlob", reader.result as string);
      // };
      // reader.readAsDataURL(videoBlob);
    };
    recorder.start();
    setTimeout(() => {
      recorder.stop();
    }, 2000);
  };

  function saveBlobToIndexedDB(blob: Blob) {
    openDB()
      .then((db) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(blob, KEY);
        return new Promise<void>((resolve, reject) => {
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const createGIF = () => {
    captureFramesFromStream(getStream(), 2, 12)
      .then((data: { frames: Blob[]; width: number; height: number }) => {
        const { frames, width, height } = data;
        // Upload frames as FormData (multipart)
        const formData = new FormData();
        frames.forEach((blob, i) => {
          formData.append("images", blob, `frame${i}.webp`);
        });
        formData.append("userGifRequestId", userGifRequestId);
        formData.append("userId", "1");
        formData.append("targetWidth", `${width}`);
        formData.append("targetHeight", `${height}`);
        formData.append("pledge", pledge);

        getGifUrl(formData, noRemoveBackground ? true : false)
          .then(() => {
            console.log("success");
          })
          .catch(() => {
            console.log("error");
          });
      })
      .catch(() => {
        setError("Failed to upload frames");
      });
  };

  const captureFramesFromStream = (
    stream: MediaStream | null,
    duration = 2,
    fps = 12
  ) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video
        .play()
        .then(() => {
          // Always use 672x672 (square)
          const newWidth = 672;
          const newHeight = 672;
          const canvas = document.createElement("canvas");
          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve({ frames: [], width: newWidth, height: newHeight });
            return;
          }

          const frames: Blob[] = [];
          let count = 0;
          const totalFrames = duration * fps;

          const interval = setInterval(() => {
            // Center crop the video to a 1:1 aspect ratio before resizing
            const vW = video.videoWidth;
            const vH = video.videoHeight;
            let sx = 0,
              sy = 0,
              sWidth = vW,
              sHeight = vH;
            if (vW > vH) {
              // Landscape: crop left/right
              sx = Math.floor((vW - vH) / 2);
              sWidth = vH;
            } else if (vH > vW) {
              // Portrait: crop top/bottom
              sy = Math.floor((vH - vW) / 2);
              sHeight = vW;
            }
            ctx.drawImage(
              video,
              sx,
              sy,
              sWidth,
              sHeight,
              0,
              0,
              newWidth,
              newHeight
            );
            new Promise<Blob | null>((res) => {
              return canvas.toBlob(res, "image/webp", 1);
            })
              .then((blob) => {
                if (blob) {
                  frames.push(blob);
                }
                count++;
                if (count >= totalFrames) {
                  clearInterval(interval);
                  video.pause();
                  resolve({ frames, width: newWidth, height: newHeight });
                }
              })
              .catch(reject);
          }, 1000 / fps);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const handleCountdownEnd = async () => {
    setIsCounting(false);

    handleRecord();
    createGIF();
  };

  const retake = () => {
    setImageUrl(null);
    setVideoTaken(false);
    setPreviewUrl(null);
  };

  const generateFace = () => {
    setCountdownState(COUNTDOWN_TIMER_STATE.PAUSE);
    setIsCounting(false);

    if (previewUrl) {
      onGenerateGIF(imageUrl ?? "", previewUrl);
    }
  };

  const onCloseError = () => {
    setImageUrl(null);
    setVideoTaken(false);
    setHasError(false);
    setTimer(60);
    setCountdownState(COUNTDOWN_TIMER_STATE.STARTED);
  };

  const videoConstraints = { facingMode: "user" };

  return (
    <div className="bg-black h-full w-full flex flex-col items-center">
      {hasError && (
        <Modal isOpen>
          <div className="text-center text-4xl font-bold text-white">
            <p>Oops! something went wrong.</p>
            <SimpleButton onClick={onCloseError}>Close</SimpleButton>
          </div>
        </Modal>
      )}

      {/* HEADER */}
      <div className="relative top-0 flex w-full items-center justify-between py-[1vh] font-text-bold text-white">
        <div className="flex w-full items-center justify-between px-[5vw] py-[3vh] gap-[1vh]">
          <Button onClick={onExit} variant="ghost" asChild size="icon">
            <Cross2Icon className="w-12 h-12 text-white" />
          </Button>
          <h1 className="text-[3vh] md:text-[4vw] text-center font-text-bold uppercase leading-[1]">
            TAKE YOUR VIDEO SELFIE!
          </h1>
          <div className="w-12 h-12"></div>
        </div>
      </div>

      {/* CAMERA AREA */}
      <div className="flex flex-col items-center justify-start">
        {!previewUrl ? (
          <div className="relative aspect-square w-screen flex items-center justify-center">
            <div className="absolute inset-0 h-full w-full">
              {isCounting && (
                <div className="absolute inset-0 h-screen w-full bg-black/80 z-10 pointer-events-none" />
              )}
              <Webcam
                ref={webcamRef}
                audio={false}
                mirrored={true}
                videoConstraints={videoConstraints}
                className={`absolute inset-0 h-full w-full object-cover ${imageUrl ? "hidden" : ""}`}
              />
            </div>
            {isCounting && (
              <CountdownTimer
                key={isCountingKey}
                initialCount={3}
                onEnd={handleCountdownEnd}
              />
            )}
          </div>
        ) : (
          <div className="flex size-full items-center justify-center w-screen">
            <div className="relative aspect-square w-screen flex items-center justify-center">
              {previewUrl && (
                <video
                  src={previewUrl}
                  ref={previewVideoRef}
                  className="size-full absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <track kind="captions" />
                </video>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="flex w-full justify-center bg-black/75 items-center h-full">
        {!isCounting && !videoTaken && !isRecording ? (
          <SnapButton onClick={capture} size="w-[2vh] md:w-[1vh]" />
        ) : (
          <div className="flex w-full">
            {previewUrl && videoTaken && (
              <div className="flex flex-row w-full h-full items-center justify-between px-20 py-8">
                <button
                  className="font-text-bold text-white text-[32px]"
                  onClick={retake}
                >
                  RETAKE
                </button>
                <button
                  className="font-text-bold text-white text-[32px]"
                  onClick={() => {
                    generateFace();
                  }}
                >
                  USE THIS SELFIE {">"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
