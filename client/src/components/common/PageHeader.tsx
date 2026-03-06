import { ChevronLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backPath?: string;
  action?: {
    icon: LucideIcon;
    onClick: () => void;
    label: string;
  };
}

export function PageHeader({
  title,
  subtitle,
  showBackButton = false,
  backPath = "/",
  action,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between border-b border-white/15 p-3">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={() => navigate(backPath)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-[20px] font-medium text-white">{title}</h1>
          {subtitle && <p className="text-[13px] text-white/60">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-white/60 transition hover:bg-white/10 hover:text-white"
          title={action.label}
        >
          <action.icon className="h-4.5 w-4.5" />
        </button>
      )}
    </div>
  );
}
