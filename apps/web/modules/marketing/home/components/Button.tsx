import React from "react";
import { cn } from "@ui/lib";

type SimpleButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
};

const SimpleButton: React.FC<SimpleButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  // Colors: primary = blue, secondary = light blue
  const base =
    "w-[400px] h-[100px] flex text-white bg-[#2546a6] items-center justify-center font-text-bold text-white rounded-full font text-3xl uppercase transition-all duration-150";

  return (
    <button
      className={cn(base, className, disabled && 'bg-[#8fa0cd]')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SimpleButton;