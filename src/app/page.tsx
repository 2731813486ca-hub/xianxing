"use client";

import { useState, useEffect, useCallback } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { WorkCard } from "@/components/work/WorkCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { WorkListItem, PaginatedResponse } from "@/types";
import {
  FiGrid,
  FiArrowLeft,
  FiArrowRight,
  FiSearch,
} from "react-icons/fi";

export default function HomePage() {
  const [works, setWorks] = useState<WorkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWorks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
        sort,
      });
      if (search) params.set("search", search);
      const res = await fetch(`/api/works?${params}`);
      const data: PaginatedResponse<WorkListItem> = await res.json();
      setWorks(data.items);
      setTotalPages(data.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [search, page, sort]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  return (
    <>
      <HeroSection />

      {/* ===== Works Index Section ===== */}
      <section
        id="works"
        className="bg-background"
      >
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-0">
          {/* Controls Row */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="搜索作品..."
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value as "latest" | "popular")
                }
                className="input-field rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground"
              >
                <option value="latest">最新发布</option>
                <option value="popular">最多喜欢</option>
              </select>
              <div className="flex rounded-lg border border-border">
                <span className="flex items-center gap-1.5 bg-card px-3 py-2.5 text-sm text-gold">
                  <FiGrid size={16} />
                </span>
              </div>
            </div>
          </div>

          {/* Works Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : works.length === 0 ? (
            <EmptyState
              icon={<FiSearch size={40} />}
              title="没有找到作品"
              description="试试其他关键词吧"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      </section>
    </>
  );
}
