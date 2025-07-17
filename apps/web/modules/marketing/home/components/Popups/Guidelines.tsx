/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Image from "next/image";
import React, { useEffect, useState } from "react";

import SimpleButton from "../Button";

const GuidelinesPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Delay setting isOpen to true to trigger the animation
    setTimeout(() => {
      setIsOpen(true);
    }, 50);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-all ${isOpen ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}>
      {/* Popup Content */}
      
      <div className="absolute inset-0 h-full xl:-translate-y-0 xl:scale-[0.9]">
        {/* Background Image */}
        Backgroud Image
      </div>

      <div className="relative max-w-[750px] p-2 xl:max-w-[450px] xl:scale-75">
        <div className="relative z-10">
          <h2 className="h1-bold mb-12 pt-10 text-[3vh] uppercase leading-none xl:text-4xl">
            <span className="text-[#42FF00]">Hey dude!</span> <span className="text-white">before we proceed, HERE ARE SOME GUIDELINES TO follow:</span>
          </h2>
          <h3 className="font-text-base mb-8 text-[1.7vh] uppercase  tracking-[.1em] text-[#42FF00] xl:text-2xl">
            Step 1: Take a photo
          </h3>
          <p className="font-text-normal mb-12 text-[2vh] leading-tight text-white xl:text-xl">
            You only have 1 minute to take your photos. Three photos will be taken in a row.
          </p>


          <h3 className="font-text-base mb-8 text-[1.7vh] uppercase  tracking-[.1em] text-[#42FF00] xl:text-2xl">
            Step 2: Review your photo
          </h3>
          <p className="font-text-normal mb-12 text-[2vh] leading-tight text-white xl:text-xl">
            Retakes can be done within the 1 minute period. If time runs out, your last set of photos will be used.
          </p>

          <h3 className="font-text-base mb-8 text-[1.7vh] uppercase  tracking-[.1em] text-[#42FF00] xl:text-2xl">
            Step 3: select and print
          </h3>
          <p className="font-text-normal mb-12 text-[2vh] leading-tight text-white xl:text-xl">
            Choose one from the three options. While waiting for your photo to print, you can choose to email yourself a copy.
          </p>


          <div className="flex justify-center">
            <SimpleButton
              onClick={onClose}
            >
              Proceed
            </SimpleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesPopup;
