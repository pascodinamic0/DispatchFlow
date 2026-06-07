import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

type OrgLogoProps = {
  logoUrl?: string | null;
  organizationName?: string | null;
  className?: string;
  priority?: boolean;
};

export function OrgLogo({
  logoUrl,
  organizationName,
  className,
  priority,
}: OrgLogoProps) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={organizationName ? `${organizationName} logo` : "Organization logo"}
        className={cn("max-h-full max-w-full object-contain", className)}
      />
    );
  }

  return (
    <Logo
      className={cn("max-h-full max-w-full object-contain", className)}
      priority={priority}
    />
  );
}
