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
        className="bg-white rounded-2xl shadow-2xl p-24 w-[65%] text-center"
      >
        <h2 className="text-[110px] font-text-bold uppercase">Are you sure?</h2>
        <p className="text-[50px] text-center font-sans my-32 leading-tight">
            Exiting now will lose your progress. Are you sure you want to exit?
        </p>

        <div className="flex justify-center gap-8">
          <SimpleButton
            className="bg-gray-200 mt-10 text-[75px] text-black py-16 px-40 rounded-full font-bold"
            onClick={onCancel}
          >
            CONTINUE
          </SimpleButton>
          <SimpleButton
            className="bg-red-500 mt-10 text-[75px] text-white py-16 px-40 rounded-full font-bold"
            onClick={onConfirm}
          >
            CONFIRM EXIT
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
}
