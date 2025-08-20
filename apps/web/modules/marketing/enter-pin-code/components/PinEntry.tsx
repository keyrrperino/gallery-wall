"use client";
import ExitButton from "@marketing/shared/components/ExitButton";
import { ChevronLeftIcon, DeleteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { KEY, openDB, STORE_NAME } from "../../../../lib/indexDB";
import { Button } from "@ui/components/button";

export default function PinEntry() {
  const searchParams = useSearchParams();
  const gif = searchParams.get("gif");
  const userGifRequestId = searchParams.get("userGifRequestId");
  const noRemoveBackground = searchParams.get("noRemoveBackground");
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}&`
    : "?";
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [pin, setPin] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const samplePin = 1234; // ✅ your sample PIN

  async function getBlobFromIndexedDB(): Promise<Blob | null> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(KEY);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  }

  useEffect(() => {
    getBlobFromIndexedDB()
      .then((blob) => {
        if (blob) {
          setPreviewUrl(URL.createObjectURL(blob));
        }
      })
      .catch(console.error);
  }, []);

  const handlePress = (digit: string) => {
    if (isLocked || isSuccess) {
      return;
    }
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);

      if (newPin.length === 4) {
        if (parseInt(newPin) !== samplePin) {
          triggerError();
        } else {
          triggerSuccess();
        }
      }
    }
  };

  const handleBackspace = () => {
    if (isLocked || isSuccess) {
      return;
    }
    setPin(pin.slice(0, -1));
  };

  const triggerError = () => {
    setIsLocked(true);
    setIsError(true);
    setTimeout(() => {
      setPin("");
      setIsError(false);
      setIsLocked(false);
    }, 1000);
  };

  const triggerSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      router.push(
        `/generating-photo${additionUrl}gif=${gif}&userGifRequestId=${userGifRequestId}`
      );
    }, 800);
  };

  return (
    <div className="flex w-full h-full flex-col gap-10 items-center bg-white">
      {/* Header */}
      <div className="flex w-full items-center justify-between px-[5vw] py-[3vh] font-text-bold text-black">
        <Button
          onClick={() => {
            router.push(
              `/pledge-a-photo${additionUrl}gif=${gif}&userGifRequestId=${userGifRequestId}`
            );
          }}
          variant="ghost"
          size="icon"
          asChild
        >
          <ChevronLeftIcon
            strokeWidth={4}
            className="!text-black hover:text-gray-600 w-12 h-12"
          />
        </Button>
        <h1 className="text-[4vh] font-text-bold uppercase leading-[0.75]">
          ENTER PIN CODE
        </h1>
        <ExitButton />
      </div>

      {/* Description */}
      <p className="text-[2.5vh] leading-[1] text-center px-10">
        Please wait while we make sure your selfie is
        <br />
        safe to send to the gallery wall.
      </p>

      <div className="flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center">
          <div className="w-[30vh] h-[30vh] bg-gray-200 overflow-hidden rounded-md shadow-md">
            {previewUrl && (
              <video
                src={previewUrl}
                className="size-full border-4 border-white object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <track kind="captions" />
              </video>
            )}
          </div>
          <div className="font-bold w-[30vh] bg-[#F7EBDF] text-[3vh] text-center uppercase font-text-bold p-[1vw]">
            My Video Selfie
          </div>
        </div>

        <div className="flex flex-col w-fit justify-center items-center gap-[15px]">
          {/* Dots */}
          <motion.div
            animate={
              isError ? { x: [-10, 10, -10, 10, 0] } : {} // shake only on error
            }
            transition={{ duration: 0.4 }}
            className="flex flex-row items-center justify-between"
          >
            {[0, 1, 2, 3].map((i) => {
              let dotColor = "bg-gray-300";
              if (pin.length > i) {
                if (isError) {
                  dotColor = "bg-red-500";
                } else if (isSuccess) {
                  dotColor = "bg-green-500";
                } else {
                  dotColor = "bg-black";
                }
              } else if (isError) {
                dotColor = "bg-red-300";
              }
              return (
                <div
                  key={i}
                  className={`w-6 h-6 m-5 rounded-full transition-colors duration-300 ${dotColor}`}
                ></div>
              );
            })}
          </motion.div>

          {/* Numpad grid */}
          <div className="grid grid-cols-3 gap-4 w-full">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit, i) => (
              <button
                key={i}
                onClick={() => handlePress(digit)}
                disabled={isLocked || isSuccess}
                className="font-text-regular w-[78px] h-[78px] rounded-full bg-gray-100 text-2xl font-medium hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
              >
                {digit}
              </button>
            ))}
            <div></div>
            <button
              onClick={() => handlePress("0")}
              disabled={isLocked || isSuccess}
              className="font-text-regular w-[78px] h-[78px] rounded-full bg-gray-100 text-2xl font-medium hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              disabled={isLocked || isSuccess}
              className="flex w-[78px] h-[78px] rounded-full items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
            >
              <DeleteIcon className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
