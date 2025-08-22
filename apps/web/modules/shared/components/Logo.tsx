import Image from 'next/image';
import { cn } from '@ui/lib';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn(
        'z-10 flex items-center justify-center portrait:pt-8 landscape:pt-5',
        className
      )}
    >
      <Image
        src="/images/riding-the-tides-logo.webp"
        alt="Pub Coastal Logo"
        width={127}
        height={77}
        className="portrait:h-[126px] portrait:w-[200px] landscape:h-[77px] landscape:w-[127px]"
      />
    </div>
  );
}
