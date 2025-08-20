import React from "react";
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-[15px] bg-gray-200 rounded-full">
      <div
        className="h-[15px] bg-[#019A90] rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
