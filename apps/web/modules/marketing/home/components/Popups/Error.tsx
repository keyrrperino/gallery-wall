/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import React, { useEffect, useState } from "react";

import SimpleButon from "../Button";


const ErrorPopup: React.FC<{ errorMessage?: string, onClose: () => void }> = ({ errorMessage, onClose }) => {
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
      <div className="relative w-[30%] bg-black p-8">
        <div className="absolute inset-0">
          {/* Background Image */}
          Image here
        </div>

        {/* Popup Text */}
        <div className="relative z-10">
          <div className="flex flex-col items-center gap-6">
            <div className="font-bold text-white">{errorMessage ?? "Something went wrong!"}</div>
            <SimpleButon
              onClick={() => {
                setIsOpen(false)
                onClose()
              }}
            >
              Close
            </SimpleButon>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ErrorPopup;
