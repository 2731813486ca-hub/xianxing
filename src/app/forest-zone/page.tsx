"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { WorkCard } from "@/components/work/WorkCard";
import type { WorkListItem, PaginatedResponse } from "@/types";
import { FiMessageCircle, FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function ForestZonePage() {
  const [works, setWorks] = useState<WorkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/works/forest-zone?page=${page}&limit=12`)
      .then((res) => res.json())
      .then((data: PaginatedResponse<WorkListItem>) => {
        setWorks(data.items);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-8">
      {/* Header */}
      <div className="mb-10 border-b border-border pb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              树林专区
            </h1>
          </div>
          <p className="font-serif text-sm text-muted">
            管理员精挑细选的优质作品
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : works.length === 0 ? (
        <EmptyState
          icon={<FiMessageCircle size={40} />}
          title="暂无作品"
          description="还没有作品被管理员点评过"
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost rounded-lg p-2 disabled:opacity-30"
                aria-label="上一页"
              >
                <FiArrowLeft size={18} />
              </button>
              <span className="font-serif text-sm tracking-wider text-muted">
                {String(page).padStart(2, "0")} /{" "}
                {String(totalPages).padStart(2, "0")}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost rounded-lg p-2 disabled:opacity-30"
                aria-label="下一页"
              >
                <FiArrowRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
