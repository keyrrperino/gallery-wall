import React from "react";
import SimpleButton from "@marketing/home/components/Button";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative flex flex-col items-center justify-center bg-[#f7f0e8] text-black min-h-screen w-full overflow-hidden border-2 border-black"
    >
      {/* Top images */}
      <div className="absolute top-0 self-center m-4 w-1/3 h-1/3">
        <Image
          src="/images/bg-image1.png"
          alt="top-left"
          fill
          className="object-contain"
        />
      </div>

      {/* Main content */}
      <h1 className="text-[200px] font-text-bold uppercase text-center mt-40 mb-10 leading-none">
        WELCOME TO THE<br />PUB PLEDGE WALL!
      </h1>
      <p className="text-[50px] text-center mb-10 mx-[22vw] leading-tight">
        Join us in taking a stand for coastal protection in Singapore. In just a
        few quick steps, you’ll create your own personalized pledge photo to
        share with the world and be part of a live pledge wall growing with
        every submission.
      </p>
      <SimpleButton
        className="absolute bottom-20 self-center mt-10 text-[75px] text-white py-16 px-80 rounded-full font-bold"
        onClick={() => router.push("/pledge-a-photo")}
      >
        BEGIN
      </SimpleButton>

      {/* Bottom images */}
      <div className="absolute bottom-0 left-0 w-[25vw] h-[25vw]">
        <Image
          src="/images/bg-image2.png"
          alt="bottom-left"
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-0 right-0 w-[25vw] h-[25vw]">
        <Image
          src="/images/bg-image3.png"
          alt="bottom-right"
          fill
          className="object-contain"
        />
      </div>
    </motion.div>
  );
}
