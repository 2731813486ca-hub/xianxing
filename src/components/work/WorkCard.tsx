"use client";

import Link from "next/link";
import type { WorkListItem } from "@/types";
import { FiHeart, FiBookmark } from "react-icons/fi";

export function WorkCard({ work }: { work: WorkListItem }) {
  const imageUrl = work.images[0]?.url || "";

  return (
    <Link href={`/works/${work.id}`}>
      <article className="group cursor-pointer">
        {/* Image Container — portrait-leaning aspect ratio */}
        <div className="relative aspect-[4/5] overflow-hidden bg-card-hover">
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
          <div className="pointer-events-none absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/[0.03]" />
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1.5 border-b border-border pb-4">
          <h3 className="truncate font-serif text-base font-semibold text-foreground transition-colors group-hover:text-gold">
            {work.title}
          </h3>
          <p className="text-xs text-muted">{work.author.name}</p>
          <div className="flex items-center gap-3 pt-1 text-xs text-muted">
            <span className="flex items-center gap-1">
              <FiHeart size={11} />
              {work._count.likes}
            </span>
            <span className="flex items-center gap-1">
              <FiBookmark size={11} />
              {work._count.favorites}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
