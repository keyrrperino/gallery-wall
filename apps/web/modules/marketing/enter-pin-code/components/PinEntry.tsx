"use client";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ChevronLeftIcon, DeleteIcon } from "lucide-react";
import { useState } from "react";

export default function PinEntry() {
  const [pin, setPin] = useState<string>("");

  const handlePress = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="flex w-full h-full flex-col gap-12 items-center bg-white">
        <div className="flex w-full items-center justify-between h-80 px-16 font-text-bold text-black">
            <button>
              <ChevronLeftIcon
                className="text-black hover:text-gray-600"
                width={120}
                height={120}
              />
            </button>
            <h2 className="text-[110px]">ENTER PIN CODE</h2>
            <button>
                <Cross2Icon color="black" width={120} height={120} />
            </button>
        </div>

        <p className="text-[50px] text-center mb-10 mx-[22vw] leading-tight">
        Please wait while we make sure your selfie is safe to send to the gallery wall.
        </p>

        <div className="flex flex-row gap-48 mt-20">

        {/* Left side - image */}
        <div className="flex flex-col items-center">
          <div className="w-[33vw] h-[50vh] bg-gray-200 overflow-hidden rounded-md shadow-md">
            <img
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
              alt="selfie preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-bold w-full bg-[#F7EBDF] text-[66px] text-center uppercase font-text-bold p-8">My Video Selfie</div>
        </div>

        {/* Right side - PIN pad */}
        <div className="flex flex-col items-center gap-16">

          {/* Dots */}
          <div className="flex flex-row w-full gap-7 items-center justify-around">
            {[0,1,2,3].map((i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full ${
                  pin.length > i ? "bg-black" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>

          {/* Numpad grid */}
          <div className="grid grid-cols-3 gap-20">
            {["1","2","3","4","5","6","7","8","9"].map((digit, i) => (
              <button
                key={i}
                onClick={() => handlePress(digit)}
                className="w-40 h-40 rounded-full bg-gray-100 text-[60px] font-semibold hover:bg-gray-200 active:bg-gray-300"
              >
                {digit}
              </button>
            ))}
            <div></div>
            <button
                onClick={() => handlePress("0")}
                className="w-40 h-40 rounded-full bg-gray-100 text-[60px] font-semibold hover:bg-gray-200 active:bg-gray-300"
              >
                0
              </button>
            <button
                onClick={handleBackspace}
              className="flex w-40 h-40 rounded-full items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
            >
              <DeleteIcon className="text-black" width={60} height={60} />
            </button>
          </div>
        </div>
        </div>
      </div>
  );
}
