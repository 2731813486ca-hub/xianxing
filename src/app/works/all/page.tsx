"use client";

import { useState, useEffect, useCallback } from "react";
import { WorkCard } from "@/components/work/WorkCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { WorkListItem, PaginatedResponse } from "@/types";
import { FiSearch, FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function AllWorksPage() {
  const [works, setWorks] = useState<WorkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWorks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "24",
        sort,
      });
      const res = await fetch(`/api/works?${params}`);
      const data: PaginatedResponse<WorkListItem> = await res.json();
      setWorks(data.items);
      setTotalPages(data.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, sort]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  useEffect(() => {
    setPage(1);
  }, [sort]);

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            全部作品
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            浏览所有创作者的独立作品
          </p>
        </div>

        {/* Sort toggle */}
        <div className="flex rounded-lg border border-border">
          <button
            onClick={() => setSort("latest")}
            className={`px-4 py-2 text-xs tracking-wider transition-colors md:text-sm ${
              sort === "latest"
                ? "bg-gold/10 text-gold"
                : "bg-card text-muted hover:text-foreground"
            }`}
          >
            最新发布
          </button>
          <button
            onClick={() => setSort("popular")}
            className={`px-4 py-2 text-xs tracking-wider transition-colors md:text-sm ${
              sort === "popular"
                ? "bg-gold/10 text-gold"
                : "bg-card text-muted hover:text-foreground"
            }`}
          >
            最多收藏
          </button>
        </div>
      </div>

      {/* Works grid */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : works.length === 0 ? (
          <EmptyState
            icon={<FiSearch size={40} />}
            title="还没有作品"
            description="成为第一个发布作品的人吧"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {works.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>

            {/* Pagination */}
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
    </div>
  );
}
