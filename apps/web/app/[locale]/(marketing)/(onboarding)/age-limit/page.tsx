/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import SimpleButton from "../../../../../modules/marketing/home/components/Button";

import ContentFrame from "../../../../../public/images/frames/global-frame.svg";

export default function StepFour() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const onClickBackToMainMenu = () => {
    setIsVisible(false);
    setTimeout(() => {
      router.push("/");
    }, 500);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [])
  return (
    <>
      <div className="flex size-full flex-col items-center justify-center">
        <div
          className={`flex flex-col items-center px-[10vh] text-center transition-all ${isVisible ? "opacity-100 " : " opacity-0"}`}
        >
          <Image
            src={ContentFrame as string}
            alt="Popup Background"
            objectFit="scale-down"
            className={`absolute top-[5vh] z-auto w-[49vh] transition-all duration-500 ${isVisible ? "scale-100" : "scale-[1.7]"}`}
          />
          <h1 className="h1-bold relative mb-[4vh] mt-[20vh] text-[4.5vh] uppercase leading-tight text-[#42FF00]">Oh, man.<br />Sorry, Dude!</h1>
          <p className="font-text-normal relative mx-[3vh] mb-[3vh] pb-[3vh] text-center text-[2vh] leading-normal tracking-tighter text-white">
            Description here
          </p>
        </div>

        <div className="mt-[18vh] flex justify-center">
          <SimpleButton
            onClick={onClickBackToMainMenu}
          >
            Back to main menu
          </SimpleButton>
        </div>
      </div>
    </>
  );
}
