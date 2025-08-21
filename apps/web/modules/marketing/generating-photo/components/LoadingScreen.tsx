"use client";

import ExitButton from "@marketing/shared/components/ExitButton";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@saas/auth/hooks/use-user";
import { Logo } from "@shared/components/Logo";
import { ImageMarquee } from "@shared/components/ImageMarquee";

export default function LoadingScreen() {
  const searchParams = useSearchParams();
  const { gifUrl, isDoneGeneratingGif } = useUser();
  const userGifRequestId = searchParams.get("userGifRequestId");
  const noRemoveBackground = searchParams.get("noRemoveBackground");
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}&`
    : "?";
  const [dotCount, setDotCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Cycle loading dots
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gifUrl && isDoneGeneratingGif) {
      router.push(
        `/save-pledge-photo${additionUrl}gif=${gifUrl}&userGifRequestId=${userGifRequestId}`
      );
    }
  }, [isDoneGeneratingGif, gifUrl, router]);

  const loadingEllipsis = ".".repeat(dotCount);

  return (
    <div className="h-full w-full overflow-hidden bg-white flex flex-col items-center gap-[180px] relative">
      {/* TOP BAR */}
      <div className="flex flex-row items-center justify-between w-full px-16 pt-[46px]">
        <div className="w-12 h-12"></div>
        <Logo className="pt-0" />
        <ExitButton />
      </div>

      <div className="flex flex-col items-center justify-center gap-9">
        <p className="text-black text-[80px] font-text-bold z-10 leading-none text-center">
          Generating your Unique
          <br /> Pledge Photo{loadingEllipsis}
        </p>
        <span className="text-2xl text-black/70 font-text-regular text-center leading-tight">
          Hang tight!
        </span>
      </div>

      <ImageMarquee />
    </div>
  );
}
