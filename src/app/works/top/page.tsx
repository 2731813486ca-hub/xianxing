"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { FiHeart, FiBookmark, FiAward } from "react-icons/fi";
import type { WorkListItem } from "@/types";

const medals = ["text-yellow-400", "text-gray-300", "text-amber-500"];

export default function TopWorksPage() {
  const [works, setWorks] = useState<WorkListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/works/popular")
      .then((res) => res.json())
      .then((data) => {
        setWorks(data.items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-10 border-b border-border pb-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Top 10 热门作品
          </h1>
          <p className="font-serif text-sm text-muted">根据点赞和收藏综合排名</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-3">
          {works.map((work, index) => (
            <Link
              key={work.id}
              href={`/works/${work.id}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-gold hover:shadow-lg"
            >
              <div className="flex w-10 flex-shrink-0 items-center justify-center">
                {index < 3 ? (
                  <FiAward size={24} className={medals[index]} />
                ) : (
                  <span className="text-lg font-bold text-muted">
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-card-hover">
                {work.images[0] && (
                  <img
                    src={work.images[0].url}
                    alt={work.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-serif text-lg font-semibold text-foreground">
                  {work.title}
                </h3>
                <p className="text-sm text-muted">{work.author.name}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <FiHeart size={14} />
                  {work._count.likes}
                </span>
                <span className="flex items-center gap-1">
                  <FiBookmark size={14} />
                  {work._count.favorites}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
