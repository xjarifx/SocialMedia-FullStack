import { Avatar } from "./Avatar";
import { UserInfo } from "./UserInfo";
import { Button } from "../ui/button";

interface UserCardProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    plan?: "FREE" | "PRO";
  };
  currentUserId?: string;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: "default" | "outline" | "ghost";
  };
}

export function UserCard({ user, currentUserId, action }: UserCardProps) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div className="flex items-center justify-between border-b border-white/15 bg-white/5 p-4 transition hover:bg-white/[0.07]">
      <div className="flex items-center gap-3">
        <Avatar initials={initials} size="lg" variant="secondary" />
        <div>
          <UserInfo
            name={`${user.firstName} ${user.lastName}`}
            handle={user.username}
            plan={user.plan}
            userId={user.id}
            currentUserId={currentUserId}
            showHandle={true}
          />
        </div>
      </div>
      {action && (
        <Button
          variant={action.variant || "outline"}
          size="sm"
          onClick={action.onClick}
          disabled={action.disabled || currentUserId === user.id}
          className="rounded-xl border-white/20 bg-transparent text-white/85 hover:bg-white/10 hover:text-white"
        >
          {currentUserId === user.id ? "You" : action.label}
        </Button>
      )}
    </div>
  );
}
