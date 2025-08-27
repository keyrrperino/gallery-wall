import React, { useRef, useEffect, useState } from 'react';
import SimpleButton from '@marketing/home/components/Button';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useResponsive } from '@ui/hooks/use-responsive';
import { Logo } from '@shared/components/Logo';
import { ImageMarquee } from '@shared/components/ImageMarquee';
import { Background } from './Background';
import { cn } from '@ui/lib';

export default function HomePage() {
  const sizes = useResponsive();

  const router = useRouter();
  const searchParams = useSearchParams();
  const noRemoveBackground = searchParams.get('noRemoveBackground');
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}`
    : '';

  return (
    <div className="relative flex h-dvh w-screen flex-col items-center justify-between gap-20 bg-[#F7EBDF] pb-20">
      <div className="absolute left-0 h-full w-full portrait:top-48 landscape:top-16">
        <ImageMarquee />
      </div>
      <Logo />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative flex w-full flex-1 flex-col items-center justify-end overflow-hidden text-black portrait:max-w-[827px] portrait:gap-10 landscape:max-w-[851px] landscape:gap-12"
      >
        {/* Main content */}
        <h1 className="font-text-bold text-center uppercase leading-[1] portrait:text-9xl landscape:text-8xl">
          WELCOME TO THE
          <br />
          PLEDGE WALL!
        </h1>
        <div className="flex flex-col gap-10">
          <p className="text-center text-2xl leading-[1.25] text-black/70">
            Join us in taking a stand for coastal protection in Singapore!{' '}
            <br />
            In just a few quick steps, you’ll create your own personalised
            pledge photo to share with the world and be part of a live pledge
            wall growing with every submission.
          </p>
          <SimpleButton
            className="mx-auto w-[400px] self-center rounded-full py-[26px] text-[32px] font-bold text-white"
            onClick={() => router.push(`/pledge-a-photo${additionUrl}`)}
          >
            BEGIN
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
}
