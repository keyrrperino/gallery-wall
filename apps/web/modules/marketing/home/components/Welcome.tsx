/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SimpleButton from "./Button";
export function GeneratePhoto() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const onGeneratePhoto = () => {
    setIsClicked(true);
    setTimeout(() => {
      router.push("/how-do-you-feel");
    }, 500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [])

  return (
    <div className={`flex size-full flex-col items-center justify-end gap-[3.5vh] transition-all ${isVisible ? "opacity-100 " : " translate-y-10 opacity-0"}`}>
      <div className={`relative flex flex-col w-full gap-10 items-center justify-center transition-all duration-500 ${isClicked ? "translate-y-10 opacity-0" : ""}`}>
        <h2 className="text-8xl text-center font-text-bold">Welcome to the pub PLEDGE wall!</h2>
        <p className="font-text-normal text-2xl">Join us in taking a stand for coastal protection in Singapore. In just a few quick steps, you’ll create your own personalized pledge photo to share with the world and be part of a live pledge wall growing with every submission.</p>
      </div>
      <div className="mb-[5em]">
        <SimpleButton
          onClick={onGeneratePhoto}
        >
          CONTINUE
        </SimpleButton>
      </div>
    </div>
  );
}
