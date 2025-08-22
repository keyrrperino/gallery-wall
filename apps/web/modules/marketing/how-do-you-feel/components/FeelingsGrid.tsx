import { FeelItem } from './FeelItem';
export function FeelingsGrid({
  feelings,
  selected,
  onPick,
}: {
  feelings: string[];
  selected: string[];
  onPick: (feel: string) => void;
}) {
  const renderSpace = [...Array(1)].map((value, i) => (
    <button
      key={i + 'space'}
      title={value}
      className={`font-text-regular relative h-[100px] rounded-[1.4vw] text-[2vh] tracking-[2px] md:py-[2vh] md:text-[3.3vh] md:tracking-[3px]`}
    ></button>
  ));

  return (
    <div className="grid max-h-[1/3] w-full grid-cols-2 gap-[1vw] md:grid-cols-3">
      {feelings.map((feel) => (
        <FeelItem
          key={feel}
          displayText={feel}
          selected={selected.includes(feel)}
          onClick={() => onPick(feel)}
        />
      ))}
      {renderSpace}
    </div>
  );
}
