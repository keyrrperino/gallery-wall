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
  return (
    <div className="flex flex-row flex-wrap gap-9 w-full mx-auto mb-8">
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