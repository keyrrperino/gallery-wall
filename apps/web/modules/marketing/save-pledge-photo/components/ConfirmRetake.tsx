"use client";

import SimpleButton from "@marketing/home/components/Button";
import { motion } from "framer-motion";

export default function ConfirmRetakeModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-24 w-[65%] text-center"
      >
        <h2 className="text-[110px] font-text-bold uppercase">Are you sure?</h2>
        <p className="text-[2vw] text-center font-sans my-32 leading-tight">
            Taking another selfie will discard your current photo. Are you sure you want to retake?
        </p>

        <div className="flex justify-center gap-[1.5vw]">
          <SimpleButton
            className="bg-gray-200 mt-10 text-[75px] text-black py-[3vh] px-[10vh] rounded-full font-bold"
            onClick={onCancel}
          >
            RETURN
          </SimpleButton>
          <SimpleButton
            className="bg-primary mt-[2vh] text-[2vw] text-white py-[3vh] px-[10vh] rounded-full font-bold"
            onClick={onConfirm}
          >
            CONFIRM RETAKE
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
}
