"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { WorkCard } from "@/components/work/WorkCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { WorkListItem, PaginatedResponse } from "@/types";
import {
  FiGrid,
  FiList,
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
      <div className="-mt-14 md:-mt-16">
        <HeroSection />
      </div>

      {/* ===== Works Archive Section ===== */}
      <section id="works" className="bg-background">
        <div className="mx-auto max-w-[1180px] px-4 pb-20 pt-10 md:pt-12 lg:pt-14">
          {/* Section Header */}
          <div className="mb-8 flex items-center">
            <span className="mr-3 h-2.5 w-2.5 rounded-full bg-gold" />
            <h2 className="font-serif text-xl font-bold tracking-tight text-foreground md:text-2xl">
              最新作品
            </h2>
            <span className="mx-5 h-px flex-1 bg-border" />
            <Link
              href="/works/top"
              className="hidden flex-shrink-0 items-center gap-1 text-sm text-muted transition-colors hover:text-gold sm:flex"
            >
              查看全部
              <span className="text-base leading-none">→</span>
            </Link>
          </div>

          {/* Toolbar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="搜索作品、创作者或关键词..."
            />
            <div className="flex items-center gap-2 md:gap-3">
              {/* Category — visual only */}
              <select
                className="input-field rounded-lg border border-border bg-card px-3 py-2.5 text-xs text-foreground md:text-sm"
                disabled
              >
                <option>全部分类</option>
              </select>
              {/* Sort */}
              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value as "latest" | "popular")
                }
                className="input-field rounded-lg border border-border bg-card px-3 py-2.5 text-xs text-foreground md:text-sm"
              >
                <option value="latest">最新发布</option>
                <option value="popular">最多喜欢</option>
              </select>
              {/* View toggle */}
              <div className="flex rounded-lg border border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${
                    viewMode === "grid"
                      ? "bg-gold/10 text-gold"
                      : "bg-card text-muted hover:text-foreground"
                  }`}
                  aria-label="宫格视图"
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 transition-colors ${
                    viewMode === "list"
                      ? "bg-gold/10 text-gold"
                      : "bg-card text-muted hover:text-foreground"
                  }`}
                  aria-label="列表视图"
                >
                  <FiList size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Works Grid / List */}
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
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {works.map((work) => (
                  <WorkCard key={work.id} work={work} viewMode={viewMode} />
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
