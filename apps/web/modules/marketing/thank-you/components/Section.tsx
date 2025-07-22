"use client";

import ExitButton from "@marketing/shared/components/ExitButton";
import { ChevronLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex w-full h-full flex-col gap-[4vh] items-center justify-around bg-white pb-[5vh]">
        {/* TOP BAR */}
        <div className="flex w-full items-center justify-between px-[5vw] py-[3vh] gap-8">
            <button onClick={() => window.history.back()}>
                <ChevronLeftIcon
                    className="text-black hover:text-gray-600 w-8 h-8 md:w-[3vw] md:h-[3vw]"
                />
            </button>
            <h1 className="text-4xl md:text-[4vw] text-center font-text-bold uppercase leading-[0.75]">THANK YOU!</h1>
            <ExitButton />
        </div>

        {/* INTRO TEXT */}
        <p className="text-base md:text-[2vw] leading-[1] text-center px-9">
            Keep an eye on your inbox! Your pledge will be landing there soon.<br />Thanks for joining us on this adventure!
        </p>

        <div className="relative aspect-square h-[60vw] w-[60vw] md:h-[40vh] md:w-[40vh] rounded-md shadow-md">
            <img
            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
            alt="selfie preview"
            className="w-full h-full object-cover"
            />
        </div>


        <div className="flex flex-col items-center justify-center bg-white text-black gap-6 leading-none">
            <p className="text-base md:text-[2vw] leading-[1] text-center px-9 font-sans text-black/75">
                Returning to homepage in {seconds} second{seconds !== 1 ? "s" : ""}...
            </p>
            <button
                onClick={() => router.push("/")}
                className="text-[#20409A] text-4xl md:text-[4vw] text-center font-text-bold  rounded-full font-text-bold mx-10"
            >
                RETURN TO HOMEPAGE NOW
            </button>
        </div>
    </div>
  );
}
