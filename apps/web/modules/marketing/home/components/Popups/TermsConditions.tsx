/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import React, { useEffect, useState } from "react";

import SimpleButton from "../Button";

const TermsAndConditionsPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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

      <div className="absolute inset-0 h-full xl:-translate-y-16 xl:scale-[0.8]">
        {/* Background Image */}
        Background Image
      </div>

      <div className="relative max-w-[700px] p-2 xl:max-w-[450px] xl:scale-75">
        {/* Popup Text */}
        <div className="relative z-10 flex flex-col">
          <h2 className="mb-8 pt-10 uppercase leading-tight text-[#42FF00] lg:text-[4.5vh] xl:text-5xl">Terms and Conditions</h2>
          <p className="font-text-normal mb-24 text-[2vh] text-white xl:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <div className="flex justify-center">
            <SimpleButton
              onClick={onClose}
            >
              Agree
            </SimpleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPopup;
