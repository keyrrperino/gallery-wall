'use client';

import SimpleButton from '@marketing/home/components/Button';
import { cn } from '@ui/lib';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PhotoPreview({
  onRetake,
  onUsePhoto,
  gifUrl,
  phase,
  onComplete,
}: {
  onRetake: () => void;
  onUsePhoto: () => void;
  gifUrl: string;
  phase: 'preview' | 'saving' | 'done';
  onComplete: () => void;
}) {
  const [countdown, setCountdown] = useState(3);
  const [fly, setFly] = useState(false);

  useEffect(() => {
    if (phase === 'preview') {
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setFly(true);
      // After animation finishes (duration: 1s), trigger onComplete
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 1000); // matches animation duration
      return () => clearTimeout(completeTimer);
    }
  }, [countdown, onComplete]);
  return (
    <div className="relative flex h-full w-full flex-col items-center gap-16 bg-white">
      <motion.div
        key={countdown}
        initial={phase === 'saving' ? { opacity: 0, scale: 0.8 } : false}
        animate={phase === 'saving' ? { opacity: 1, scale: 1 } : false}
        transition={phase === 'saving' ? { duration: 0.3 } : undefined}
        className="relative z-50 flex items-center justify-center"
      >
        <h1
          className={cn(
            'font-text-bold text-center text-[80px] uppercase leading-[1] portrait:px-48',
            phase === 'preview' ? 'opacity-1' : 'opacity-0'
          )}
        >
          HERE'S YOUR UNIQUE PLEDGE PHOTO!
        </h1>
        {phase === 'saving' && countdown > 0 && !fly && (
          <h1 className="font-text-bold absolute top-0 text-[80px] uppercase leading-[1]">
            {countdown}
          </h1>
        )}
      </motion.div>

      <motion.div
        className="-mt-[4vh] flex w-full flex-grow items-center justify-center"
        animate={{
          y: fly ? '-2000%' : 0,
          transition: { duration: 1, ease: 'easeInOut' },
        }}
      >
        <div className="overflow-hidden rounded-md bg-gray-200 shadow-md portrait:h-[560px] portrait:w-[560px] landscape:h-[460px] landscape:w-[460px]">
          <img
            src={gifUrl}
            alt="selfie preview"
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>

      <div
        className={cn(
          'flex flex-row justify-between gap-9',
          phase === 'preview' ? 'opacity-1' : 'pointer-events-none opacity-0'
        )}
      >
        <SimpleButton
          onClick={onRetake}
          className="font-text-bold w-[428px] bg-transparent py-[26px] text-[3vw] uppercase text-[#20409A]"
        >
          Take Another Selfie
        </SimpleButton>

        <SimpleButton
          onClick={onUsePhoto}
          className="font-text-bold w-[428px] py-[26px] text-[3vw] uppercase"
        >
          This looks good!
        </SimpleButton>
      </div>
    </div>
  );
}
