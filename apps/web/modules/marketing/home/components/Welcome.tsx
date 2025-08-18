import React, { useRef, useEffect, useState } from "react";
import SimpleButton from "@marketing/home/components/Button";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useResponsive } from "@ui/hooks/use-responsive";
import { Logo } from "@shared/components/Logo";
import { ImageMarquee } from "@shared/components/ImageMarquee";
import { Background } from "./Background";
import { cn } from "@ui/lib";

export default function HomePage() {
  const sizes = useResponsive();

  const router = useRouter();
  const searchParams = useSearchParams();
  const noRemoveBackground = searchParams.get("noRemoveBackground");
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}`
    : "";

  return (
    <div className="relative h-full flex flex-col justify-between gap-20 pb-20 bg-[#F7EBDF]">
      <Logo />
      <ImageMarquee />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative gap-10 pb-20 px-[100px] flex flex-col flex-1 items-center text-black w-full overflow-hidden"
      >
        {/* Main content */}
        <h1 className="text-[7vh] font-text-bold uppercase text-center leading-[1]">
          WELCOME TO THE
          <br />
          PUB PLEDGE WALL!
        </h1>
        <p className="text-2xl px-[46px] leading-[1.25] text-center text-black/70">
          Join us in taking a stand for coastal protection in Singapore! <br />
          In just a few quick steps, you’ll create your own personalized pledge
          photo to share with the world and be part of a live pledge wall
          growing with every submission.
        </p>
      </motion.div>
      <SimpleButton
        className="self-center text-white rounded-full font-bold py-[26px] text-[32px] w-[400px] mx-auto"
        onClick={() => router.push(`/pledge-a-photo${additionUrl}`)}
      >
        BEGIN
      </SimpleButton>
    </div>
  );
}
