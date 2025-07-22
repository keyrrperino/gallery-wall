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
      <h1 className="text-4xl md:text-[4vw] text-center font-text-bold uppercase leading-[0.75] -mt-[20vh]">
        Look up!
      </h1>
      <p className="text-base text-center md:text-[2vw] mt-4 mb-[3vw] leading-[1] mx-9 md:mx-[10vw]">
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
