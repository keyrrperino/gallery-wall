"use client";
import { Cross2Icon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [dotCount, setDotCount] = useState(0);

  // positions for each image
  const [positions, setPositions] = useState<
    { top?: string; bottom?: string; left?: string; right?: string }[]
  >([]);

  useEffect(() => {
    // cycle loading dots
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // random positions for three images
    const newPositions = Array.from({ length: 3 }).map(() => {
      // random top OR bottom
      const useTop = Math.random() > 0.5;
      const topOrBottomValue = Math.floor(Math.random() * 60) + 5; // 5% to 65%
      // random left OR right
      const useLeft = Math.random() > 0.5;
      const leftOrRightValue = Math.floor(Math.random() * 60) + 5; // 5% to 65%

      return {
        ...(useTop ? { top: `${topOrBottomValue}%` } : { bottom: `${topOrBottomValue}%` }),
        ...(useLeft ? { left: `${leftOrRightValue}%` } : { right: `${leftOrRightValue}%` }),
      };
    });
    setPositions(newPositions);
  }, []); // run only on mount

  const loadingText = `Generating your Unique Pledge Photo${".".repeat(dotCount)}`;

  return (
    <div className="h-full w-full overflow-hidden bg-white flex flex-col items-center justify-between">
      <div className="top-0 flex w-full items-center justify-end h-80 px-16 font-text-bold text-black bg-transparent">
            <button>
                <Cross2Icon color="black" width={120} height={120} />
            </button>
        </div>

      {positions.length === 3 && (
        <>
          <motion.img
            src="/images/bg-image1.png"
            alt="bg1"
            className="absolute w-[25vw] h-[25vw] opacity-30"
            style={positions[0]}
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
          <motion.img
            src="/images/bg-image2.png"
            alt="bg2"
            className="absolute w-[25vw] h-[25vw] opacity-30"
            style={positions[1]}
            animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
          <motion.img
            src="/images/bg-image3.png"
            alt="bg3"
            className="absolute w-[25vw] h-[25vw] opacity-30"
            style={positions[2]}
            animate={{ x: [0, 30, 0], y: [0, -50, 0] }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        </>
      )}

      {/* Loading text */}
      <div>
        <div className="text-black text-[130px] max-w-[60vw] font-text-bold z-10 leading-none text-center">
          {loadingText}
        </div>

        <p className="text-[50px] text-center mb-10 mx-[22vw] leading-tight">
          Hang tight!
        </p>
      </div>

      <div></div>
    </div>
  );
}
