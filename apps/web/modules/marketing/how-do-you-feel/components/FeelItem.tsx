"use client";

import { Button } from "@ui/components/button";

export function FeelItem(props: { displayText: string; selected?: boolean; onClick?: () => void }) {
  const { displayText, selected, onClick } = props;

  return (
    <Button
      variant={selected ? "default" : "secondary"}
      onClick={onClick}
      className={selected ? "ring-2 ring-blue-500 cursor-pointer" : "cursor-pointer"}
    >
      {displayText}
    </Button>
  );
}
