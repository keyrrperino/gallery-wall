"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SavingAnimationScreen({
  onComplete,
  gifUrl
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
    <div className="relative w-full h-full bg-white">
      {/* Countdown */}
      <AnimatePresence>
        {!fly && countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center z-50"
          >
            <div className="text-[20vh] md:text-[25vw] font-text-bold text-white -mt-24">
              {countdown}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image container with flying animation */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ y: "-50%", x: "-50%" }}
        animate={
          fly
            ? { y: "-2000%", transition: { duration: 1, ease: "easeInOut" } }
            : {}
        }
      >
        <div className="w-[35vh] md:w-[25vw] md:w-[35vw] h-[35vh] md:h-[25vw] lg:h-[35vw] bg-gray-200 overflow-hidden rounded-md shadow-md -mt-24">
          <img
            src={gifUrl}
            alt="saving selfie"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}
