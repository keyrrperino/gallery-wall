/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { cn } from "@ui/lib";
import React, { useState, useEffect } from "react";
import RecordingProgress from "./RecordingProgress";

type SnapButtonProps = {
  onClick: () => void;
  isRecording: boolean;
  isCounting?: boolean; // For countdown phase
  size: string;
  recordingDuration?: number; // Duration in seconds
};

const SnapButton: React.FC<SnapButtonProps> = ({
  onClick,
  size,
  isRecording,
  isCounting = false,
  recordingDuration = 2, // Default to 2 seconds as per the actual recording duration
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only track progress during actual recording, not during countdown
    if (!isRecording || isCounting) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const duration = recordingDuration * 1000; // Convert to milliseconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);

      if (currentProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [isRecording, isCounting, recordingDuration]);

  return (
    <div className="relative">
      <button
        className={cn(
          "font-button-base flex items-center hover:scale-90 justify-normal outline-none transition-all duration-300 focus:outline-none bg-red-500  rounded-full border-4 border-white",
          isRecording && "pointer-events-none bg-[#484848] border-[#484848]",
          size
        )}
        disabled={isRecording}
        style={{
          cursor: "pointer",
        }}
        onClick={onClick}
      ></button>
      {(isRecording || isCounting) && (
        <>
          <RecordingProgress
            progress={progress}
            maxProgress={100}
            className="absolute top-0 left-0 w-[72px] h-[72px]"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36px] h-[36px] bg-red-500 rounded-md"></div>
        </>
      )}
    </div>
  );
};

export default SnapButton;
