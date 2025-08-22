'use client';

import SimpleButton from '@marketing/home/components/Button';
import { motion } from 'framer-motion';

export default function ConfirmRetakeModal({
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
          Taking another selfie will discard your current photo. Are you sure
          you want to retake?
        </p>

        <div className="flex justify-center gap-[2vw]">
          <SimpleButton
            className="rounded-full bg-gray-200 px-[4vw] py-[2vh] text-[10px] font-bold text-black md:px-[4vw] md:text-[3.5vw]"
            onClick={onCancel}
          >
            RETURN
          </SimpleButton>
          <SimpleButton
            className="bg-primary rounded-full px-[4vw] py-[2vh] text-[10px] font-bold text-white md:text-[3.5vw]"
            onClick={onConfirm}
          >
            CONFIRM RETAKE
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
}
