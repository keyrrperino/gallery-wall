import React from "react";
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
      <div
        className="h-2 bg-[#019A90] rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}