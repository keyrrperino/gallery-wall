/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Webcam from 'react-webcam';

import { useUser } from '@saas/auth/hooks/use-user';
import SimpleButton from '@marketing/home/components/Button';
import SnapButton from '@marketing/home/components/SnapButton';
import Modal from '@marketing/home/components/Popups/Modal';
import { v4 } from 'uuid';
import { CountdownTimer } from '@marketing/home/components/CountdownTimer';
import { KEY, openDB, STORE_NAME } from '../../../../lib/indexDB';
import { Button } from '@ui/components/button';
import { ChevronRightIcon, XIcon } from 'lucide-react';

enum COUNTDOWN_TIMER_STATE {
  STARTED = 'STARTED',
  END = 'END',
  PAUSE = 'PAUSE',
  STOP = 'STOP',
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
  const noRemoveBackground = searchParams.get('noRemoveBackground');
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}`
    : '';

  const webcamRef = useRef<Webcam | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  const [isRecording, setRecording] = useState(false);
  const [, setStream] = useState<MediaStream | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [isCountingKey, setIsCountingKey] = useState<string>('');
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
      router.push('/' + additionUrl);
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
      setError('Camera not ready');
      setRecording(false);
      return;
    }
    let options: MediaRecorderOptions = {};
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      options = { mimeType: 'video/webm;codecs=vp9' };
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      options = { mimeType: 'video/webm;codecs=vp8' };
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      options = { mimeType: 'video/webm' };
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      options = { mimeType: 'video/mp4' };
    } else {
      options = {}; // Let the browser pick
    }

    const recorder = new MediaRecorder(stream, options);
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: 'video/webm' });
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
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(blob, KEY);
        return new Promise<void>((resolve, reject) => {
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const createGIF = () => {
    captureFramesFromStream(getStream(), 2, 12)
      .then((data: { frames: Blob[]; width: number; height: number }) => {
        const { frames, width, height } = data;
        // Upload frames as FormData (multipart)
        const formData = new FormData();
        frames.forEach((blob, i) => {
          formData.append('images', blob, `frame${i}.webp`);
        });
        formData.append('userGifRequestId', userGifRequestId);
        formData.append('userId', '1');
        formData.append('targetWidth', `${width}`);
        formData.append('targetHeight', `${height}`);
        formData.append('pledge', pledge);

        getGifUrl(formData, noRemoveBackground ? true : false)
          .then(() => {
            console.info('GIF generation successful');
          })
          .catch(() => {
            console.error('GIF generation failed');
          });
      })
      .catch(() => {
        setError('Failed to upload frames');
      });
  };

  const captureFramesFromStream = (
    stream: MediaStream | null,
    duration = 2,
    fps = 12
  ) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.srcObject = stream;
      video
        .play()
        .then(() => {
          // Always use 672x672 (square)
          const newWidth = 672;
          const newHeight = 672;
          const canvas = document.createElement('canvas');
          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext('2d');
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
              return canvas.toBlob(res, 'image/webp', 1);
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
      onGenerateGIF(imageUrl ?? '', previewUrl);
    }
  };

  const onCloseError = () => {
    setImageUrl(null);
    setVideoTaken(false);
    setHasError(false);
    setTimer(60);
    setCountdownState(COUNTDOWN_TIMER_STATE.STARTED);
  };

  const videoConstraints = { facingMode: 'user' };

  return (
    <div className="flex h-dvh w-screen flex-col items-center justify-between bg-black">
      {hasError && (
        <Modal isOpen>
          <div className="text-center text-4xl font-bold text-white">
            <p>Oops! something went wrong.</p>
            <SimpleButton onClick={onCloseError}>Close</SimpleButton>
          </div>
        </Modal>
      )}

      {/* HEADER */}
      <div className="font-text-bold relative top-0 flex w-full flex-shrink-0 items-center justify-between px-6 py-16 text-white">
        <Button onClick={onExit} variant="ghost" asChild size="icon">
          <XIcon strokeWidth={4} className="h-12 w-12 text-white" />
        </Button>
        <h1 className="font-text-bold text-center text-[64px] uppercase leading-[1] tracking-[-1.28px]">
          TAKE YOUR VIDEO SELFIE!
        </h1>
        <div className="h-12 w-12"></div>
      </div>

      {/* CAMERA AREA */}
      <div className="flex h-[60dvh] w-full flex-col items-center justify-center">
        <div className="relative flex aspect-square h-full items-center justify-center border-[16px] border-white">
          {!previewUrl ? (
            <>
              <div className="absolute inset-0 h-full w-full">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  mirrored={true}
                  videoConstraints={videoConstraints}
                  className={`absolute inset-0 h-full w-full object-cover ${imageUrl ? 'hidden' : ''}`}
                />
              </div>
              {isCounting && (
                <CountdownTimer
                  key={isCountingKey}
                  initialCount={3}
                  onEnd={handleCountdownEnd}
                />
              )}
            </>
          ) : (
            <video
              src={previewUrl}
              ref={previewVideoRef}
              className="absolute inset-0 size-full h-full w-full object-cover"
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

      {/* BOTTOM BUTTONS */}
      <div className="flex h-52 w-full items-center justify-center bg-black/75">
        {previewUrl && videoTaken && !isRecording ? (
          <div className="flex h-full w-full flex-row items-center justify-between px-20 py-8 landscape:w-[60dvh] landscape:px-0">
            <Button
              variant="link"
              className="font-text-bold h-auto text-[32px] text-white"
              onClick={retake}
            >
              RETAKE
            </Button>
            <Button
              variant="link"
              className="font-text-bold h-auto text-[32px] text-white"
              onClick={() => {
                generateFace();
              }}
            >
              USE THIS SELFIE <ChevronRightIcon className="h-8 w-8" />
            </Button>
          </div>
        ) : (
          <SnapButton
            onClick={capture}
            size="w-[72px] h-[72px]"
            isRecording={isRecording}
            isCounting={isCounting}
            recordingDuration={2}
          />
        )}
      </div>
    </div>
  );
}
