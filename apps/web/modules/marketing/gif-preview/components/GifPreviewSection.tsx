"use client";

import { Logo } from "@shared/components/Logo";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GifPreviewSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gifUrl = searchParams.get("gif");
  const [autoDownloaded, setAutoDownloaded] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Auto-download the gif when component mounts
  useEffect(() => {
    if (gifUrl && !autoDownloaded) {
      const downloadGif = async () => {
        try {
          const response = await fetch(gifUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `pledge-gif-${Date.now()}.gif`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          setAutoDownloaded(true);
        } catch (error) {
          console.error("Failed to download gif:", error);
        }
      };

      downloadGif();
    }
  }, [gifUrl, autoDownloaded]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Navigate to homepage when countdown reaches 0
      // router.push("/");
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
    <div className="flex w-full h-full flex-col gap-12 items-center justify-start bg-white pt-16">
      <Logo />

      {/* MAIN HEADING */}
      <h1 className="text-[80px] uppercase text-center leading-[1] -tracking-[1.6px]">
        Thank you!
      </h1>

      {/* INTRO TEXT */}
      <p className="text-2xl text-center text-black/70 leading-[1.25] max-w-4xl px-8">
        Keep an eye on your inbox! Your pledge will be landing
        <br /> there soon. Thanks for joining us on this adventure!
      </p>

      {/* GIF PREVIEW SECTION */}
      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-[450px] h-[541px] overflow-hidden shadow-lg">
          <img
            src={gifUrl}
            alt="Your Pledge GIF"
            className="w-full h-full object-cover"
          />
        </div>

        {autoDownloaded && (
          <p className="text-green-600 text-lg mt-4 font-medium">
            ✓ GIF downloaded successfully!
          </p>
        )}

        {/* Manual download button as backup */}
        <button
          onClick={() => {
            const link = document.createElement("a");
            link.href = gifUrl;
            link.download = `pledge-gif-${Date.now()}.gif`;
            link.click();
          }}
          className="font-text-bold mt-6 px-8 py-3 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Download Again
        </button>
      </div>

      {/* COUNTDOWN AND RETURN HOME SECTION */}
      <div className="flex flex-col justify-center items-center gap-2 p-2 rounded-[48px] mt-8">
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
