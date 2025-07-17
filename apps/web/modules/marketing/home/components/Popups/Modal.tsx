/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Image from "next/image";

import PopupBackground from "../../../../../public/images/bg-modal-3.svg";

import type { PropsWithChildren } from "react";

type ModalPropTypes = {
  isOpen: boolean;
}

export default function Modal({ children, isOpen }: ModalPropTypes & PropsWithChildren) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-all ${isOpen ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}>
      {/* Popup Content */}
      <div className="relative size-full md:size-[64rem]">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={PopupBackground}
            alt="Popup Background"
            layout="fill"
            objectFit="scale-down"
            className="z-auto"
          />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
