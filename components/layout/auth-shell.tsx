import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { brand } from "@/lib/brand";

type AuthShellProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};

export function AuthShell({ children, title, description }: AuthShellProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-[var(--brand-navy)] p-10 text-white lg:flex">
        <Link href="/" className="inline-flex rounded-lg bg-white px-3 py-2 shadow-sm">
          <Logo className="max-h-10 w-auto" priority />
        </Link>
        <div className="space-y-6">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            {brand.tagline}
          </p>
          <h2 className="text-3xl font-bold leading-tight">
            Logistics and procurement, unified.
          </h2>
          <p className="max-w-md text-slate-300">
            Track requests, assign dispatches, and manage inventory — built for
            operational clarity on desktop and mobile.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl">
          <Image
            src={brand.marketing.authPreview.src}
            alt={brand.marketing.authPreview.alt}
            width={brand.marketing.authPreview.width}
            height={brand.marketing.authPreview.height}
            className="h-auto w-full object-cover object-top opacity-90"
            priority
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-[var(--brand-surface)] p-6 text-slate-900 sm:p-10">
        <div className="mb-8 w-full max-w-md lg:hidden">
          <Link href="/" className="inline-block">
            <Logo className="max-h-10" priority />
          </Link>
        </div>
        <div className="w-full max-w-md space-y-2 text-center lg:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className="mt-6 w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
