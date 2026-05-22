"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardSearch() {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const q = new FormData(form).get("q");
    const query = typeof q === "string" ? q.trim() : "";
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="relative hidden w-full min-w-0 sm:block sm:max-w-md lg:max-w-lg"
      >
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          placeholder="Search requests, dispatches…"
          className="h-9 border-transparent bg-background/80 pl-9 shadow-none ring-1 ring-border/60 focus-visible:ring-ring/50"
          aria-label="Search"
        />
      </form>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 rounded-lg text-muted-foreground sm:hidden"
        aria-label="Search"
        onClick={() => {
          const q = window.prompt("Search requests and dispatches");
          if (q?.trim()) {
            router.push(`/search?q=${encodeURIComponent(q.trim())}`);
          }
        }}
      >
        <Search className="size-4" />
      </Button>
    </>
  );
}
