interface CharacterCounterProps {
  current: number;
  limit: number;
  className?: string;
}

export function CharacterCounter({
  current,
  limit,
  className = "",
}: CharacterCounterProps) {
  const progressPercent = Math.min((current / limit) * 100, 100);
  const isOverLimit = current > limit;

  return (
    <div className={className}>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className={`h-full transition-all ${
            isOverLimit ? "bg-red-500" : "bg-[#1d9bf0]"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p
        className={`mt-1 text-[11px] ${
          isOverLimit ? "text-red-400" : "text-white/60"
        }`}
      >
        {current}/{limit} characters
      </p>
    </div>
  );
}
