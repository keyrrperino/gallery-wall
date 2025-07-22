"use client";
import ExitButton from "@marketing/shared/components/ExitButton";
import { ChevronLeftIcon, DeleteIcon } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function PinEntry() {
  const searchParams = useSearchParams();
  const gif = searchParams.get("gif");
  const [pin, setPin] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const samplePin = 1234; // ✅ your sample PIN

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
      router.push("/generating-photo");
    }, 800);
  };

  return (
    <div className="flex w-full h-full flex-col gap-12 items-center bg-white">
      {/* Header */}
      <div className="flex w-full items-center justify-between h-80 px-[5vw] py-[3vh] font-text-bold text-black">
        <button onClick={() => window.history.back()}>
          <ChevronLeftIcon
            className="text-black hover:text-gray-600 w-8 h-8 md:w-[3vw] md:h-[3vw]"
          />
        </button>
        <h1 className="text-4xl md:text-[4vw] font-text-bold uppercase leading-[0.75]">ENTER PIN CODE</h1>
        <ExitButton />
      </div>

      {/* Description */}
      <p className="text-base md:text-[2vw] leading-[1] text-center">
        Please wait while we make sure your selfie is safe to send to the
        gallery wall.
      </p>

      <div className="flex flex-col md:flex-row gap-[3vw] mt-[3vw]">
        {/* Left side - image */}
        <div className="flex flex-col items-center">
          <div className="w-[33vw] h-[33vw] bg-gray-200 overflow-hidden rounded-md shadow-md">
            {gif && 
              <img
                src={gif}
                alt="selfie preview"
                className="w-full h-full object-cover"
              />}
          </div>
          <div className="font-bold w-full bg-[#F7EBDF] text-[66px] text-center uppercase font-text-bold p-8">
            My Video Selfie
          </div>
        </div>

        {/* Right side - PIN pad */}
        <div className="flex flex-col items-center gap-16">
          {/* Dots */}
          <motion.div
            animate={
              isError ? { x: [-10, 10, -10, 10, 0] } : {} // shake only on error
            }
            transition={{ duration: 0.4 }}
            className="flex flex-row w-full gap-7 items-center justify-around"
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
                  className={`w-[2vw] h-[2vw] rounded-full transition-colors duration-300 ${dotColor}`}
                ></div>
              );
            })}
          </motion.div>

          {/* Numpad grid */}
          <div className="grid grid-cols-3 gap-[2vw]">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit, i) => (
              <button
                key={i}
                onClick={() => handlePress(digit)}
                disabled={isLocked || isSuccess}
                className="h-[10vh] w-[10vh] rounded-full bg-gray-100 text-base md:text-[2vw] font-semibold hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
              >
                {digit}
              </button>
            ))}
            <div></div>
            <button
              onClick={() => handlePress("0")}
              disabled={isLocked || isSuccess}
              className="h-[10vh] w-[10vh] rounded-full bg-gray-100 text-base md:text-[2vw] font-semibold hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              disabled={isLocked || isSuccess}
              className="flex h-[10vh] w-[10vh] items-center justify-center rounded-full bg-gray-100 text-base md:text-[2vw] font-semibold hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
            >
              <DeleteIcon className="text-black hover:text-gray-600 w-8 h-8 md:w-[2vw] md:h-[2vw]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
