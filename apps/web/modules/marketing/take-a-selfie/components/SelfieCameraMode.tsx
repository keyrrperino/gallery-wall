/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { Cross2Icon } from "@radix-ui/react-icons";

import { useUser } from "@saas/auth/hooks/use-user";
import SimpleButton from "@marketing/home/components/Button";
import SnapButton from "@marketing/home/components/SnapButton";
import Processing from "@marketing/home/components/Modal-content/Processing";
import Modal from "@marketing/home/components/Popups/Modal";
import { v4 } from "uuid";
import { CountdownTimer } from "@marketing/home/components/CountdownTimer";

enum COUNTDOWN_TIMER_STATE {
  STARTED = "STARTED",
  END = "END",
  PAUSE = "PAUSE",
  STOP = "STOP",
}

type SelfieCameraModePropType = {
  onExit: () => void;
}

export default function SelfieCameraMode({ onExit }: SelfieCameraModePropType) {
  const router = useRouter();
  const { user } = useUser();

  const webcamRef = useRef<Webcam | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  const [, setRecording] = useState(false);
  const [, setStream] = useState<MediaStream | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [isCountingKey, setIsCountingKey] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
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
      router.push("/");
    }
  }, [user]);

  const capture = () => {
    setIsCountingKey(v4());
    handleRecord();
    createGIF();
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
    const stream = webcamRef.current?.video?.srcObject as MediaStream;
    if (!stream) {
      setError("Camera not ready");
      setRecording(false);
      return;
    }
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
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
    };
    recorder.start();
    setTimeout(() => {
      recorder.stop();
      setRecording(false);
    }, 2000);
  };

  const createGIF = () => {
    captureFramesFromStream(getStream(), 2, 12).then((data: {
      frames: Blob[];
      width: number;
      height: number;
    }) => {
      const {
        frames,
        width,
        height
      } = data;
      // Upload frames as FormData (multipart)
      const formData = new FormData();
      frames.forEach((blob, i) => {
        formData.append("images", blob, `frame${i}.webp`);
      });
      formData.append("userGifRequestId", "1");
      formData.append("userId", "1");
      formData.append("targetWidth", `${width}`);
      formData.append("targetHeight", `${height}`);

      fetch("https://python-functions-665982940607.asia-southeast1.run.app/process-frames-to-gif", {
        method: "POST",
        body: formData,
      }).then((response) => {
        response.json().then((result: {
          status: string;
          gifUrl: string;
          success: string;
        }) => {
          console.log(result);
          // const newImageUrl = result?.gifUrl ? result.gifUrl as string : null;
          setImageUrl(result.gifUrl);
        }).catch(() => {
          setError("Failed to upload frames");
        });
      }).catch(() => {
        setError("Failed to upload frames");
      });
    }).catch(() => {
      setError("Failed to upload frames");
    });
  };

  const captureFramesFromStream = (stream: MediaStream | null, duration = 2, fps = 12) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play().then(() => {
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
          let sx = 0, sy = 0, sWidth = vW, sHeight = vH;
          if (vW > vH) {
            // Landscape: crop left/right
            sx = Math.floor((vW - vH) / 2);
            sWidth = vH;
          } else if (vH > vW) {
            // Portrait: crop top/bottom
            sy = Math.floor((vH - vW) / 2);
            sHeight = vW;
          }
          ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, newWidth, newHeight);
          new Promise<Blob | null>((res) => {
            return canvas.toBlob(res, "image/webp", 1)
          }).then((blob) => {
            if (blob) {
              frames.push(blob);
            }
            count++;
            if (count >= totalFrames) {
              clearInterval(interval);
              video.pause();
              resolve({ frames, width: newWidth, height: newHeight });
            }
          }).catch(reject);
        }, 1000 / fps);  
      }).catch((error) => {
        reject(error);
      });
    });
  }

  const handleCountdownEnd = async () => {
    setIsCounting(false);
    setVideoTaken(true);
  };

  const retake = () => {
    setImageUrl(null);
    setVideoTaken(false);
    setPreviewUrl(null);
  };

  const generateFace = () => {
    setCountdownState(COUNTDOWN_TIMER_STATE.PAUSE);
    setIsProcessing(true);
    setIsCounting(false);
  };

  useEffect(() => {
    if (isProcessing && imageUrl) {
      router.push(`/enter-pin-code?gif=${imageUrl}`);
    }
  }, [imageUrl, isProcessing]);

  const onCloseError = () => {
    setImageUrl(null);
    setVideoTaken(false);
    setIsProcessing(false);
    setHasError(false);
    setTimer(60);
    setCountdownState(COUNTDOWN_TIMER_STATE.STARTED);
  };

  const videoConstraints = { facingMode: "user" };

  return (
    <div className="bg-black h-full w-full flex flex-col items-center justify-end">
      {hasError ? (
        <Modal isOpen>
          <div className="text-center text-4xl font-bold text-white">
            <p>Oops! something went wrong.</p>
            <SimpleButton onClick={onCloseError}>Close</SimpleButton>
          </div>
        </Modal>
      ) : (
        isProcessing && (
          <Processing />
        )
      )}

      {/* HEADER */}
      <div className="relative top-0 flex w-full items-center justify-between py-4 font-text-bold text-white">
        <div className="flex w-full items-center justify-between h-80 px-16">
          <div></div>
          <h2 className="text-[110px]">TAKE YOUR VIDEO SELFIE!</h2>
          <button onClick={onExit}>
            <Cross2Icon color="white" width={120} height={120} />
          </button>
        </div>
      </div>

      {/* CAMERA AREA */}
      <div className="flex size-full flex-col items-center justify-start">
        {!videoTaken ? (
          <div className="flex size-full items-center justify-center">
            <div className="relative w-1/2 flex size-full max-w-full items-center justify-center border-[20px] border-white">
              {isCounting && (
                <CountdownTimer
                  key={isCountingKey}
                  initialCount={2}
                  onEnd={handleCountdownEnd}
                />
              )}
              <Webcam
                ref={webcamRef}
                audio={false}
                mirrored={true}
                videoConstraints={videoConstraints}
                className={`absolute size-full object-cover ${imageUrl ? "hidden" : ""}`}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-[90%] w-screen flex-col items-center justify-center">
            <h1 className="font-button-base py-10 text-6xl uppercase text-white">
              Are these good to go?
            </h1>
            <div className="mt-4 grid h-full w-[900px] grid-cols-2 justify-center gap-4">
              <div className="relative col-span-2 row-span-2">
                {previewUrl && 
                  <video
                    src={previewUrl}
                    controls
                    ref={previewVideoRef}
                    className="size-full border-4 border-white object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <track kind="captions" />
                  </video>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="flex h-1/3 w-full items-center justify-center bg-black/75">
        {!isCounting && !videoTaken ? (
          <SnapButton onClick={capture} size="w-48" />
        ) : (
          <div className="flex w-full">
            {videoTaken && (
              <div className="flex flex-row w-full items-center justify-around gap-4 pb-16">
                <div></div>
                <button
                  className="font-text-bold text-white text-[80px]"
                  onClick={retake}
                >
                  RETAKE
                </button>
                <button
                  className="font-text-bold text-white text-[80px]"
                  onClick={() => {generateFace();}}
                >
                  USE THIS SELFIE {">"}
                </button>
                <div></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
