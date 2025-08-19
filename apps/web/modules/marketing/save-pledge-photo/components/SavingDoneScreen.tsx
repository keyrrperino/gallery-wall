"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import SimpleButton from "@marketing/home/components/Button";
import clsx from "clsx";
import { cn } from "@ui/lib";

export default function SavingDoneScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noRemoveBackground = searchParams.get("noRemoveBackground");
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}`
    : "?";

  const handleContinue = () => {
    router.push("/receive-pledge-copy" + additionUrl);
  };

  return (
    <motion.div
      className="w-full h-full bg-white flex flex-col items-center justify-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }} // fades in over 1s
    >
      <div className="w-full h-full flex gap-9 flex-col">
        <h1 className="text-[80px] uppercase text-center px-10 leading-[1] mt-16 mx-20">
          Look up!
        </h1>
        <p className="text-[24px] text-center text-black/70 leading-tight">
          Your pledge has joined others on our Live Pledge Wall!
          <br />
          You’re now part of a growing wave of support for Singapore’s coastal
          future.
        </p>
      </div>

      <SimpleButton
        className={cn(
          "mt-10 self-center text-white rounded-full font-bold pt-[26px] pb-[26px] pr-[11vw] pl-[11vw] text-[24px] w-[428px]"
        )}
        onClick={handleContinue}
      >
        CONTINUE
      </SimpleButton>
    </motion.div>
  );
}
