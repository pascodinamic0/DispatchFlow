import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { BlogPostBody } from "@/components/marketing/blog-post-body";
import { buttonVariants } from "@/components/ui/button";
import {
  formatPostDate,
  getAllSlugs,
  getPostBySlug,
} from "@/lib/blog";
import { brand } from "@/lib/brand";
import { buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found" };

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All articles
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
              {post.category}
            </span>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden />
              {post.readingTimeMinutes} min read
            </span>
            <span>· {post.author}</span>
          </div>
          <h1 className="df-page-title mt-4 text-3xl tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <BlogPostBody body={post.body} />

        <div className="mt-16 rounded-2xl border border-border bg-muted/40 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {brand.tagline}
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight">
            Ready to replace spreadsheet chaos?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your workspace, invite your team, and run procurement, dispatch, and
            inventory in one platform.
          </p>
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "lg" }), "mt-6")}
          >
            Create free workspace
          </Link>
        </div>
      </section>
    </>
  );
}
