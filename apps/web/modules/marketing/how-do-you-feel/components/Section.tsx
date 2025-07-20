"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FeelingsGrid } from "./FeelingsGrid";
import SimpleButton from "@marketing/home/components/Button";

const FEELINGS = [
  "Hopeful", "Safe", "Concerned", "Embracing", "Proud", "Responsible", "Empowered", "Grateful",
  "Worried", "Inspired", "Determined", "Connected", "Protective", "Curious", "Motivated",
  "Involved", "Anxious", "Passionate", "Informed", "Supportive", "Encouraged", "Engaged"
];

export default function HowDoYouFeelSection({
  onContinue,
  initialSelected = [],
}: {
  onContinue: (feelings: string[]) => void;
  initialSelected?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
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
      onContinue(selected);
    }
  };

  return (
    <div className="flex flex-col items-start bg-white text-black h-full w-full px-32">
      <div className="flex flex-col w-full">
        <h1 className="text-[130px] font-text-bold uppercase mb-6 leading-tight">
          HOW DO YOU FEEL ABOUT COASTAL<br />PROTECTION IN SINGAPORE NOW?
        </h1>
        <p className="mb-2 text-[50px] mb-32">
          Select up to 3 that apply.
        </p>
        <FeelingsGrid feelings={FEELINGS} selected={selected} onPick={handlePick} />
        <SimpleButton
          className="absolute bottom-20 self-center mt-10 text-[75px] text-white py-16 px-80 rounded-full font-bold"
          disabled={selected.length < 3}
          onClick={handleContinue}
        >
          CONTINUE
        </SimpleButton>
      </div>
    </div>
  );
}
