'use client';

import { useState, useRef } from 'react';
import { FeelingsGrid } from './FeelingsGrid';
import SimpleButton from '@marketing/home/components/Button';
import clsx from 'clsx';
import { useResponsive } from '@ui/hooks/use-responsive';
import { FeelingsFlex } from './FeelingsFlex';

const FEELINGS = [
  'Inspired',
  'Excited',
  'Positive',
  'Assured',
  'Informed',
  'Concerned',
  'Unsure',
  'Indifferent',
  'Unconvinced',
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
    <div className="flex h-full w-full flex-col items-start bg-white px-10 text-black">
      <div className="flex flex-col gap-9">
        <h1 className="font-text-bold text-[80px] font-bold uppercase leading-[100%] -tracking-[1.6px]">
          HOW DO YOU FEEL ABOUT COASTAL PROTECTION IN SINGAPORE NOW?
        </h1>
        <p className="text-2xl leading-[125%] text-black/70">
          Select 3 that apply
        </p>
      </div>
      <div className="flex h-full flex-col justify-between pt-[120px]">
        <FeelingsFlex
          feelings={FEELINGS}
          selected={selected}
          onPick={handlePick}
        />
        <SimpleButton
          className="w-[400px] items-center justify-center self-center rounded-full py-[26px] text-[32px] font-bold text-white"
          disabled={selected.length < 3}
          onClick={handleContinue}
        >
          CONTINUE
        </SimpleButton>
      </div>
    </div>
  );
}
