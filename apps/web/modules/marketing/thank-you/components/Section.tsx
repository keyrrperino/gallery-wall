"use client";

import ExitButton from "@marketing/shared/components/ExitButton";
import { ChevronLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SimpleButton from "@marketing/home/components/Button";

export default function ThankYouScreen() {
  const [seconds, setSeconds] = useState(30);
  const router = useRouter();

  useEffect(() => {
    if (seconds <= 0) {
      router.push("/");
      return;
    }
    const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, router]);

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
            <h2 className="text-[130px] uppercase">THANK YOU!</h2>
            <ExitButton />
        </div>

        {/* INTRO TEXT */}
        <p className="text-[50px] text-center mb-24 mx-[15vw] leading-tight">
            Keep an eye on your inbox! Your pledge will be landing there soon.<br />Thanks for joining us on this adventure!
        </p>

        <div className="w-[33vw] h-[33vw] bg-gray-200 overflow-hidden rounded-md shadow-md">
            <img
            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
            alt="selfie preview"
            className="w-full h-full object-cover"
            />
        </div>


        <div className="flex flex-col items-center justify-center bg-white text-black gap-6 leading-none mt-28">
            <p className="text-[50px] font-sans text-center text-black/75">
                Returning to homepage in {seconds} second{seconds !== 1 ? "s" : ""}...
            </p>
            <button
                onClick={() => router.push("/")}
                className="text-[#20409A] text-[75px] rounded-full font-text-bold"
            >
                RETURN TO HOMEPAGE NOW
            </button>
        </div>
    </div>
  );
}
