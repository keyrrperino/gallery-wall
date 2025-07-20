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
    <div className="flex w-full h-full flex-col gap-12 items-center bg-white">
      {/* TOP BAR */}
      <div className="flex w-full items-center justify-between h-80 px-16 font-text-bold text-black">
        <button>
          <ChevronLeftIcon className="text-white" width={120} height={120} />
        </button>
        <h2 className="text-[130px] uppercase">Want a copy of your pledge?</h2>
        <ExitButton />
      </div>

      {/* INTRO TEXT */}
      <p className="text-[50px] text-center mb-48 mx-[15vw] leading-tight">
        Your pledge has joined others on our Live Pledge Wall!<br />
        You’re now part of a growing wave of support for Singapore’s coastal
        future.
      </p>

      {/* SEND TO EMAIL SECTION */}
      <div className="flex flex-row w-full items-center justify-between mb-10 px-[15vw]">
        <h2 className="text-[80px] font-text-bold uppercase">SEND TO MY EMAIL</h2>
        <div className="flex flex-row gap-10 items-center">
          {/* EMAIL INPUT */}
          <input
            type="email"
            disabled={inputDisabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className={`border rounded-[32px] px-10 py-14 text-[50px] w-[30vw] transition-colors ${
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
              className={`text-[75px] py-8 px-16 rounded-[32px] font-bold transition-colors ${
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
        <hr className="w-full border-black mb-10" />
      </div>

      {/* DOWNLOAD MY PLEDGE SECTION */}
      <div className="flex flex-row w-full items-start gap-24 px-[15vw]">
        <h2 className="text-[80px] font-text-bold uppercase">
          DOWNLOAD MY PLEDGE
        </h2>
        <div className="w-[600px] h-[600px] overflow-hidden rounded-md shadow-md">
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
