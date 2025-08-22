'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SavingAnimationScreen({
  onComplete,
  gifUrl,
}: {
  onComplete: () => void;
  gifUrl: string;
}) {
  const [countdown, setCountdown] = useState(3);
  const [fly, setFly] = useState(false);

  useEffect(() => {
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
    <div className="relative h-full w-full bg-white">
      {/* Countdown */}
      <AnimatePresence>
        {!fly && countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="z-50 flex items-center justify-center"
          >
            <span className="font-text-bold -mt-24 text-[100px] text-black">
              {countdown}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image container with flying animation */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ y: '-50%', x: '-50%' }}
        animate={
          fly
            ? { y: '-2000%', transition: { duration: 1, ease: 'easeInOut' } }
            : {}
        }
      >
        <div className="-mt-24 h-[560px] w-[560px] overflow-hidden rounded-md bg-gray-200 shadow-md">
          <img
            src={gifUrl}
            alt="saving selfie"
            className="h-full w-full object-contain"
          />
        </div>
      </motion.div>
    </div>
  );
}
