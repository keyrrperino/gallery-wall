"use client";

import { useState, useRef } from "react";
import { FeelingsGrid } from "./FeelingsGrid";
import SimpleButton from "@marketing/home/components/Button";

const FEELINGS = [
  "Inspired", "Excited", "Supportive", "Assured", "Informed", "Concerned", "Unsure", "Unconvinced", "Skeptical"
];

export default function HowDoYouFeelSection({
  onContinue,
  initialSelected = [],
}: {
  onContinue: (feelings: string[]) => void;
  initialSelected?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [, setFlash] = useState(false);
  const flashTimeout = useRef<NodeJS.Timeout | null>(null);

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
    <div className="flex flex-col items-start bg-white text-black h-full w-full px-[5vw]">
      <div className="flex flex-col w-full">
        <h1 className="text-4xl md:text-[4vw] font-text-bold uppercase leading-[0.75]">
          HOW DO YOU FEEL ABOUT COASTAL PROTECTION IN SINGAPORE NOW?
        </h1>
        <p className="text-base md:text-[2vw] mt-4 mb-[3vw] leading-[1]">
          Select up to 3 that apply.
        </p>
        <FeelingsGrid feelings={FEELINGS} selected={selected} onPick={handlePick} />
        <SimpleButton
          className="
            absolute bottom-[clamp(40px,7.5vh,160px)] self-center mt-10
            text-[clamp(2rem,3vw,4rem)]
            text-white
            py-[clamp(0.55rem,1.5vw,2rem)]
            px-[clamp(2rem,10vw,12rem)]
            rounded-full font-bold z-10
          "
          disabled={selected.length < 3}
          onClick={handleContinue}
        >
          CONTINUE
        </SimpleButton>
      </div>
    </div>
  );
}
