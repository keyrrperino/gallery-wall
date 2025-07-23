import { FeelItem } from "./FeelItem";
export function FeelingsGrid({
  feelings,
  selected,
  onPick,
}: {
  feelings: string[];
  selected: string[];
  onPick: (feel: string) => void;
}) {
  const renderSpace = ([...Array(1)].map((value, i) => (
      <button
        key={i+'space'}
        title={value}
        className={`relative rounded-[1.4vw] h-[100px] text-[2vh] md:text-[3.3vh] md:py-[2vh] font-text-regular tracking-[2px] md:tracking-[3px]`}
      >

      </button>
    )));
    
  return (
    <div className="w-full max-h-[1/3] grid grid-cols-2 md:grid-cols-3 gap-[1vw]">
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