/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import React, { useEffect, useState } from "react";

import SimpleButton from "../Button";

const FairUsePopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
        backgroud image
      </div>

      <div className="relative max-w-[700px] p-2 xl:max-w-[450px] xl:scale-75">
        {/* Popup Text */}
        <div className="relative z-10 flex flex-col">
          <h2 className="mb-8 pt-10 text-7xl uppercase text-[#42FF00] xl:text-5xl">Fair Use Policy</h2>
          <p className="font-text-normal mb-24 text-2xl text-white xl:text-lg">
          To protect your privacy while you use our site and let you know what types of information we are collecting and how we are using it, we have developed this Privacy Policy. As we update our services and technologies and as we expand or change our offerings, this Privacy Policy may change from time to time, so please check it periodically.
          <br/><br/>At Green Rebel Brewing Co., we&rsquo;re committed to protecting your privacy. Federal and various state laws require us to tell you how we collect, use, share, and protect your personal information. These laws also limit how we can use your personal information. Please read this Policy carefully to understand what we do with the personal information we collect.
          When you contact us to help you with a question or concern, any personal information you provide is voluntary. We collect and use only the minimum information necessary to respond to your questions and concerns. We may also collect your personal information under other circumstances. In most cases, we collect limited personal information, such as name, address, telephone number, birth date, and/or email address. In limited cases, such as with purchases or resume submissions, we may collect other personal information such as credit card information and resume-related information.
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

export default FairUsePopup;
