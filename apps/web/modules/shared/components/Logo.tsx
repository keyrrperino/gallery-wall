import Image from "next/image";
import { cn } from "@ui/lib";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center pt-[46px] z-10",
        className
      )}
    >
      <Image
        src="/images/pub-logo-transparent.webp"
        alt="Pub Coastal Logo"
        width={338}
        height={68}
      />
    </div>
  );
}
