/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { CountdownTimer } from "@marketing/home/components/CountdownTimer";
import { apiClient } from "@shared/lib/api-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import { useUser } from "@saas/auth/hooks/use-user";

import SimpleButton from "../../../../../modules/marketing/home/components/Button";

import SnapButton from "../../../../../modules/marketing/home/components/SnapButton";
import GlowingArrowDown from "../../../../../public/images/button-assets/camera/arrow-small-down.svg";
import GlowingArrowLeft from "../../../../../public/images/button-assets/camera/arrow-small-left.svg";

import Processing from "@marketing/home/components/Modal-content/Processing";
import Modal from "@marketing/home/components/Popups/Modal";
import GuidelinesPopup from "../../../../../modules/marketing/home/components/Popups/Guidelines";

import CircularCountdown from "@marketing/home/components/CircleCountdown";
import { cn } from "@ui/lib";
import { FACE_GEN_BUCKET_NAME } from "utils";
import { v4 } from "uuid";

enum COUNTDOWN_TIMER_STATE {
  STARTED = "STARTED",
  END = "END",
  PAUSE = "PAUSE",
  STOP = "STOP",
}

export default function TakeASelfie(props) {
  const router = useRouter();

  const { user } = useUser()

  const faceGen = apiClient.ai.faceGen.useMutation();
  const getSignedUploadUrl = apiClient.uploads.signedUploadUrl.useMutation();
  const getStorageSignedUrl = apiClient.uploads.signedUrl.useMutation();

  const webcamRef = useRef<Webcam | null>(null);

  const [historyPhotos, setHistoryPhotos] = useState<string[][]>([]);
  const [historyFiles, setHistoryFiles] = useState<File[][]>([]);

  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [isCountingKey, setIsCountingKey] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [showGuidelinesPopup, setShowGuidelinesPopup] = useState<boolean>(true);
  const [animateSnap, setAnimateSnap] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [countdownState, setCountdownState] = useState<COUNTDOWN_TIMER_STATE>(COUNTDOWN_TIMER_STATE.STOP);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (countdownState === COUNTDOWN_TIMER_STATE.STARTED) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            setCountdownState(COUNTDOWN_TIMER_STATE.END)
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [countdownState]);

  const { data: faceGenRequestImages, isLoading } = apiClient.images.getImages.useQuery({
    userFaceGenRequestId: requestId ?? ""
  },
    {
      enabled: !!requestId,
      refetchInterval: 2000
    }
  );


  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  const [picturesTaken, setPicturesTaken] = useState<boolean>(false);

  const onClickBack = () => {
    router.push("/details");
    setImageUrl(null);
    setFiles([]);
    setPhotos([]);
    setCurrentPhotoIndex(0);
    setPicturesTaken(false);
  }

  const capture = () => {
    if (countdownState === COUNTDOWN_TIMER_STATE.STOP) {
      setTimer(60);
      setCountdownState(COUNTDOWN_TIMER_STATE.STARTED);
    }

    setIsCountingKey(v4());
    setIsCounting(true);
    setImageUrl(null);
  };

  const retake = () => {
    setImageUrl(null);
    setFiles([]);
    setPhotos([]);
    setCurrentPhotoIndex(0);
    setPicturesTaken(false);
  }

  useEffect(() => {
    if (requestId && faceGenRequestImages && faceGenRequestImages?.length >= 3) {
      setIsProcessing(false)
      router.push(`/results?requestId=${requestId}`)
    }
  }, [faceGenRequestImages, requestId, router]);

  useEffect(() => {
    if (requestId) {
      setTimeout
    }
  }, [requestId]);

  useEffect(() => {
    if (user !== null) {
      if (!(user?.gender ?? user?.name ?? user?.isEighteenAndAbove)) {
        router.push("/");
      }
    }
  }, [user]);

  const closeGuidelinesPopup = () => {
    setShowGuidelinesPopup(false);
  };

  const handleCountdownEnd = async () => {
    setIsCounting(false);

    if (timer <= 0) {
      return;
    }

    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const fetchResponse = await fetch(imageSrc);
        const blob = await fetchResponse.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageUrl(imageUrl);
        setAnimateSnap(true);
        setTimeout(() => setAnimateSnap(false), 100);
        const newPhotos = [...photos, imageUrl];
        const file = new File([blob], "selfie.png", { type: "image/png" });
        setPhotos(newPhotos);

        setFiles((oldFiles) => {
          const newFiles = [...oldFiles, file];
          if (newFiles.length >= 3) {
            setHistoryPhotos((oldPhotos) => [...oldPhotos, newPhotos]);
            setHistoryFiles((oldFiles) => [...oldFiles, newFiles]);
          } else {
            setTimeout(() => {
              capture();
            }, 1000);
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
      }
    }


  };

  const generateFace = async () => {
    setCountdownState(COUNTDOWN_TIMER_STATE.PAUSE)
    setIsProcessing(true)
    setIsCounting(false);

    let newFiles: File[];

    if (files.length >= 3) {
      newFiles = files;
    } else {
      newFiles = historyFiles[historyFiles.length - 1];
    }

    try {
      const gcpStorageImageUrls: string[] = await Promise.all(newFiles.map(async (file) => {
        const path = `uploads/${v4()}.png`;

        const signedUploadUrl = await getSignedUploadUrl.mutateAsync({
          path: path,
          bucket: FACE_GEN_BUCKET_NAME
        });

        const responseUploadFile = await fetch(signedUploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/octet-stream",
          },
          body: file,
        });

        if (!responseUploadFile.ok) {
          throw new Error(`Server responded with ${responseUploadFile.status}`);
        }

        const gcpStorageImageUrl = await getStorageSignedUrl.mutateAsync({
          path,
          bucket: FACE_GEN_BUCKET_NAME
        });

        return gcpStorageImageUrl
      }));

      const faceGenRequestResult = await faceGen.mutateAsync({
        imageUrls: gcpStorageImageUrls
      });

      setRequestId(faceGenRequestResult.requestId)
    } catch (error) {
      console.log("error", error);
      setHasError(true)
    }

    setIsProcessing(false)
  }

  const onCloseError = () => {
    setImageUrl(null);
    setFiles([]);
    setPhotos([]);
    setCurrentPhotoIndex(0);
    setPicturesTaken(false);
    setIsProcessing(false);
    setHasError(false);
    setTimer(60);
    setCountdownState(COUNTDOWN_TIMER_STATE.STARTED)
  }

  const videoConstraints = {
    facingMode: "user"
  };

  const renderLoader = (isProcessing || (requestId && (faceGenRequestImages ?? []).length < 3)) && <Processing />;

  const renderMainMenuButton = <SimpleButton
    onClick={() => {
      router.push("/")
    }}
  >
    Back to main menu
  </SimpleButton>

  const renderNextButton = <SimpleButton
    onClick={generateFace}
  >
    NEXT
  </SimpleButton>

  const timeUpModal = ((!isProcessing && countdownState === COUNTDOWN_TIMER_STATE.END) &&
    <Modal isOpen>
      <div className="font-bold text-white">
        <div className="w-full max-w-xl text-center">
          <h2 className="font-button-base mb-[2vh] text-[2.5vh] uppercase text-[#FF0000]">Oops! you ran out of time</h2>
          <p className="font-text-base mb-[2vh] px-[2vh] text-center text-[1.4vh] uppercase tracking-[.1em]" >But don&apos;t worry! We will be using the previous set of photos taken</p>
          {historyPhotos.length === 0 ? renderMainMenuButton : renderNextButton}
        </div>
      </div>
    </Modal>
  );

  const renderErrorMessage = <Modal isOpen>
    <div className="text-center text-4xl font-bold text-white">
      <div className="flex w-full max-w-xl flex-col gap-4 px-20 md:px-4">
        <h3 className="font-button-base text-4xl uppercase text-[#FF0000] md:text-3xl">oops! something went wrong.</h3>
        <div className="font-text-base mb-4 pt-1 text-center text-2xl uppercase tracking-[.1em] md:text-sm">
          <p>Please try again! If errors persist please come back later. For concerns, please email us at [EMAIL ADDRESS]. </p>
        </div>
      </div>
    </div>
    <div className="mt-4 flex flex-col items-center gap-6">
      <SimpleButton
        onClick={onCloseError}
      >
        Close
      </SimpleButton>
    </div>
  </Modal>

  const renderRetakeButton = countdownState !== COUNTDOWN_TIMER_STATE.END && <SimpleButton
    onClick={retake}
  >
    Retake
  </SimpleButton>

  return (
    <div className="absolute top-0 flex h-screen w-screen flex-col items-center justify-end  px-8">
      {hasError ? renderErrorMessage : renderLoader}
      {timeUpModal}
      {showGuidelinesPopup && <GuidelinesPopup onClose={closeGuidelinesPopup} />}
      <div className="relative top-0 flex w-full items-center justify-between py-4">
        <button
          className="w-32"
          onClick={() => { onClickBack() }}
        >
          <Image
            src={GlowingArrowLeft}
            alt="Back"
            className=""
            height={200}
            width={200}
          />
        </button>
        <div className="relative flex size-24 items-center">
          <CircularCountdown timer={timer} />
          <span className="font-button-base absolute  inset-x-0 flex justify-center text-[64px] text-white [text-shadow:_4px_4px_8px_rgb(0_0_0_/_80%)]">{timer === -1 ? 0 : timer}</span>
        </div>
      </div>

      <div className="flex size-full flex-col items-center justify-start">
        {!picturesTaken ?
          <div className="flex size-full items-center justify-center border-8 border-white">
            <div className="relative flex size-full max-w-full items-center justify-center">
              {isCounting && <CountdownTimer key={isCountingKey} initialCount={3} onEnd={handleCountdownEnd} />}
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Captured selfie"
                  className="absolute size-full object-cover brightness-50 grayscale "
                  layout="fill"
                />
              )}
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Captured selfie"
                  className={`absolute z-10 size-full border-8 border-white object-cover transition-transform duration-100 ${animateSnap ? "rotate-1 scale-105 blur-sm" : "rotate-2 scale-90 blur-none "}`}
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
              {!imageUrl && !isCounting && (
                <div className="absolute bottom-0 w-full text-center">
                  <p className="font-text-base animate-pulse text-3xl text-white transition-all"
                    style={{
                      textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
                    }}>PRESS TO TAKE A PHOTO</p>
                  <div className="mt-4 flex justify-center text-green-500">
                    <Image
                      src={GlowingArrowDown}
                      alt="Back"
                      className="animate-bounce"
                      width={80}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          :

          <div className="flex h-[90%] w-screen flex-col items-center justify-center">
            <h1 className="font-button-base py-10 text-6xl uppercase text-white">Are these good to go?</h1>
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
        }
      </div>
      <div className="flex h-1/6 w-full items-center justify-center">
        {!imageUrl && currentPhotoIndex < 3 && !isCounting && !picturesTaken ? (
          <SnapButton
            onClick={capture}
            size="w-48"
          >
          </SnapButton>
        ) : (
          <div>
            {photos.length === 3 && (
              <div className="flex gap-4 pb-16">
                {renderRetakeButton}

                <SimpleButton
                  onClick={generateFace}
                >
                  Next
                </SimpleButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  );
}