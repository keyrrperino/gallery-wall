'use client';

import { Logo } from '@shared/components/Logo';
import { useUser } from '@saas/auth/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SimpleButton from '@marketing/home/components/Button';

export default function ThankYouSection() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);
  const { gifUrl } = useUser();

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Navigate to homepage when countdown reaches 0
      router.push('/');
    }
  }, [countdown, router]);

  const handleReturnHome = () => {
    router.push('/');
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-14 bg-white">
      <Logo />

      {/* MAIN HEADING */}
      <h1 className="text-center text-[80px] uppercase leading-[1] -tracking-[1.6px]">
        Thank you!
      </h1>

      {/* GIF PREVIEW SECTION */}
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="h-[560px] w-[560px] overflow-hidden shadow-lg">
          <img
            src={gifUrl || ''}
            alt="Your Pledge GIF"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* COUNTDOWN AND RETURN HOME SECTION */}
      <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-[48px] p-2 pb-20">
        <p className="font-text-regular text-center text-xl not-italic leading-[1.25] text-black/70">
          Returning to homepage in {countdown} seconds...
        </p>
        <SimpleButton
          className="w-[400px] items-center justify-center self-center rounded-full py-[26px] text-[32px] font-bold text-white"
          onClick={handleReturnHome}
        >
          Return to Homepage now
        </SimpleButton>
      </div>
    </div>
  );
}
