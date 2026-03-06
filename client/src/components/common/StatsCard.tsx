interface Stat {
  label: string;
  value: number;
  onClick?: () => void;
}

interface StatsCardProps {
  stats: Stat[];
  className?: string;
}

export function StatsCard({ stats, className = "" }: StatsCardProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {stats.map((stat, index) => (
        <button
          key={index}
          onClick={stat.onClick}
          disabled={!stat.onClick}
          className={`flex-1 border border-white/15 bg-white/5 px-4 py-3 text-center transition ${
            stat.onClick
              ? "cursor-pointer hover:bg-white/10"
              : "cursor-default"
          }`}
        >
          <p className="text-[20px] font-medium text-white">{stat.value}</p>
          <p className="text-[12px] text-white/65">{stat.label}</p>
        </button>
      ))}
    </div>
  );
}
