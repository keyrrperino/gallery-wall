"use client";

import SimpleButton from "@marketing/home/components/Button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PhotoPreview({
  onRetake,
  onUsePhoto,
  gifUrl,
  phase,
  onComplete,
}: {
  onRetake: () => void;
  onUsePhoto: () => void;
  gifUrl: string;
  phase: "preview" | "saving" | "done";
  onComplete: () => void;
}) {
  const headerText = "Here's your unique pledge photo!";

  const [countdown, setCountdown] = useState(3);
  const [fly, setFly] = useState(false);

  useEffect(() => {
    if (phase === "preview") {
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setFly(true);
      // After animation finishes (duration: 1s), trigger onComplete
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 1000); // matches animation duration
      return () => clearTimeout(completeTimer);
    }
  }, [countdown, onComplete]);
  return (
    <div className="flex w-full h-full flex-col items-center bg-white gap-16 relative">
      <motion.div
        key={countdown}
        initial={phase === "saving" ? { opacity: 0, scale: 0.8 } : false}
        animate={phase === "saving" ? { opacity: 1, scale: 1 } : false}
        transition={phase === "saving" ? { duration: 0.3 } : undefined}
        className="flex items-center justify-center z-50"
      >
        <h1 className="text-[80px] uppercase text-center px-10 leading-[1] mx-20">
          {phase === "saving" && countdown > 0 && !fly && countdown}
          {phase === "preview" && "HERE'S YOUR UNIQUE PLEDGE PHOTO!"}
        </h1>
      </motion.div>

      <motion.div
        className="flex-grow flex items-center justify-center w-full -mt-[4vh]"
        animate={{
          y: fly ? "-2000%" : 0,
          transition: { duration: 1, ease: "easeInOut" },
        }}
      >
        <div className="w-[560px] h-[560px] bg-gray-200 overflow-hidden rounded-md shadow-md">
          <img
            src={gifUrl}
            alt="selfie preview"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {phase === "preview" && (
        <div className="flex flex-row justify-between gap-9">
          <SimpleButton
            onClick={onRetake}
            className="text-[3vw] text-[#20409A] font-text-bold bg-transparent uppercase py-[26px] w-[428px]"
          >
            Take Another Selfie
          </SimpleButton>

          <SimpleButton
            onClick={onUsePhoto}
            className="text-[3vw] font-text-bold py-[26px] uppercase w-[428px]"
          >
            This looks good!
          </SimpleButton>
        </div>
      )}
    </div>
  );
}
