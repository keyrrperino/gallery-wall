"use client";

import { Logo } from "@shared/components/Logo";
import { useUser } from "@saas/auth/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ThankYouSection() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);
  const { gifUrl } = useUser();

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Navigate to homepage when countdown reaches 0
      router.push("/");
    }
  }, [countdown, router]);

  const handleReturnHome = () => {
    router.push("/");
  };

  if (!gifUrl) {
    return (
      <div className="flex w-full h-full flex-col gap-12 items-center justify-start bg-white">
        <Logo />
        <h1 className="text-[48px] uppercase text-center leading-[1] -tracking-[1.6px]">
          No GIF URL provided
        </h1>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full flex-col gap-14 items-center justify-start bg-white">
      <Logo />

      {/* MAIN HEADING */}
      <h1 className="text-[80px] uppercase text-center leading-[1] -tracking-[1.6px]">
        Thank you!
      </h1>

      {/* GIF PREVIEW SECTION */}
      <div className="flex flex-col justify-center items-center w-full flex-1">
        <div className="w-[560px] h-[560px] overflow-hidden shadow-lg">
          <img
            src={gifUrl}
            alt="Your Pledge GIF"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* COUNTDOWN AND RETURN HOME SECTION */}
      <div className="flex flex-col justify-center items-center gap-2 p-2 rounded-[48px] mt-8 pb-20">
        <p className="text-xl font-text-regular not-italic leading-[1.25] text-center text-black/70">
          Returning to homepage in {countdown} seconds...
        </p>
        <button
          onClick={handleReturnHome}
          className="text-[32px] font-text-bold font-bold text-[#20409A] leading-[1.5] hover:underline transition-all"
        >
          Return to Homepage now
        </button>
      </div>
    </div>
  );
}
