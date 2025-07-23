"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import SimpleButton from "@marketing/home/components/Button";
import clsx from "clsx";

export default function SavingDoneScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noRemoveBackground = searchParams.get("noRemoveBackground");
  const additionUrl = noRemoveBackground ? `?noRemoveBackground=${noRemoveBackground}` : '?';

  const handleContinue = () => {
    // router.push("/receive-pledge-copy" + additionUrl);
    router.push("/" + additionUrl);
  };

  return (
    <motion.div
      className="w-full h-full bg-white flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }} // fades in over 1s
    >
      <h2 className="font-text-bold text-[100px] md:text-[130px] uppercase">
        Look up!
      </h2>
      <p className="text-[2vw] text-center mb-24 mx-[15vw] leading-tight">
        Your pledge has joined others on our Live Pledge Wall!
        You’re now part of a growing wave of support for Singapore’s coastal future.
      </p>

        <SimpleButton
          className={clsx(
            "fixed",
            "mt-5",
            "bottom-[3vh]",
            "self-center",
            "text-white",
            "rounded-full font-bold",
            "pt-[2vh] md:pt-[3vh]",
            "pb-[2vh] md:pb-[3vh]",
            "pr-[11vw]",
            "pl-[11vw]",
            "text-[3vh]"
          )}
          onClick={handleContinue}
        >
          CONTINUE
        </SimpleButton>

    </motion.div>
  );
}
