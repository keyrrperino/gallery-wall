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

  const rowRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [rowWidth, setRowWidth] = useState(0);

  useEffect(() => {
    if (rowRef.current) {
      setRowWidth(rowRef.current.scrollWidth / 2); // Only the width of one set
    }
  }, []);

  useEffect(() => {
    if (!rowWidth) return;
    const animate = async () => {
      while (true) {
        await controls.start({
          x: -rowWidth,
          transition: { duration: 20, ease: "linear" },
        });
        controls.set({ x: 0 });
      }
    };
    controls.set({ x: 0 });
    animate();
    // eslint-disable-next-line
  }, [rowWidth]);

  return (
    <div className="relative bg-[#F7EBDF]">
      <Logo className="absolute w-full" />
      <Background />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative gap-10 pb-20 px-[100px] flex flex-col justify-end items-center text-black min-h-screen w-full overflow-hidden"
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

        <SimpleButton
          className="self-center text-white rounded-full font-bold py-[26px] text-[32px] w-[400px] mx-auto"
          onClick={() => router.push(`/pledge-a-photo${additionUrl}`)}
        >
          BEGIN
        </SimpleButton>
      </motion.div>
    </div>
  );
}
