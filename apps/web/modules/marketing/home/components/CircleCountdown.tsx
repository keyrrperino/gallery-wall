import { useEffect, useState } from "react";

const CircularCountdown = ({ timer }) => {
  const [percent, setPercent] = useState(100);

  useEffect(() => {
    if (timer >= 0) {
      setPercent((timer / 60) * 100);
    }
  }, [timer]);

  const gradientStyle = {
    background: `conic-gradient(#00000000 ${100 - percent}%, #42FF00 0)`,
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="absolute -top-4 w-6 rounded-sm border-x-2 border-b-[12px] border-x-transparent border-b-[#42FF00]" />
      <div className="absolute -top-2.5 w-3 rounded-sm border-x-4 border-b-[10px] border-x-transparent border-b-[#42FF00]" />
      <div className="relative flex size-24 scale-105 items-center justify-center rounded-full border-8 border-[#42FF00]">
        <div
          className="absolute inset-0 left-[10%] top-[10%] size-4/5 rounded-full transition-all"
          style={gradientStyle}
        />
      </div>
    </div>
  );
};

export default CircularCountdown;
