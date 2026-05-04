"use client";

import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { WorkCard } from "@/components/work/WorkCard";
import type { WorkListItem } from "@/types";
import {
  FiMessageCircle,
  FiBookmark,
} from "react-icons/fi";

interface ForestZoneData {
  reviewedWorks: WorkListItem[];
  favoritedWorks: WorkListItem[];
}

export default function ForestZonePage() {
  const [data, setData] = useState<ForestZoneData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/works/forest-zone")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const hasReviewed = data && data.reviewedWorks.length > 0;
  const hasFavorited = data && data.favoritedWorks.length > 0;
  const empty = !hasReviewed && !hasFavorited;

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-8">
      {/* Header */}
      <div className="mb-10 border-b border-border pb-8">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          树林专区
        </h1>
        <p className="mt-2 font-serif text-sm text-muted">
          树林锐评和精选的作品集
        </p>
      </div>

      {empty ? (
        <EmptyState
          icon={<FiMessageCircle size={40} />}
          title="暂无作品"
          description="还没有作品被树林管理员点评或精选"
        />
      ) : (
        <div className="space-y-14">
          {/* 锐评区 */}
          {hasReviewed && (
            <section>
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10">
                  <FiMessageCircle size={14} className="text-gold" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold text-foreground">
                    锐评区
                  </h2>
                  <p className="text-[11px] tracking-wider text-muted">
                    FOREST REVIEW
                  </p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data!.reviewedWorks.map((work) => (
                  <WorkCard key={work.id} work={work} />
                ))}
              </div>
            </section>
          )}

          {/* 精选区 */}
          {hasFavorited && (
            <section>
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10">
                  <FiBookmark size={14} className="text-gold" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold text-foreground">
                    精选区
                  </h2>
                  <p className="text-[11px] tracking-wider text-muted">
                    FOREST PICK
                  </p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data!.favoritedWorks.map((work) => (
                  <WorkCard key={work.id} work={work} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
