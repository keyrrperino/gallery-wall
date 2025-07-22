"use client";

import { Button } from "@ui/components/button";

type FeelItemProps = {
  displayText: string;
  selected?: boolean;
  onClick?: () => void;
};

export function FeelItem({ displayText, selected, onClick }: FeelItemProps) {
  return (
    <Button
      variant={selected ? "default" : "secondary"}
      onClick={onClick}
      className={`rounded-xl md:rounded-3xl px-[6vw] py-[2vw] text-base md:text-[2vw] font-text-regular tracking-[3px] ${
        selected
          ? "bg-[#CEAA89] text-white"
          : "bg-[#F7EBDF] text-gray-800 hover:bg-[#F7EBDF]"
      } transition`}
    >
      {displayText}
    </Button>
  );
}
