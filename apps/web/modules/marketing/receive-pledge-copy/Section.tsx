"use client";

import ExitButton from "@marketing/shared/components/ExitButton";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import SimpleButton from "@marketing/home/components/Button";

export default function PledgeCopy() {
  const [email, setEmail] = useState("");

  const handleSendEmail = () => {
    if (!email) return alert("Please enter an email!");
    // TODO: integrate with your API
    console.log("📧 Sending pledge to:", email);
  };

  return (
    <div className="flex w-full h-full flex-col gap-12 items-center bg-white">
      {/* TOP BAR */}
      <div className="flex w-full items-center justify-between h-80 px-16 font-text-bold text-black">
        <button>
          <ChevronLeftIcon
            className="text-black hover:text-gray-600"
            width={120}
            height={120}
          />
        </button>
        <h2 className="text-[130px] uppercase">Want a copy of your pledge?</h2>
        <ExitButton />
      </div>

      {/* INTRO TEXT */}
      <p className="text-[50px] text-center mb-48 mx-[15vw] leading-tight">
        Your pledge has joined others on our Live Pledge Wall!<br />
        You’re now part of a growing wave of support for Singapore’s coastal future.
      </p>

      {/* SEND TO EMAIL SECTION */}
      <div className="flex flex-row w-full items-center justify-between mb-10 px-[15vw]">
        <h2 className="text-[80px] font-text-bold uppercase">SEND TO MY EMAIL</h2>
        <div className="flex flex-row gap-10">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="border border-gray-400 rounded-[32px] px-10 py-14 text-[50px] w-[30vw]"
        />
        <SimpleButton
          onClick={handleSendEmail}
          className="text-[75px] text-white py-8 px-16 rounded-[32px] font-bold"
        >
          SEND
        </SimpleButton>
        </div>
      </div>

    <div className="w-full px-[15vw]">
        <hr className="w-full border-black mb-10" />
    </div>

      {/* DOWNLOAD MY PLEDGE SECTION */}
      <div className="flex flex-row w-full items-start gap-24 px-[15vw]">
        <h2 className="text-[80px] font-text-bold uppercase">DOWNLOAD MY PLEDGE</h2>
        <div className="w-[600px] h-[600px] overflow-hidden rounded-md shadow-md">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
              alt="selfie preview"
              className="w-full h-full object-cover"
            />
          </div>
      </div>
    </div>
  );
}
