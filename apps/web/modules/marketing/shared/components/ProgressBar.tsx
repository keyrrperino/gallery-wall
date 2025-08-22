import React from 'react';
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-[15px] w-full rounded-full bg-gray-200">
      <div
        className="h-[15px] rounded-full bg-[#019A90] transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
