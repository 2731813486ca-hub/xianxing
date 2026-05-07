"use client";

import Link from "next/link";
import type { WorkListItem } from "@/types";
import { FiHeart, FiBookmark } from "react-icons/fi";

export function WorkCard({
  work,
  viewMode = "grid",
  featured = false,
}: {
  work: WorkListItem;
  viewMode?: "grid" | "list";
  featured?: boolean;
}) {
  const imageUrl = work.images[0]?.url || "";

  if (featured) {
    return (
      <Link href={`/works/${work.id}`}>
        <article className="group cursor-pointer overflow-hidden rounded-xl border border-gold/15 bg-card transition-all duration-300 hover:border-gold/30 hover:shadow-[0_4px_24px_rgba(215,170,69,0.08)]">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Image — wider ratio */}
            <div className="relative aspect-[16/10] overflow-hidden md:col-span-2 md:aspect-auto">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={work.title}
                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full min-h-[180px] items-center justify-center bg-card-hover text-sm text-muted">
                  暂无图片
                </div>
              )}
            </div>
            {/* Content */}
            <div className="flex flex-col justify-center p-5 md:col-span-3 md:p-6">
              {work.category && (
                <span className={`mb-2 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider ${
                  work.category === "AI作品"
                    ? "bg-blue-900/20 text-blue-400"
                    : "bg-purple-900/20 text-purple-400"
                }`}>
                  {work.category}
                </span>
              )}
              <h3 className="font-serif text-lg font-bold text-foreground transition-colors group-hover:text-gold md:text-xl lg:text-2xl">
                {work.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                {work.description || "—"}
              </p>
              <div className="mt-4 flex items-center gap-5 text-xs text-muted">
                <span className="font-medium text-foreground/80">{work.author.name}</span>
                <span className="flex items-center gap-1.5">
                  <FiHeart size={13} /> {work._count.likes}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiBookmark size={13} /> {work._count.favorites}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (viewMode === "list") {
    return (
      <Link href={`/works/${work.id}`}>
        <article className="flex items-center gap-5 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md">
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
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-card-hover shadow-sm">
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
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-serif text-base font-semibold text-foreground transition-colors group-hover:text-gold">
              {work.title}
            </h3>
            {work.category && (
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider ${
                work.category === "AI作品"
                  ? "bg-blue-900/20 text-blue-400"
                  : "bg-purple-900/20 text-purple-400"
              }`}>
                {work.category}
              </span>
            )}
          </div>
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
