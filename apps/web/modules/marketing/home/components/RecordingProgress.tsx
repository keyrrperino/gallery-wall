export default function RecordingProgress({
  progress,
  maxProgress = 100,
  className,
}: {
  progress: number;
  className?: string;
  maxProgress?: number;
}) {
  const radius = 34;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;

  const calculateStrokeDashoffset = (progress: number) => {
    return circumference - (progress / maxProgress) * circumference;
  };

  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: 'rotate(-90deg)' }}
      className={className}
    >
      <circle
        r={radius}
        cx="36"
        cy="36"
        fill="transparent"
        stroke="#484848"
        strokeWidth={strokeWidth}
      ></circle>
      <circle
        r={radius}
        cx="36"
        cy="36"
        stroke="#ff0000"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="transparent"
        strokeDasharray={circumference}
        style={{
          strokeDashoffset: `${calculateStrokeDashoffset(progress)}px`,
        }}
      ></circle>
    </svg>
  );
}
