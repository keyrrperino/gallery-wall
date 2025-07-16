"use client";

import { Button } from "@ui/components/button";
import { PlegeItemType } from "../types";
import Image from "next/image";

export function PledgeItem(props: PlegeItemType) {
  const { bottomText, topText, img, onClick, selected } = props;

  return (
    <Button
      variant="ghost"
      onClick={() => onClick && onClick(bottomText)}
      className={`
        flex flex-col items-center justify-between
        bg-gray-200 p-4 h-56 w-full
        ${selected ? "ring-2 ring-blue-500" : ""}
        cursor-pointer
        rounded-none shadow-none
      `}
      style={{ minWidth: 0 }}
    >
      <div className="text-center font-bold uppercase text-cyan-400 text-sm mb-2">
        {topText}
      </div>
      <div className="flex items-center justify-center flex-1 w-full">
        <div className="relative w-28 h-28 bg-gray-300 border-2 border-white flex items-center justify-center">
          {img ? (
            <Image
              src={img}
              alt={topText}
              fill
              sizes="112px"
              className="object-cover object-center"
            />
          ) : null}
        </div>
      </div>
      <div className="text-center text-cyan-400 text-xs font-bold uppercase mt-2">
        {bottomText}
      </div>
    </Button>
  );
}
