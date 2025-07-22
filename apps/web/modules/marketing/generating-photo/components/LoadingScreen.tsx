"use client";

import ExitButton from "@marketing/shared/components/ExitButton";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@saas/auth/hooks/use-user";
import StickerCarousel from "@marketing/shared/components/StickerCarousel";

export default function LoadingScreen() {
  const searchParams = useSearchParams();
  const { gifUrl, isDoneGeneratingGif } = useUser();
  const userGifRequestId = searchParams.get("userGifRequestId");
  const [dotCount, setDotCount] = useState(0);
  const [positions, setPositions] = useState<
    { top?: string; bottom?: string; left?: string; right?: string }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    // Cycle loading dots
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Random positions for three images on mount
    const newPositions = Array.from({ length: 3 }).map(() => {
      const useTop = Math.random() > 0.5;
      const topOrBottomValue = Math.floor(Math.random() * 60) + 5;
      const useLeft = Math.random() > 0.5;
      const leftOrRightValue = Math.floor(Math.random() * 60) + 5;

      return {
        ...(useTop ? { top: `${topOrBottomValue}%` } : { bottom: `${topOrBottomValue}%` }),
        ...(useLeft ? { left: `${leftOrRightValue}%` } : { right: `${leftOrRightValue}%` }),
      };
    });
    setPositions(newPositions);
  }, []);

  useEffect(() => {
    if ( gifUrl&& isDoneGeneratingGif) {
      router.push(`/save-pledge-photo?gif=${gifUrl}&userGifRequestId=${userGifRequestId}`);
    }
  }, [isDoneGeneratingGif, gifUrl, router]);

  const loadingText = `Generating your Unique Pledge Photo${".".repeat(dotCount)}`;

  return (
    <div className="h-full w-full overflow-hidden bg-white flex flex-col items-center justify-between relative">
      {/* TOP BAR */}
      <div className="flex w-full items-center justify-end px-[5vw] py-[3vh] gap-8">
        <ExitButton />
      </div>

      <div>
        <div className="text-black text-[5vw] max-w-[60vw] font-text-bold z-10 leading-none text-center">
          {loadingText}
        </div>
        <p className="text-[2vw] text-center mb-10 mx-[22vw] leading-tight">
          Hang tight!
        </p>
      </div>

      <StickerCarousel />

      <div></div>
    </div>
  );
}
