interface ProgressBarProps {
  value: number;
  label?: string;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, label, size = 'md' }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${safeValue}%`}
      className={`w-full overflow-hidden rounded-full bg-[#EAF3F6] dark:bg-[#0B1726] border border-[#DCE7ED]/80 dark:border-white/10 ${
        size === 'sm' ? 'h-[7px]' : 'h-[10px]'
      }`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-l from-[#28B5C5] to-[#176B87] transition-[width] duration-300 ease-out"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
