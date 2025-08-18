"use client";

import ExitButton from "@marketing/shared/components/ExitButton";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import SimpleButton from "@marketing/home/components/Button";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@shared/components/Logo";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function PledgeCopy() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [shake, setShake] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const searchParams = useSearchParams();
  const noRemoveBackground = searchParams.get("noRemoveBackground");
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}`
    : "?";

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
    router.push("/thank-you" + additionUrl);
  };

  return (
    <div className="flex w-full h-full flex-col gap-12 items-center justify-start bg-white">
      <Logo />
      {/* TOP BAR */}
      <h1 className="text-[80px] uppercase text-center leading-[1] -tracking-[1.6px]">
        Want a copy of
        <br />
        your pledge?
      </h1>

      {/* INTRO TEXT */}
      <p className="text-2xl text-center text-black/70 leading-[1.25]">
        Your pledge has joined others on our Live Pledge Wall!
        <br />
        You&apos;re now part of a growing wave of support for Singapore&apos;s
        coastal future.
      </p>

      {/* DOWNLOAD MY PLEDGE SECTION */}
      <div className="flex flex-col justify-center items-center w-full mt-16">
        <h2 className="text-[48px] font-text-bold uppercase">
          DOWNLOAD MY PLEDGE
        </h2>
        <div className="w-[335px] h-[335px] overflow-hidden rounded-md shadow-md">
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
