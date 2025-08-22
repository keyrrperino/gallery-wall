'use client';

import { Button } from '@ui/components/button';
import { cn } from '@ui/lib';

type FeelItemProps = {
  displayText?: string;
  selected?: boolean;
  onClick?: () => void;
};

export function FeelItem({ displayText, selected, onClick }: FeelItemProps) {
  return (
    <Button
      variant={selected ? 'default' : 'secondary'}
      onClick={onClick}
      className={cn(
        'font-text-regular relative h-auto rounded-2xl px-8 py-3 text-[32px] !font-extrabold leading-[150%] !tracking-wider transition',
        selected
          ? 'bg-[#CEAA89] text-white'
          : 'bg-[#F7EBDF] text-black hover:bg-[#F7EBDF]'
      )}
    >
      {displayText}
    </Button>
  );
}
