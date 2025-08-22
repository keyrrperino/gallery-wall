import SimpleButton from '@marketing/home/components/Button';
import { PledgeStyleEnum } from '../types';
import { PledgeSlider } from './PledgeSlider';

const PLEDGES: {
  image: string;
  style: PledgeStyleEnum;
}[] = [
  {
    style: PledgeStyleEnum.SUPPORT,
    image: '/images/frames/frame-1.svg',
  },
  {
    style: PledgeStyleEnum.FUTURE,
    image: '/images/frames/frame-2.svg',
  },
  {
    style: PledgeStyleEnum.CARE,
    image: '/images/frames/frame-3.svg',
  },
];

export default function PickAFrame({
  onContinue,
  onPledgeChange,
  selected,
}: {
  onContinue: (pledge: PledgeStyleEnum | null) => void;
  onPledgeChange: (pledge: PledgeStyleEnum | null) => void;
  selected: PledgeStyleEnum | null;
}) {
  const handlePick = (val: PledgeStyleEnum) => {
    onPledgeChange(selected === val ? null : val);
  };

  return (
    <div className="flex h-full w-full flex-col items-start justify-between overflow-hidden bg-white text-black">
      <div className="flex flex-col gap-9 px-10">
        <h1 className="font-text-bold text-[80px] uppercase leading-[100%] -tracking-[1.6px]">
          PICK A FRAME AND YOUR PLEDGE MESSAGE
        </h1>
        <p className="text-2xl leading-[150%] text-black/70">
          Choose one pledge to appear with your frame!
        </p>
      </div>
      <PledgeSlider pledges={PLEDGES} selected={selected} onPick={handlePick} />
      <SimpleButton
        className="mx-auto w-[400px] items-center justify-center self-center rounded-full py-[26px] text-[32px] font-bold text-white"
        disabled={selected === null}
        onClick={() => onContinue(selected)}
      >
        CONTINUE
      </SimpleButton>
    </div>
  );
}
