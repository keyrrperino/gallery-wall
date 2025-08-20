"use client";

import { useState, useRef } from "react";
import { FeelingsGrid } from "./FeelingsGrid";
import SimpleButton from "@marketing/home/components/Button";
import clsx from "clsx";
import { useResponsive } from "@ui/hooks/use-responsive";
import { FeelingsFlex } from "./FeelingsFlex";

const FEELINGS = [
  "Inspired",
  "Excited",
  "Positive",
  "Assured",
  "Informed",
  "Concerned",
  "Unsure",
  "Indifferent",
  "Unconvinced",
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
      setSelected(selected.filter((f) => f !== feel));
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
    <div className="flex flex-col items-start justify-between pt-24 bg-white text-black h-full w-full px-10">
      <FeelingsFlex
        feelings={FEELINGS}
        selected={selected}
        onPick={handlePick}
      />

      <SimpleButton
        className="self-center text-white rounded-full font-bold py-[26px] text-[32px] items-center justify-center w-[400px]"
        disabled={selected.length < 3}
        onClick={handleContinue}
      >
        CONTINUE
      </SimpleButton>
    </div>
  );
}
