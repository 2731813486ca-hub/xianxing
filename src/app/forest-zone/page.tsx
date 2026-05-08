"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar";
import { ArchiveCard } from "@/components/archive/ArchiveCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ArchiveItem, PaginatedResponse } from "@/types";
import { FiSearch, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Suspense } from "react";

function ForestZoneContent() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";

  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState(initialKeyword);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keywords, setKeywords] = useState<string[]>([]);

  const fetchArchives = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "16" });
      if (search) params.set("search", search);
      if (keyword) params.set("keyword", keyword);
      const res = await fetch(`/api/archives?${params}`);
      const data: PaginatedResponse<ArchiveItem> = await res.json();
      setArchives(data.items);
      setTotalPages(data.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [search, keyword, page]);

  useEffect(() => {
    fetchArchives();
  }, [fetchArchives]);

  useEffect(() => {
    setPage(1);
  }, [search, keyword]);

  // Load keywords from keyword query param
  useEffect(() => {
    if (initialKeyword) setKeyword(initialKeyword);
  }, [initialKeyword]);

  // Load all unique keywords
  useEffect(() => {
    fetch("/api/archives?pageSize=50")
      .then((r) => r.json())
      .then((data: PaginatedResponse<ArchiveItem>) => {
        const kwSet = new Set<string>();
        data.items.forEach((a) => a.keywords.forEach((k) => kwSet.add(k)));
        setKeywords(Array.from(kwSet).sort());
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-8">
      {/* Header */}
      <ScrollReveal>
        <div className="mb-10 border-b border-border pb-8 text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            树林专区
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            观点集合 · 知识档案
          </p>
        </div>
      </ScrollReveal>

      {/* Search + Keywords */}
      <ScrollReveal delay={80}>
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="搜索观点标题、摘要、正文..."
            />
          </div>

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setKeyword("")}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                  !keyword
                    ? "bg-gold/15 text-gold border-gold/30"
                    : "border border-border text-muted hover:text-foreground"
                }`}
              >
                全部
              </button>
              {keywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setKeyword(kw === keyword ? "" : kw)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    kw === keyword
                      ? "bg-gold/15 text-gold border-gold/30"
                      : "border-border text-muted hover:text-foreground hover:border-gold/20"
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Results */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : archives.length === 0 ? (
          <EmptyState
            icon={<FiSearch size={40} />}
            title="没有找到观点"
            description={search || keyword ? "试试其他关键词吧" : "暂未发布任何观点"}
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {archives.map((archive, i) => (
                <ScrollReveal key={archive.id} delay={i * 60}>
                  <ArchiveCard archive={archive} />
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
                >
                  <FiArrowLeft size={18} />
                </button>
                <span className="font-serif text-sm tracking-wider text-muted">
                  {String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-ghost rounded-lg p-2 disabled:opacity-30"
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

export default function ForestZonePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ForestZoneContent />
    </Suspense>
  );
}
