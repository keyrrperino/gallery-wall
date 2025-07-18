"use client";

import { useState } from "react";
import { Button } from "@ui/components/button";
import { useRouter } from "next/navigation";
import { PledgeSlider } from "./PledgeSlider";
import { ProgressBar } from "@marketing/shared/components/ProgressBar";
import { BackButton } from "@marketing/shared/components/BackButton";

export enum PledgeStyleEnum {
  SUPPORT = "support",
  FUTURE = "future",
  CARE = "care",
}

const PLEDGES: {
  topText: string;
  bottomText: string;
  style: PledgeStyleEnum;
  active?: boolean;
}[] = [
  {
    topText: "I SUPPORT",
    bottomText: "COASTAL PROTECTION",
    style: PledgeStyleEnum.SUPPORT, // beige, bottom text bold
    active: false
  },
  {
    topText: "TIDE TO OUR FUTURE",
    bottomText: "FOR GENERATIONS TO COME",
    style: PledgeStyleEnum.FUTURE, // green, top and bottom bar
    active: false
  },
  {
    topText: "I CARE",
    bottomText: "ABOUT OUR COASTS",
    style: PledgeStyleEnum.CARE, // blue, all text bottom right
    active: false
  },
];

export default function Section() {
  const [selected, setSelected] = useState<string | null>(null);

  const router = useRouter();

  const handlePick = (val: string) => setSelected(selected === val ? null : val);

  const handleNext = () => {
    if (selected) {
      router.push(`/shoot-your-gif?pledge=${encodeURIComponent(selected)}`);
    }
  };



  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8">
      <div className="w-full max-w-3xl">
        <ProgressBar value={40} />
        <div className="flex items-center mb-6">
          <BackButton />
        </div>
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl mb-8">
          Pick a Frame and your pledge message
        </h1>        
        <p className="mb-5 text-gray-400">Choose one pledge to appear with your frame!</p>
        <PledgeSlider
          pledges={PLEDGES}
          selected={selected}
          onPick={handlePick}
        />
        <Button
          className="w-full max-w-xs mx-auto mt-8 py-4 text-lg rounded-full bg-sea text-white"
          disabled={!selected}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
