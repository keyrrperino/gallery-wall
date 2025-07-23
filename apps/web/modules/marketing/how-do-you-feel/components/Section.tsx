"use client";

import { useState, useRef } from "react";
import { FeelingsGrid } from "./FeelingsGrid";
import SimpleButton from "@marketing/home/components/Button";
import clsx from "clsx";
import { useResponsive } from "@ui/hooks/use-responsive";

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
  const {} = useResponsive();
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
      <FeelingsGrid feelings={FEELINGS} selected={selected} onPick={handlePick} />
      
      <SimpleButton
      className={clsx(
          "fixed",
          "mt-5",
          "bottom-[3vh]",
          "self-center",
          "text-white",
          "rounded-full font-bold",
          "pt-[2vh] md:pt-[3vh]",
          "pb-[2vh] md:pb-[3vh]",
          "pr-[11vw]",
          "pl-[11vw]",
          "text-[3vh]"
      )}
        disabled={selected.length < 3}
        onClick={handleContinue}
      >
        CONTINUE
      </SimpleButton>
    </div>
  );
}
