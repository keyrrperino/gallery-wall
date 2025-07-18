"use client";

import { useState, useRef } from "react";
import { Button } from "@ui/components/button";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@marketing/shared/components/ProgressBar";
import { BackButton } from "@marketing/shared/components/BackButton";
import { FeelingsGrid } from "./FeelingsGrid";

const FEELINGS = [
  "Hopeful", "Safe", "Concerned", "Embracing", "Proud", "Responsible", "Empowered", "Grateful",
  "Worried", "Inspired", "Determined", "Connected", "Protective", "Curious", "Motivated",
  "Involved", "Anxious", "Passionate", "Informed", "Supportive", "Encouraged", "Engaged"
];

export default function HowDoYouFeelSection() {
  const [selected, setSelected] = useState<string[]>([]);
  const [flash, setFlash] = useState(false);
  const flashTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handlePick = (feel: string) => {
    if (selected.includes(feel)) {
      setSelected(selected.filter(f => f !== feel));
    } else if (selected.length < 3) {
      setSelected([...selected, feel]);
    } else {
      setFlash(true);
      if (flashTimeout.current) {
        clearTimeout(flashTimeout.current);
      }
      flashTimeout.current = setTimeout(() => setFlash(false), 500);
    }
  };

  const handleContinue = () => {
    if (selected.length === 3) {
      const params = selected.map(f => `feelings=${encodeURIComponent(f)}`).join("&");
      router.push(`/pick-a-frame?${params}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <ProgressBar value={20} />
        <div className="flex items-center mb-6">
          <BackButton />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight text-wrap">
          HOW DO YOU FEEL ABOUT <br />
          COASTAL PROTECTION IN <br />
          SINGAPORE NOW?
        </h1>
        <p className="text-gray-500 mb-6">Select up to 3 that apply</p>
        <FeelingsGrid feelings={FEELINGS} selected={selected} onPick={handlePick} />
        <Button
          className={clsx(
            "w-full max-w-xs mx-auto mt-8 py-4 text-lg rounded-full",
            flash && "animate-pulse border-2 border-red-500"
          )}
          disabled={selected.length === 0}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
