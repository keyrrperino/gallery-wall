/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import Image from "next/image";
import { Cross2Icon } from "@radix-ui/react-icons";

import { apiClient } from "@shared/lib/api-client";
import { useUser } from "@saas/auth/hooks/use-user";
import SimpleButton from "@marketing/home/components/Button";
import SnapButton from "@marketing/home/components/SnapButton";
import Processing from "@marketing/home/components/Modal-content/Processing";
import Modal from "@marketing/home/components/Popups/Modal";
import { v4 } from "uuid";
import { FACE_GEN_BUCKET_NAME } from "utils";
import { CountdownTimer } from "@marketing/home/components/CountdownTimer";

enum COUNTDOWN_TIMER_STATE {
  STARTED = "STARTED",
  END = "END",
  PAUSE = "PAUSE",
  STOP = "STOP",
}

interface SelfieCameraModeProps {
  onExit: () => void;
}

export default function SelfieCameraMode({ onExit }: SelfieCameraModeProps) {
  const router = useRouter();
  const { user } = useUser();

  const webcamRef = useRef<Webcam | null>(null);

  const faceGen = apiClient.ai.faceGen.useMutation();
  const getSignedUploadUrl = apiClient.uploads.signedUploadUrl.useMutation();
  const getStorageSignedUrl = apiClient.uploads.signedUrl.useMutation();

  const [historyPhotos, setHistoryPhotos] = useState<string[][]>([]);
  const [historyFiles, setHistoryFiles] = useState<File[][]>([]);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [isCountingKey, setIsCountingKey] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [animateSnap, setAnimateSnap] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [countdownState, setCountdownState] = useState<COUNTDOWN_TIMER_STATE>(
    COUNTDOWN_TIMER_STATE.STOP
  );
  const [hasError, setHasError] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [picturesTaken, setPicturesTaken] = useState<boolean>(false);

  const { data: faceGenRequestImages } = apiClient.images.getImages.useQuery(
    { userRequestId: requestId ?? "" },
    { enabled: !!requestId, refetchInterval: 2000 }
  );

  useEffect(() => {
    if (countdownState === COUNTDOWN_TIMER_STATE.STARTED) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 1) return prevTimer - 1;
          setCountdownState(COUNTDOWN_TIMER_STATE.END);
          return 0;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [countdownState]);

  useEffect(() => {
    if (requestId && faceGenRequestImages && faceGenRequestImages.length >= 3) {
      setIsProcessing(false);
      router.push(`/results?requestId=${requestId}`);
    }
  }, [faceGenRequestImages, requestId, router]);

  useEffect(() => {
    if (user !== null && !user?.name) router.push("/");
  }, [user]);

  const capture = () => {
    if (countdownState === COUNTDOWN_TIMER_STATE.STOP) {
      setTimer(60);
      setCountdownState(COUNTDOWN_TIMER_STATE.STARTED);
    }
    setIsCountingKey(v4());
    setIsCounting(true);
    setImageUrl(null);
  };

  const handleCountdownEnd = async () => {
    setIsCounting(false);
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const blob = await (await fetch(imageSrc)).blob();
    const imgUrl = URL.createObjectURL(blob);
    setImageUrl(imgUrl);
    setAnimateSnap(true);
    setTimeout(() => setAnimateSnap(false), 100);

    const newPhotos = [...photos, imgUrl];
    const file = new File([blob], "selfie.png", { type: "image/png" });
    setPhotos(newPhotos);

    setFiles((oldFiles) => {
      const newFiles = [...oldFiles, file];
      if (newFiles.length >= 3) {
        setHistoryPhotos((old) => [...old, newPhotos]);
        setHistoryFiles((old) => [...old, newFiles]);
      } else {
        setTimeout(() => capture(), 1000);
      }
      return newFiles;
    });

    if (newPhotos.length < 3) {
      setTimeout(() => {
        setCurrentPhotoIndex(newPhotos.length);
        setImageUrl(null);
      }, 1000);
    } else {
      setTimeout(() => {
        setPicturesTaken(true);
      }, 1500);
    }
  };

  const retake = () => {
    setImageUrl(null);
    setFiles([]);
    setPhotos([]);
    setCurrentPhotoIndex(0);
    setPicturesTaken(false);
  };

  const generateFace = async () => {
    setCountdownState(COUNTDOWN_TIMER_STATE.PAUSE);
    setIsProcessing(true);
    setIsCounting(false);

    const newFiles = files.length >= 3 ? files : historyFiles[historyFiles.length - 1];

    try {
      const gcpStorageImageUrls = await Promise.all(
        newFiles.map(async (file) => {
          const path = `uploads/${v4()}.png`;
          const signedUploadUrl = await getSignedUploadUrl.mutateAsync({
            path,
            bucket: FACE_GEN_BUCKET_NAME,
          });
          await fetch(signedUploadUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/octet-stream" },
            body: file,
          });
          const gcpStorageImageUrl = await getStorageSignedUrl.mutateAsync({
            path,
            bucket: FACE_GEN_BUCKET_NAME,
          });
          return gcpStorageImageUrl;
        })
      );

      const faceGenRequestResult = await faceGen.mutateAsync({
        imageUrls: gcpStorageImageUrls,
      });
      setRequestId(faceGenRequestResult.requestId);
    } catch (err) {
      console.error(err);
      setHasError(true);
    }

    setIsProcessing(false);
  };

  const onCloseError = () => {
    setImageUrl(null);
    setFiles([]);
    setPhotos([]);
    setCurrentPhotoIndex(0);
    setPicturesTaken(false);
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
        (isProcessing || (requestId && (faceGenRequestImages ?? []).length < 3)) && (
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
        {!picturesTaken ? (
          <div className="flex size-full items-center justify-center">
            <div className="relative w-1/2 flex size-full max-w-full items-center justify-center border-[20px] border-white">
              {isCounting && (
                <CountdownTimer
                  key={isCountingKey}
                  initialCount={3}
                  onEnd={handleCountdownEnd}
                />
              )}
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Captured selfie"
                  className="absolute size-full object-cover brightness-50 grayscale"
                  layout="fill"
                />
              )}
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Captured selfie"
                  className={`absolute z-10 size-full border-8 border-white object-cover transition-transform duration-100 ${
                    animateSnap ? "rotate-1 scale-105 blur-sm" : "rotate-2 scale-90 blur-none"
                  }`}
                  layout="fill"
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
                <Image
                  src={photos[2]}
                  alt="Captured selfie 1"
                  className="size-full border-4 border-white object-cover"
                  layout="fill"
                />
              </div>
              <div className="relative">
                <Image
                  src={photos[1]}
                  alt="Captured selfie 2"
                  className="size-full border-4 border-white object-cover"
                  layout="fill"
                />
              </div>
              <div className="relative">
                <Image
                  src={photos[0]}
                  alt="Captured selfie 3"
                  className="size-full border-4 border-white object-cover"
                  layout="fill"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="flex h-1/3 w-full items-center justify-center bg-black/75">
        {!imageUrl && currentPhotoIndex < 3 && !isCounting && !picturesTaken ? (
          <SnapButton onClick={capture} size="w-48" />
        ) : (
          <div className="flex w-full">
            {photos.length === 3 && (
              <div className="flex flex-row w-full items-center justify-around gap-4 pb-16">
                <div></div>
                <button
                  className="text-4xl font-text-bold text-white text-[80px]"
                  onClick={retake}
                >
                  RETAKE
                </button>
                <button
                  className="text-4xl font-text-bold text-white text-[80px]"
                  onClick={generateFace}
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
