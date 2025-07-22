"use client";

import ExitButton from "@marketing/shared/components/ExitButton";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import SimpleButton from "@marketing/home/components/Button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function PledgeCopy() {
    const router = useRouter();
  const [email, setEmail] = useState("");
  const [shake, setShake] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);

  const valid = isValidEmail(email);
  const isInvalid = email.trim() === "" || !valid;

  const handleSendEmail = () => {
    if (isInvalid) {
      // trigger shake animation
      setShake(true);
      setInputDisabled(true); // disable input while shaking
      setTimeout(() => {
        setShake(false);
        setInputDisabled(false); // re-enable input after shaking
      }, 500);
      return;
    }

    console.log("📧 Sending pledge to:", email);
    router.push("/thank-you");
  };

  return (
    <div className="flex w-full h-full flex-col gap-[3vh] items-center bg-white">
      {/* TOP BAR */}
      <div className="flex w-full items-center justify-between px-[5vw] py-[3vh] gap-8 font-text-bold text-black">
        <div className="hidden md:block"></div>
        <h1 className="text-4xl md:text-[4vw] text-center font-text-bold uppercase leading-[0.75]">Want a copy of your pledge?</h1>
        <ExitButton />
      </div>

      {/* INTRO TEXT */}
      <p className="text-base text-center md:text-[2vw] mt-4 mb-[3vw] leading-[1] mx-9 md:mx-[10vw]">
        Your pledge has joined others on our Live Pledge Wall!<br />
        You’re now part of a growing wave of support for Singapore’s coastal
        future.
      </p>

      {/* SEND TO EMAIL SECTION */}
      <div className="flex flex-col md:flex-row w-full items-center justify-between px-[15vw]">
        <h1 className="text-2xl md:text-[3vw] text-left font-text-bold uppercase leading-[0.75]">
          SEND TO MY EMAIL
        </h1>
        <div className="flex flex-row gap-[2vw] items-center mt-4 md:mt-0 w-full md:w-auto">
          {/* EMAIL INPUT */}
          <input
            type="email"
            disabled={inputDisabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className={`border py-[1.5vw] px-4 md:py-[3vw] md:px-[3vw] rounded-lg md:rounded-[32px] text-base md:text-[2vw] w-full md:w-[30vw] transition-colors ${
              isInvalid && email !== "" ? "border-red-500" : "border-gray-400"
            } ${inputDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />

          {/* SEND BUTTON */}
          <motion.div
            animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <SimpleButton
              onClick={handleSendEmail}
              disabled={isInvalid}
              className={`text-2xl md:text-[3vw] py-[1.5vw] px-4 md:py-[3vw] md:px-[3vw] rounded-lg md:rounded-[32px] font-bold transition-colors ${
                isInvalid
                  ? "bg-red-500 text-white cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary"
              }`}
            >
              SEND
            </SimpleButton>
          </motion.div>
        </div>
      </div>

      <div className="w-full px-[15vw]">
        <hr className="w-full border-black" />
      </div>

      {/* DOWNLOAD MY PLEDGE SECTION */}
      <div className="flex flex-col md:flex-row w-full items-center md:items-start gap-[2vw] px-[15vw]">
        <h1 className="text-2xl md:text-[3vw] font-text-bold uppercase leading-[0.75]">
          DOWNLOAD MY PLEDGE
        </h1>
        <div className="relative aspect-square h-[35vw] md:w-auto md:h-[35vh] bg-gray-200 shadow-md">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
            alt="qr code"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
