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
      className="relative flex flex-col items-center justify-center bg-[#f7f0e8] text-black min-h-screen w-full overflow-hidden"
    >
      {/* Top images */}
      <div
        className="
          absolute top-0 self-center m-[clamp(8px,1vw,32px)]
          w-[30vh] h-[30vh]
        "
      >
        <Image
          src="/images/bg-image1.png"
          alt="top-left"
          fill
          className="object-contain"
        />
      </div>

      {/* Main content */}
      <h1
        className="
          text-4xl md:text-[7.7vw]
          font-text-bold uppercase text-center leading-[0.75]
        "
      >
        WELCOME TO THE<br />PUB PLEDGE WALL!
      </h1>
      <p
        className="
          text-base md:text-[2vw] mt-4
          text-center mx-[clamp(16px,22vw,600px)]
           leading-[1]
        "
      >
        Join us in taking a stand for coastal protection in Singapore! <br />
        In just a few quick steps, you’ll create your own personalized pledge
        photo to share with the world and be part of a live pledge wall
        growing with every submission.
      </p>

      <SimpleButton
        className="
          absolute bottom-[clamp(40px,7.5vh,160px)] self-center mt-10
          text-[clamp(2rem,3vw,4rem)]
          text-white
          py-[clamp(0.55rem,1.5vw,2rem)]
          px-[clamp(2rem,10vw,12rem)]
          rounded-full font-bold z-10
        "
        onClick={() => router.push('/pledge-a-photo')}
      >
        BEGIN
      </SimpleButton>

      {/* Bottom images */}
      <div
        className="
          absolute bottom-0 left-0
          w-[30vh] h-[30vh]
        "
      >
        <Image
          src="/images/bg-image2.png"
          alt="bottom-left"
          fill
          className="object-contain"
        />
      </div>
      <div
        className="
          absolute bottom-0 right-0
          w-[30vh] h-[30vh]
        "
      >
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
