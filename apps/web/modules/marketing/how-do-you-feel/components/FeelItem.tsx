"use client";

import { Button } from "@ui/components/button";

type FeelItemProps = {
  displayText?: string;
  selected?: boolean;
  onClick?: () => void;
};

export function FeelItem({ displayText, selected, onClick }: FeelItemProps) {
  return (
    <Button
      variant={selected ? "default" : "secondary"}
      onClick={onClick}
      className={`relative rounded-[1.4vw] md:h-[5vw] text-[2vh] md:text-[3.3vh] md:py-[2vh] font-text-regular tracking-[2px] md:tracking-[3px] ${
        selected
          ? "bg-[#CEAA89] text-white"
          : "bg-[#F7EBDF] text-gray-800 hover:bg-[#F7EBDF]"
      } transition`}
    >
      {displayText}
    </Button>
  );
}
