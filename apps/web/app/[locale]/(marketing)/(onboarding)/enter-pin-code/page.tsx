/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import PinEntry from "@marketing/enter-pin-code/components/PinEntry";

export default function EnterPinCode() {

  return (
    <div className="absolute top-0 flex h-screen w-screen">
      <PinEntry />
    </div>
  );
}
