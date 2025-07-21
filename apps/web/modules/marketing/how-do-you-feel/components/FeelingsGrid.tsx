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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 w-full mx-auto mb-8">
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