"use client";

import { useState, useEffect, useCallback } from "react";
import { WorkGrid } from "@/components/work/WorkGrid";
import { SearchBar } from "@/components/ui/SearchBar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { WorkListItem, PaginatedResponse } from "@/types";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function HomePage() {
  const [works, setWorks] = useState<WorkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWorks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "12" });
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
  }, [search, page]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-12 border-b border-border pb-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            发现作品
          </h1>
          <p className="text-sm font-light tracking-[0.15em] text-muted uppercase">
            Discover Works
          </p>
        </div>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          探索创意与灵感的交汇 &mdash; 汇聚每一位创作者的独特视角
        </p>
      </div>

      <div className="mb-8">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <WorkGrid items={works} />
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost rounded-lg p-2 disabled:opacity-30"
                aria-label="上一页"
              >
                <FiArrowLeft size={18} />
              </button>
              <span className="text-sm text-muted">
                {page} / {totalPages}
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
