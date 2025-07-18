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
      className={`rounded-full px-6 py-2 text-base font-medium ${
        selected
          ? "bg-primary text-white"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      } transition`}
    >
      {displayText}
    </Button>
  );
}
