"use client";

import { Button } from "@ui/components/button";
import Image from "next/image";

export function PledgeItem({
  topText,
  bottomText,
  img,
  onClick,
  selected,
}: {
  topText: string;
  bottomText: string;
  img?: string;
  onClick?: (val: string) => void;
  selected?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => onClick && onClick(bottomText)}
      className={`
        flex flex-col items-center justify-between
        bg-sand p-4 h-56 w-full
        ${selected ? "ring-4 ring-sea" : ""}
        cursor-pointer
        rounded-xl shadow
        transition
      `}
      style={{ minWidth: 0 }}
    >
      <div className="text-center uppercase text-sea text-base mb-2">
        {topText}
      </div>
      <div className="flex items-center justify-center flex-1 w-full">
        <div className="relative w-28 h-28 bg-lightturquoise border-2 border-white flex items-center justify-center rounded-full">
          {img ? (
            <Image
              src={img}
              alt={topText}
              fill
              sizes="112px"
              className="object-cover object-center rounded-full"
            />
          ) : null}
        </div>
      </div>
      <div className="text-center text-sky text-xs font-bold uppercase mt-2">
        {bottomText}
      </div>
    </Button>
  );
}
