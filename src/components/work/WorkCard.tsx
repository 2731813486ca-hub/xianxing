"use client";

import Link from "next/link";
import type { WorkListItem } from "@/types";
import { FiHeart, FiBookmark } from "react-icons/fi";

export function WorkCard({
  work,
  viewMode = "grid",
}: {
  work: WorkListItem;
  viewMode?: "grid" | "list";
}) {
  const imageUrl = work.images[0]?.url || "";

  if (viewMode === "list") {
    return (
      <Link href={`/works/${work.id}`}>
        <article className="flex items-center gap-5 rounded-xl border border-border bg-card p-4 transition-all hover:border-gold/40 hover:shadow-sm">
          <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-card-hover md:h-24 md:w-36">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={work.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted">
                暂无图片
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-serif text-base font-semibold text-foreground">
              {work.title}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted">
              {work.description || "—"}
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted">
              <span>{work.author.name}</span>
              <span className="flex items-center gap-1">
                <FiHeart size={11} /> {work._count.likes}
              </span>
              <span className="flex items-center gap-1">
                <FiBookmark size={11} /> {work._count.favorites}
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/works/${work.id}`}>
      <article className="group cursor-pointer">
        {/* Image — 16:10 ratio */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-card-hover shadow-sm">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={work.title}
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              暂无图片
            </div>
          )}
          {/* Hover overlay */}
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/[0.03]" />
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <h3 className="truncate font-serif text-base font-semibold text-foreground transition-colors group-hover:text-gold">
            {work.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted">
            {work.description || "—"}
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-muted">{work.author.name}</span>
            <div className="flex items-center gap-2.5 text-[11px] text-muted">
              <span className="flex items-center gap-1">
                <FiHeart size={10} />
                {work._count.likes}
              </span>
              <span className="flex items-center gap-1">
                <FiBookmark size={10} />
                {work._count.favorites}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
