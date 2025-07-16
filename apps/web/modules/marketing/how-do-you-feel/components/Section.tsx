'use client';

import { useState, useRef } from "react";
import { FeelItem } from "@marketing/how-do-you-feel/components/FeelItem";
import { CONNECTED, DETERMINED, EMPOWERED, GRATEFUL, HOPEFUL, INSPIRED, POSIVITE, PROUD, RESPONSIBLE, WORRIED } from "@saas/shared/constants";
import { Button } from "@ui/components/button";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function Section() {
  const FEELINGS: string[] = [
    PROUD, HOPEFUL, RESPONSIBLE, EMPOWERED, GRATEFUL,
    WORRIED, INSPIRED, DETERMINED, CONNECTED, POSIVITE
  ];

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
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
      flashTimeout.current = setTimeout(() => setFlash(false), 500);
    }
  };

  const handleNext = () => {
    if (selected.length === 3) {
      const params = selected.map(f => `feelings=${encodeURIComponent(f)}`).join('&');
      router.push(`/what-is-your-pledge?${params}`);
    }
  };

  const renderFeelings = FEELINGS.map((feel: string) => (
    <FeelItem
      key={feel}
      displayText={feel}
      selected={selected.includes(feel)}
      onClick={() => handlePick(feel)}
    />
  ));

  return (
    <div className="container max-w-6xl pb-16">
      <div className="mb-12 pt-8 text-center">
        <h1 className="mb-2 font-bold text-xl">
          Lorem ipsum dolor sit amet consectetur. Est pharetra morbi in amet id. In diam faucibus viverra quam. Amet felis leo venenatis augue quis blandit. Ut consectetur senectus eget scelerisque nec gravida sit at. Id massa non sed mi non proin felis a. In sit feugiat augue arcu mattis vel viverra tellus metus.
        </h1>
      </div>
      <div className="grid gap-8 grid-cols-3 mb-5">
        {renderFeelings}
      </div>
      <div className="flex items-center justify-center">
        <Button
          className={clsx(
            flash && "animate-pulse border-2 border-red-500 cursor-pointer"
          )}
          disabled={selected.length !== 3}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
