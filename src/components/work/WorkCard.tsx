"use client";

import Link from "next/link";
import type { WorkListItem } from "@/types";
import { FiHeart, FiBookmark } from "react-icons/fi";

export function WorkCard({ work }: { work: WorkListItem }) {
  const imageUrl = work.images[0]?.url || "";

  return (
    <Link href={`/works/${work.id}`}>
      <article className="group overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#141414] card-hover">
        <div className="aspect-[4/3] overflow-hidden bg-[#1a1a1a]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={work.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              暂无图片
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="truncate font-serif text-lg font-semibold text-foreground">
            {work.title}
          </h3>
          {work.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {work.description}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted">{work.author.name}</span>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <FiHeart size={12} />
                {work._count.likes}
              </span>
              <span className="flex items-center gap-1">
                <FiBookmark size={12} />
                {work._count.favorites}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
