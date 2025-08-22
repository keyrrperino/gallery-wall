'use client';

import { Button } from '@ui/components/button';
import Image from 'next/image';

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
      className={`bg-sand flex h-56 w-full flex-col items-center justify-between p-4 ${selected ? 'ring-sea ring-4' : ''} cursor-pointer rounded-xl shadow transition`}
      style={{ minWidth: 0 }}
    >
      <div className="text-sea mb-2 text-center text-base uppercase">
        {topText}
      </div>
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="bg-lightturquoise relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-white">
          {img ? (
            <Image
              src={img}
              alt={topText}
              fill
              sizes="112px"
              className="rounded-full object-cover object-center"
            />
          ) : null}
        </div>
      </div>
      <div className="text-sky mt-2 text-center text-xs font-bold uppercase">
        {bottomText}
      </div>
    </Button>
  );
}
