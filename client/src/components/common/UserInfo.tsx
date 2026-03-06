import { Link } from "react-router-dom";
import { ProBadge } from "../ProBadge";

interface UserInfoProps {
  name: string;
  handle: string;
  plan?: "FREE" | "PRO";
  userId?: string;
  currentUserId?: string;
  showHandle?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function UserInfo({
  name,
  handle,
  plan,
  userId,
  currentUserId,
  showHandle = true,
  size = "md",
  className = "",
}: UserInfoProps) {
  const textSize = size === "sm" ? "text-[12px]" : "text-[14px]";
  const handleSize = size === "sm" ? "text-[11px]" : "text-[12px]";

  const content = (
    <span
      className={`inline-flex items-center gap-1 font-medium text-white ${textSize} ${className}`}
    >
      {name}
      <ProBadge isPro={plan === "PRO"} />
    </span>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {userId && currentUserId !== userId ? (
        <Link to={`/users/${userId}`} className="hover:underline">
          {content}
        </Link>
      ) : (
        content
      )}
      {showHandle && (
        <span className={`text-white/60 ${handleSize}`}>@{handle}</span>
      )}
    </div>
  );
}
