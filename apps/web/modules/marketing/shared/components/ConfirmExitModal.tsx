"use client";

import SimpleButton from "@marketing/home/components/Button";
import { motion } from "framer-motion";

export default function ConfirmExitModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center gap-1 justify-center bg-black bg-opacity-50">
      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-[3vh] w-[65%] text-center"
      >
        <h2 className="text-[5vh] font-text-bold uppercase">Are you sure?</h2>
        <p className="text-[3vw] md:text-[2vw] text-center font-sans my-[5vh] leading-tight">
            Exiting now will lose your progress. Are you sure you want to exit?
        </p>

        <div className="flex justify-center gap-[2vw]">
          <SimpleButton
            className="bg-gray-200 text-[3.5vw] py-[2vh] px-[4vw] text-black rounded-full font-bold"
            onClick={onCancel}
          >
            CONTINUE
          </SimpleButton>
          <SimpleButton
            className="bg-red-500 text-[3.5vw] py-[2vh] px-[4vw] text-white rounded-full font-bold"
            onClick={onConfirm}
          >
            CONFIRM EXIT
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
}
