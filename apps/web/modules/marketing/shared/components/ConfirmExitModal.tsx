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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-24 w-[65%] text-center"
      >
        <h1 className="text-4xl md:text-[4vw] font-text-bold uppercase leading-[0.75]">Are you sure?</h1>
        <p className="text-base md:text-[2vw] mt-4 mb-[3vw] leading-[1] mt-[2vh]">
            Exiting now will lose your progress. Are you sure you want to exit?
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-8">
          <SimpleButton
            className="hover:bg-gray-300 bg-gray-200 mt-10 text-2xl md:text-[3vw] p-5 md:p-[4vh] text-black rounded-full font-bold"
            onClick={onCancel}
          >
            CONTINUE
          </SimpleButton>
          <SimpleButton
            className="hover:bg-red-600 bg-red-500 md:mt-10 text-2xl md:text-[3vw] p-5 md:p-[4vh] text-white rounded-full font-bold"
            onClick={onConfirm}
          >
            CONFIRM EXIT
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
}
