"use client";

import ExitButton from "@marketing/shared/components/ExitButton";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@saas/auth/hooks/use-user";
import { Logo } from "@shared/components/Logo";

export default function LoadingScreen() {
  const searchParams = useSearchParams();
  const { gifUrl, isDoneGeneratingGif } = useUser();
  const userGifRequestId = searchParams.get("userGifRequestId");
  const noRemoveBackground = searchParams.get("noRemoveBackground");
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}&`
    : "?";
  const [dotCount, setDotCount] = useState(0);
  const [positions, setPositions] = useState<
    { top?: string; bottom?: string; left?: string; right?: string }[]
  >([]);
  const [animations, setAnimations] = useState<
    { x: number[]; y: number[]; duration: number }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    // Cycle loading dots
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Generate random animation patterns - shared function
  const generateAnimations = useCallback(() => {
    return Array.from({ length: 3 }).map(() => {
      // Random horizontal movement (-100 to 100 pixels)
      const xMovement = Math.floor(Math.random() * 200) - 100;
      // Random vertical movement (-80 to 80 pixels)
      const yMovement = Math.floor(Math.random() * 160) - 80;
      // Random duration between 5-12 seconds
      const duration = Math.floor(Math.random() * 7) + 5;

      return {
        x: [0, xMovement, 0],
        y: [0, yMovement, 0],
        duration,
      };
    });
  }, []);

  useEffect(() => {
    // INITIAL SETUP ONLY - positions are set once and never re-initialized
    // Function to calculate distance between two positions
    const getDistance = (
      pos1: { top: number; left: number },
      pos2: { top: number; left: number }
    ) => {
      const dx = pos1.left - pos2.left;
      const dy = pos1.top - pos2.top;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Generate positions with minimum distance requirement
    const generatePositions = () => {
      const positions: { top: number; left: number }[] = [];
      const minDistance = 30; // Minimum distance between images (in percentage units)
      const maxAttempts = 50;

      for (let i = 0; i < 3; i++) {
        let position: { top: number; left: number };
        let attempts = 0;

        do {
          // Random position from 20% to bottom of screen (20% to 85%)
          const topValue = Math.floor(Math.random() * 65) + 20;
          // Random position from left to right (0% to 75% to account for image width)
          const leftValue = Math.floor(Math.random() * 75);

          position = { top: topValue, left: leftValue };
          attempts++;

          // Check if position is far enough from existing positions
          const tooClose = positions.some(
            (existingPos) => getDistance(position, existingPos) < minDistance
          );

          if (!tooClose || attempts >= maxAttempts) {
            break;
          }
        } while (attempts < maxAttempts);

        positions.push(position);
      }

      return positions.map((pos) => ({
        top: `${pos.top}%`,
        left: `${pos.left}%`,
      }));
    };

    // Set initial positions (ONLY ONCE - never re-initialized)
    const initialPositions = generatePositions();
    const initialAnimations = generateAnimations();

    setPositions(initialPositions);
    setAnimations(initialAnimations);
  }, [generateAnimations]);

  useEffect(() => {
    // Only update animations periodically, never positions
    const animationInterval = setInterval(
      () => {
        const newAnimations = generateAnimations();
        setAnimations(newAnimations);
      },
      Math.floor(Math.random() * 8000) + 7000
    ); // Random interval between 7-15 seconds

    return () => clearInterval(animationInterval);
  }, [generateAnimations]);

  useEffect(() => {
    if (gifUrl && isDoneGeneratingGif) {
      router.push(
        `/save-pledge-photo${additionUrl}gif=${gifUrl}&userGifRequestId=${userGifRequestId}`
      );
    }
  }, [isDoneGeneratingGif, gifUrl, router]);

  const loadingText = `Generating your Unique Pledge Photo${".".repeat(dotCount)}`;

  return (
    <div className="h-full w-full overflow-hidden bg-white flex flex-col items-center gap-[180px] relative">
      {/* TOP BAR */}
      <div className="flex flex-row items-center justify-between w-full px-16 pt-[46px]">
        <div className="w-12 h-12"></div>
        <Logo className="pt-0" />
        <ExitButton />
      </div>

      {/* Floating images */}
      {positions.length === 3 && animations.length === 3 && (
        <>
          <motion.img
            src="/images/bg-image1.png"
            alt="bg1"
            className="absolute w-[25vw] h-[25vw] opacity-30"
            style={positions[0]}
            animate={{ x: animations[0].x, y: animations[0].y }}
            transition={{
              duration: animations[0].duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
          <motion.img
            src="/images/bg-image2.png"
            alt="bg2"
            className="absolute w-[25vw] h-[25vw] opacity-30"
            style={positions[1]}
            animate={{ x: animations[1].x, y: animations[1].y }}
            transition={{
              duration: animations[1].duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
          <motion.img
            src="/images/bg-image3.png"
            alt="bg3"
            className="absolute w-[25vw] h-[25vw] opacity-30"
            style={positions[2]}
            animate={{ x: animations[2].x, y: animations[2].y }}
            transition={{
              duration: animations[2].duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        </>
      )}

      <div className="flex flex-col items-center justify-center gap-9">
        <p className="text-black text-[80px] font-text-bold z-10 leading-none text-center">
          {loadingText}
        </p>
        <span className="text-2xl text-black/70 font-text-regular text-center leading-tight">
          Hang tight!
        </span>
      </div>
    </div>
  );
}
