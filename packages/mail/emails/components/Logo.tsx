export function Logo({
  className,
  withLabel = true,
}: {
  className?: string;
  withLabel?: boolean;
}) {
  return (
    <span className="text-primary flex items-center font-semibold leading-none">
      {/* svg logo here */}
      {withLabel && <span className="ml-3 text-xl">Gallery Wall</span>}
    </span>
  );
}
