import React, { useRef, useEffect, useState } from "react";
import SimpleButton from "@marketing/home/components/Button";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useResponsive } from "@ui/hooks/use-responsive";
import clsx from "clsx";

const defaultImages = [
  "/images/stickers/image 1.png",
  "/images/stickers/image 2.png",
  "/images/stickers/image 3.png",
  "/images/stickers/image 4.png",
  "/images/stickers/image 5.png",
  "/images/stickers/image 6.png",
  "/images/stickers/image 7.png",
  "/images/stickers/image 8.png",
  "/images/stickers/image 9.png",
  "/images/stickers/image 10.png",
];

export default function HomePage() {
  const sizes = useResponsive();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const noRemoveBackground = searchParams.get("noRemoveBackground");
  const additionUrl = noRemoveBackground ? `?noRemoveBackground=${noRemoveBackground}` : '';
  
  // If you have a dynamic images array, use it here:
  // const images = (yourImagesArray && yourImagesArray.length > 0) ? yourImagesArray : defaultImages;
  // Otherwise, just use defaultImages:
  const images = defaultImages;

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={
        clsx(
          "relative",
          `gap-[3vh]`,
          "flex",
          "flex-col",
          "items-center",
          "bg-[#F7EBDF]",
          "text-black",
          "min-h-screen",
          "w-full",
          "overflow-hidden",
        )
      }
    >
      {/* Scrolling images */}
      <div className="relative w-full overflow-hidden pt-[3vh]">
        <motion.div
          ref={rowRef}
          animate={controls}
          className="flex gap-[5vw] w-max"
          style={{ x: 0 }}
        >
          {[...images, ...images].map((src, idx) => (
            <img key={idx} src={src} alt="" className="h-[20vh] w-auto" />
          ))}
        </motion.div>
      </div>
      {/* Main content */}
      <h1
        className={clsx(
          'text-[7vh]',
          "font-text-bold", 
          "uppercase",
          "text-center",
          "leading-[1]"
        )}
      >
        WELCOME TO THE<br />PUB PLEDGE WALL!
      </h1>
      <div
        className="
          text-base
          text-center
          text-[2.1vh]
          leading-[1]
          pr-[13vw]
          pl-[13vw]
        "
      >
        Join us in taking a stand for coastal protection in Singapore! <br />
        In just a few quick steps, you’ll create your own personalized pledge
        photo to share with the world and be part of a live pledge wall
        growing with every submission.
      </div>

      <SimpleButton
        className={clsx(
          "md:absolute",
          "bottom-[5vh] md:bottom-[3vh]",
          "self-center",
          "text-white",
          "rounded-full font-bold",
          "pt-[2vh] md:pt-[3vh]",
          "pb-[2vh] md:pb-[3vh]",
          "pr-[10vh]",
          "pl-[10vh]",
          "text-[3vh]"
        )}
        onClick={() => router.push(`/pledge-a-photo${additionUrl}`)}
      >
        BEGIN
      </SimpleButton>
    </motion.div>
  );
}
