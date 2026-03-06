import type { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
  activeColor?: string;
  className?: string;
}

export function ActionButton({
  icon: Icon,
  count,
  isActive = false,
  onClick,
  activeColor = "bg-red-500/20 text-red-400",
  className = "",
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-medium transition ${
        isActive ? activeColor : "text-white/80 hover:bg-white/10"
      } ${className}`}
    >
      <Icon className={`h-4 w-4 ${isActive ? "fill-current" : ""}`} />
      <span>{count}</span>
    </button>
  );
}
