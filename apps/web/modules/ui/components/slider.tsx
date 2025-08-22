'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import HowDoYouFeelSection from '@marketing/how-do-you-feel/components/Section';
import PickAFrame from '@marketing/what-is-your-pledge/components/Section';
import MainSelfiePage from '@marketing/take-a-selfie/components/MainSelfiePage';
import SelfieCameraMode from '@marketing/take-a-selfie/components/SelfieCameraMode';
import { ProgressBar } from '@marketing/shared/components/ProgressBar';
import ExitButton from '@marketing/shared/components/ExitButton';
import { PledgeStyleEnum } from '@marketing/what-is-your-pledge/types';
import { supabase } from '../../../lib/supabaseClient';
import { RequestStatusSchema } from '../../../../../packages/database';
import { Button } from './button';
import { useUser } from '@saas/auth/hooks/use-user';
import { cn } from '@ui/lib';

export default function MainSlider() {
  // SLIDE STATE
  const searchParams = useSearchParams();
  const noRemoveBackground = searchParams.get('noRemoveBackground');
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}`
    : '?';
  const [slide, setSlide] = useState(1);
  const totalSlides = 3;

  // DATA STATE
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [selectedPledge, setSelectedPledge] = useState<PledgeStyleEnum | null>(
    null
  );
  const [isCameraMode, setIsCameraMode] = useState(false);
  const { userGifRequestId, setUserGifRequestId } = useUser();

  const router = useRouter();
  const progress = (slide / totalSlides) * 100;

  // Calculate translate position for the container
  const getContainerTransform = () => {
    const offset = -(slide - 1) * 100;
    return `translateX(${offset}%)`;
  };

  const handleBack = () => {
    if (slide === 1) {
      router.push('/' + additionUrl);
    } else {
      setSlide(slide - 1);
    }
  };

  // CONTINUE FROM FEELINGS SECTION
  const handleFeelingsContinue = (feelings: string[]) => {
    setSelectedFeelings(feelings);
    setSlide(2);
  };

  // CONTINUE FROM PLEDGE SECTION, ONLY FOR TESTING IF FEELINGS AND PLEDGE IS SELECTED
  const handlePledgeContinue = (pledge: PledgeStyleEnum | null) => {
    if (pledge) {
      setSelectedPledge(pledge);
      setSlide(3);
    }
  };

  const handleTakeASelfie = async () => {
    const data = await supabase
      .from('UserGifRequest')
      .insert([
        {
          requestStatus: RequestStatusSchema.enum.PENDING,
          userId: '1',
          createdAt: new Date().toISOString(), // optional if your DB has a default
        },
      ])
      .select('id');

    const userGifRequests = data.data ?? [];
    if (data.status === 201 && userGifRequests?.length > 0) {
      setUserGifRequestId(userGifRequests[0].id as string);
      setIsCameraMode(true);
    }
  };

  const onGenerateGIF = async (gifUrl: string, videoUrl: string) => {
    await supabase
      .from('UserGifRequest')
      .update({
        requestStatus: RequestStatusSchema.Enum.PROCESSING,
        gifUrl,
      })
      .eq('id', userGifRequestId);

    router.push(
      `/enter-pin-code${additionUrl}&videoUrl=${videoUrl}&gif=${gifUrl}&userGifRequestId=${userGifRequestId}`
    );
  };

  if (isCameraMode) {
    return (
      <SelfieCameraMode
        onExit={() => setIsCameraMode(false)}
        onGenerateGIF={onGenerateGIF}
        pledge={selectedPledge ?? 'support'}
        userGifRequestId={userGifRequestId ?? ''}
      />
    );
  }

  return (
    <div className="relative flex h-screen w-screen flex-col bg-white text-black">
      {/* TOP BAR */}
      <div className="flex w-full flex-col justify-between gap-8 p-10">
        <ProgressBar value={progress} />
        <Button onClick={handleBack} variant="ghost" size="icon" asChild>
          <ChevronLeftIcon
            strokeWidth={4}
            className="h-12 w-12 !text-black hover:text-gray-600"
          />
        </Button>
      </div>

      {/* SLIDER CONTENT */}
      <div className="relative h-full w-full overflow-hidden">
        <motion.div
          className="flex h-full w-full flex-row"
          animate={{ transform: getContainerTransform() }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Slide 1 - How Do You Feel */}
          <div
            className={cn(
              'h-full w-full flex-shrink-0 overflow-y-scroll pb-20 transition-opacity duration-500 lg:overflow-hidden',
              slide === 1 ? 'opacity-100' : 'opacity-0'
            )}
          >
            <HowDoYouFeelSection
              onContinue={handleFeelingsContinue}
              initialSelected={selectedFeelings}
            />
          </div>

          {/* Slide 2 - Pick a Frame */}
          <div
            className={cn(
              'h-full w-full flex-shrink-0 overflow-y-scroll pb-20 transition-opacity duration-500 lg:overflow-hidden',
              slide === 2 ? 'opacity-100' : 'opacity-0'
            )}
          >
            <PickAFrame
              onContinue={handlePledgeContinue}
              onPledgeChange={(pledge: PledgeStyleEnum | null) =>
                setSelectedPledge(pledge)
              }
              selected={selectedPledge}
            />
          </div>

          {/* Slide 3 - Take a Selfie */}
          <div
            className={cn(
              'h-full w-full flex-shrink-0 overflow-y-scroll pb-20 transition-opacity duration-500 lg:overflow-hidden',
              slide === 3 ? 'opacity-100' : 'opacity-0'
            )}
          >
            <MainSelfiePage onStart={() => handleTakeASelfie()} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
