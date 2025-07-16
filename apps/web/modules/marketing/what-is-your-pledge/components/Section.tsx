'use client';

import { useState, useRef } from "react";
import { CONNECTED, DETERMINED, EMPOWERED, GRATEFUL, HOPEFUL, INSPIRED, POSIVITE, PROUD, RESPONSIBLE, WORRIED } from "@saas/shared/constants";
import { Button } from "@ui/components/button";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { PledgeItem } from "./PlegeItem";
import { PlegeItemType } from "../types";

export default function Section() {
  const PLEDGES: PlegeItemType[] = [
    { topText: 'TIDE TO OUR FUTURE', bottomText: 'FOR GENERATIONS TO COME' },
    { topText: 'I SUPPORT', bottomText: 'COASTAL PROECTION' },
    { topText: 'I CARE', bottomText: 'ABOUT OUR COASTS' },
    { topText: 'COASTAL PROTECTION', bottomText: 'NOW!' }
  ];

  const [selected, setSelected] = useState<string | null>(null);

  const router = useRouter();

  const handlePick = (feel: string) => {
    setSelected(selected === feel ? null : feel);
  };

  const handleNext = () => {
    if (selected) {
      router.push(`/shoot-your-gif?pledge=${encodeURIComponent(selected)}`);
    }
  };

  const renderFeelings = PLEDGES.map(({ topText, bottomText }: PlegeItemType) => (
    <PledgeItem
      key={topText + bottomText}
      topText={topText}
      bottomText={bottomText}
      selected={selected === bottomText}
      onClick={handlePick}
    />
  ));

  return (
    <div className="container max-w-6xl pb-16">
      <div className="mb-12 pt-8 text-center">
        <h1 className="mb-2 font-bold text-xl">
        Lorem ipsum dolor sit amet consectetur. Est pharetra morbi in amet id. In diam faucibus viverra quam. Amet felis leo venenatis augue quis blandit. 
        </h1>
      </div>
      <div className="grid gap-8 grid-cols-2 mb-5">
        {renderFeelings}
      </div>
      <div className="flex items-center justify-center">
        <Button
          className={clsx(
            "bg-[#7ecbff] text-black font-bold uppercase w-32 h-10 rounded-none shadow-none border-none",
          )}
          disabled={!selected}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
