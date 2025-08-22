'use client';

import SimpleButton from '@marketing/home/components/Button';
import { motion } from 'framer-motion';

export default function ConfirmExitModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center gap-1 bg-black bg-opacity-50">
      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="w-[65%] rounded-2xl bg-white p-[3vh] text-center shadow-2xl"
      >
        <h2 className="font-text-bold text-[5vh] uppercase">Are you sure?</h2>
        <p className="my-[5vh] text-center font-sans text-[3vw] leading-tight md:text-[2vw]">
          Exiting now will lose your progress. Are you sure you want to exit?
        </p>

        <div className="flex justify-center gap-[2vw]">
          <SimpleButton
            className="rounded-full bg-gray-200 px-[4vw] py-[2vh] text-[3.5vw] font-bold text-black"
            onClick={onCancel}
          >
            CONTINUE
          </SimpleButton>
          <SimpleButton
            className="rounded-full bg-red-500 px-[4vw] py-[2vh] text-[3.5vw] font-bold text-white"
            onClick={onConfirm}
          >
            CONFIRM EXIT
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
}
