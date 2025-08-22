'use client';

import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import SimpleButton from '@marketing/home/components/Button';
import clsx from 'clsx';
import { cn } from '@ui/lib';

export default function SavingDoneScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noRemoveBackground = searchParams.get('noRemoveBackground');
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}`
    : '?';

  const handleContinue = () => {
    router.push('/receive-pledge-copy' + additionUrl);
  };

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-start bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }} // fades in over 1s
    >
      <div className="flex h-full w-full flex-col gap-9">
        <h1 className="mx-20 mt-16 px-10 text-center text-[80px] uppercase leading-[1]">
          Look up!
        </h1>
        <p className="text-center text-[24px] leading-tight text-black/70">
          Your pledge has joined others on our Live Pledge Wall!
          <br />
          You’re now part of a growing wave of support for Singapore’s coastal
          future.
        </p>
      </div>

      <SimpleButton
        className={cn(
          'mt-10 w-[428px] self-center rounded-full pb-[26px] pl-[11vw] pr-[11vw] pt-[26px] text-[24px] font-bold text-white'
        )}
        onClick={handleContinue}
      >
        CONTINUE
      </SimpleButton>
    </motion.div>
  );
}
