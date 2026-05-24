import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/marketing/blog-card";
import { buttonVariants } from "@/components/ui/button";
import { getAllPosts } from "@/lib/blog";
import { brand } from "@/lib/brand";
import { idealCustomer } from "@/lib/marketing-audience";
import { buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description:
    "Operations insights for enterprise logistics teams — procurement, dispatch, inventory, and leadership KPIs across African markets.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {brand.name} Blog
          </p>
          <h1 className="df-page-title mt-2 max-w-2xl text-4xl tracking-tight sm:text-5xl">
            Insights for operations leaders
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {idealCustomer.oneLiner} These articles cover the problems we built{" "}
            {brand.name} to solve — no fluff, no sales theater.
          </p>
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "lg" }), "mt-8 inline-flex gap-2")}
          >
            Start your workspace
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No articles yet. Check back soon.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
