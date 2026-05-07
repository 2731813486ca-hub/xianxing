"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { FeedList } from "@/components/home/FeedList";
import { ScrollReveal } from "@/components/ScrollReveal";
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
  const [featuredWorks, setFeaturedWorks] = useState<WorkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState("");
  const [showCategory, setShowCategory] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Fetch top 2 popular works for featured section
  useEffect(() => {
    fetch("/api/works/popular")
      .then((res) => res.json())
      .then((data: { items: WorkListItem[] }) => {
        setFeaturedWorks(data.items.slice(0, 2));
      })
      .catch(() => {});
  }, []);

  const fetchWorks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "16",
        sort,
      });
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      const res = await fetch(`/api/works?${params}`);
      const data: PaginatedResponse<WorkListItem> = await res.json();
      setWorks(data.items);
      setTotalPages(data.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [search, page, sort, category]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  useEffect(() => {
    setPage(1);
  }, [search, sort, category]);

  // Close sort dropdown on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close category dropdown on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategory(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <HeroSection />

      {/* ===== Works Archive Section ===== */}
      <section id="works" className="section-texture bg-background-raised">
        <div className="mx-auto max-w-[1180px] px-4 pb-20 pt-10 md:pt-12 lg:pt-14">
          {/* Section Header */}
          <ScrollReveal>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-gold" />
                <h2 className="font-serif text-xl font-bold tracking-tight text-foreground md:text-2xl">
                  最新作品
                </h2>
              </div>
              <Link
                href="/works/all"
                className="group inline-flex items-center gap-1.5 rounded-lg border border-gold/20 px-3 py-1.5 text-xs font-medium text-gold transition-all duration-300 hover:border-gold/50 hover:bg-gold/5 hover:shadow-[0_0_12px_rgba(215,170,69,0.08)] sm:flex"
              >
                查看全部
                <span className="inline-block text-sm leading-none transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </ScrollReveal>

          {/* Card block */}
          <div className="rounded-xl border border-border bg-card p-4 md:p-6">

          {/* Toolbar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="搜索作品、创作者或关键词..."
            />
            <div className="flex items-center gap-2 md:gap-3">
              {/* Category dropdown */}
              <div className="relative" ref={categoryRef}>
                <button
                  onClick={() => setShowCategory((p) => !p)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs text-foreground/70 transition-all duration-200 hover:border-gold/40 hover:shadow-[0_0_12px_rgba(215,170,69,0.08)] focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 md:text-sm"
                >
                  <span>{category || "全部分类"}</span>
                  <svg
                    className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${showCategory ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {showCategory && (
                  <div className="absolute right-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
                    <button
                      onClick={() => { setCategory(""); setShowCategory(false); }}
                      className={`w-full px-3 py-2.5 text-left text-xs transition-colors md:text-sm ${
                        !category
                          ? "text-gold"
                          : "text-foreground hover:bg-gold/5"
                      }`}
                    >
                      全部分类
                    </button>
                    <button
                      onClick={() => { setCategory("AI作品"); setShowCategory(false); }}
                      className={`w-full px-3 py-2.5 text-left text-xs transition-colors md:text-sm ${
                        category === "AI作品"
                          ? "text-gold"
                          : "text-foreground hover:bg-gold/5"
                      }`}
                    >
                      AI作品
                    </button>
                    <button
                      onClick={() => { setCategory("IP作品"); setShowCategory(false); }}
                      className={`w-full px-3 py-2.5 text-left text-xs transition-colors md:text-sm ${
                        category === "IP作品"
                          ? "text-gold"
                          : "text-foreground hover:bg-gold/5"
                      }`}
                    >
                      IP作品
                    </button>
                  </div>
                )}
              </div>
              {/* Sort — custom dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setShowSort((p) => !p)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs text-foreground transition-all duration-200 hover:border-gold/40 hover:shadow-[0_0_12px_rgba(215,170,69,0.08)] focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 md:text-sm"
                >
                  <span>{sort === "latest" ? "最新发布" : "最多喜欢"}</span>
                  <svg
                    className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${showSort ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {showSort && (
                  <div className="absolute right-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
                    <button
                      onClick={() => { setSort("latest"); setShowSort(false); }}
                      className={`w-full px-3 py-2.5 text-left text-xs transition-colors md:text-sm ${
                        sort === "latest"
                          ? "text-gold"
                          : "text-foreground hover:bg-gold/5"
                      }`}
                    >
                      最新发布
                    </button>
                    <button
                      onClick={() => { setSort("popular"); setShowSort(false); }}
                      className={`w-full px-3 py-2.5 text-left text-xs transition-colors md:text-sm ${
                        sort === "popular"
                          ? "text-gold"
                          : "text-foreground hover:bg-gold/5"
                      }`}
                    >
                      最多喜欢
                    </button>
                  </div>
                )}
              </div>
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
          <div className="min-h-[500px]">
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
              {/* Featured works — 2 popular works above the grid */}
              {viewMode === "grid" && featuredWorks.length === 2 && (
                <ScrollReveal>
                  <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {featuredWorks.map((work, i) => (
                      <WorkCard key={work.id} work={work} viewMode="grid" featured rank={i + 1} />
                    ))}
                  </div>
                </ScrollReveal>
              )}

              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {works.map((work, i) => (
                  <ScrollReveal
                    key={work.id}
                    delay={
                      viewMode === "grid" ? (i % 4) * 70 : (i % 1) * 70
                    }
                  >
                    <WorkCard work={work} viewMode={viewMode} />
                  </ScrollReveal>
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
        </div>
      </section>

      {/* Gold divider between sections */}
      <div className="bg-background-raised">
        <div className="mx-auto max-w-[1180px] px-4">
          <div className="gradient-divider" />
        </div>
      </div>

      {/* ===== Community Feed Section ===== */}
      <section id="community" className="section-texture bg-background-raised">
        <div className="mx-auto max-w-[1180px] px-4 pb-24 pt-10 md:pt-12 lg:pt-14">
          {/* Section Header */}
          <ScrollReveal>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-gold" />
              <h2 className="font-serif text-xl font-bold tracking-tight text-foreground md:text-2xl">
                社群动态
              </h2>
            </div>
          </ScrollReveal>

          {/* Card block */}
          <ScrollReveal delay={100}>
            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
              <FeedList />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
