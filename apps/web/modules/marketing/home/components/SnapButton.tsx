/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { cn } from '@ui/lib';
import React, { useState, useEffect } from 'react';
import RecordingProgress from './RecordingProgress';

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
          'font-button-base flex items-center justify-normal rounded-full border-4 border-white bg-red-500 outline-none transition-all duration-300 hover:scale-90 focus:outline-none',
          isRecording && 'pointer-events-none border-[#484848] bg-[#484848]',
          size
        )}
        disabled={isRecording}
        style={{
          cursor: 'pointer',
        }}
        onClick={onClick}
      ></button>
      {(isRecording || isCounting) && (
        <>
          <RecordingProgress
            progress={progress}
            maxProgress={100}
            className="absolute left-0 top-0 h-[72px] w-[72px]"
          />
          <div className="absolute left-1/2 top-1/2 h-[36px] w-[36px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-red-500"></div>
        </>
      )}
    </div>
  );
};

export default SnapButton;
