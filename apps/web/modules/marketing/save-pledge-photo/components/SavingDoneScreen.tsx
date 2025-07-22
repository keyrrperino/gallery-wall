"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import SimpleButton from "@marketing/home/components/Button";

export default function SavingDoneScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/receive-pledge-copy");
  };

  return (
    <motion.div
      className="w-full h-full bg-white flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }} // fades in over 1s
    >
      <h2 className="font-text-bold text-[130px] uppercase">
        Look up!
      </h2>
      <p className="text-[2vw] text-center mb-24 mx-[15vw] leading-tight">
        Your pledge has joined others on our Live Pledge Wall!
        You’re now part of a growing wave of support for Singapore’s coastal future.
      </p>

        <SimpleButton
          className="absolute bottom-20 self-center mt-10 text-[4vw] text-white py-[2vh] px-[10vh] rounded-full font-bold"
          onClick={handleContinue}
        >
          CONTINUE
        </SimpleButton>

    </motion.div>
  );
}
