import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { formatPostDate, type BlogPostMeta } from "@/lib/blog";

type BlogCardProps = {
  post: BlogPostMeta;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="df-card flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
            {post.category}
          </span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />
            {post.readingTimeMinutes} min read
          </span>
        </div>
        <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-primary"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Read article
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
