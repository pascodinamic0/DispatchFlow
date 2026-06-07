import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  userName?: string | null;
  userEmail?: string | null;
  avatarUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
};

export function UserAvatar({
  userName,
  userEmail,
  avatarUrl,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const initials =
    userName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    userEmail?.slice(0, 2).toUpperCase() ||
    "DF";

  return (
    <Avatar className={cn("shrink-0 overflow-hidden", className)}>
      {avatarUrl ? (
        <AvatarImage
          src={avatarUrl}
          alt={userName ?? "Profile"}
          className="object-cover"
        />
      ) : null}
      <AvatarFallback className={fallbackClassName}>{initials}</AvatarFallback>
    </Avatar>
  );
}
