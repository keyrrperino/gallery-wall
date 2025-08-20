import { FeelItem } from "./FeelItem";
export function FeelingsFlex({
  feelings,
  selected,
  onPick,
}: {
  feelings: string[];
  selected: string[];
  onPick: (feel: string) => void;
}) {
  return (
    <div className="w-full flex flex-wrap gap-x-5 gap-y-8">
      {feelings.map((feel) => (
        <FeelItem
          key={feel}
          displayText={feel}
          selected={selected.includes(feel)}
          onClick={() => onPick(feel)}
        />
      ))}
    </div>
  );
}
