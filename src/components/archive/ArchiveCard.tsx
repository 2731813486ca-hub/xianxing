"use client";

import Link from "next/link";
import type { ArchiveItem } from "@/types";
import { FiCalendar, FiTag } from "react-icons/fi";

export function ArchiveCard({ archive }: { archive: ArchiveItem }) {
  return (
    <Link
      href={`/forest-zone/${archive.id}`}
      className="group interactive-card block rounded-xl border border-border bg-card p-5"
    >
      <h3 className="font-serif text-base font-semibold text-foreground transition-colors group-hover:text-gold line-clamp-2">
        {archive.title}
      </h3>

      {archive.summary && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {archive.summary}
        </p>
      )}

      {archive.keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {archive.keywords.slice(0, 4).map((kw) => (
            <span
              key={kw}
              className="rounded-full border border-gold/15 bg-gold/[0.03] px-2 py-0.5 text-[10px] text-gold/80"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 text-[11px] text-muted/60">
        {archive.sourceName && (
          <span className="flex items-center gap-1">
            <FiTag size={10} />
            {archive.sourceName}
          </span>
        )}
        {archive.sourceDate && (
          <span className="flex items-center gap-1">
            <FiCalendar size={10} />
            {archive.sourceDate}
          </span>
        )}
      </div>
    </Link>
  );
}
