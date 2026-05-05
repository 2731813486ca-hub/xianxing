"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiActivity } from "react-icons/fi";
import type { FeedItem } from "@/types";
import { timeAgo } from "@/lib/time";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

export function FeedList() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feed")
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<FiActivity size={40} />}
        title="还没有动态"
        description="成为第一个发布作品的人吧"
      />
    );
  }

  return (
    <>
      {/* Feed list */}
      <div className="divide-y divide-border/60">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 py-3.5 transition-colors hover:bg-card/50 -mx-3 px-3 rounded-lg"
          >
            {/* Avatar */}
            {item.author.avatarUrl ? (
              <img
                src={item.author.avatarUrl}
                alt={item.author.name}
                className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-[11px] font-semibold text-gold ring-1 ring-gold/10">
                {item.author.name.charAt(0)}
              </div>
            )}

            {/* Content */}
            <div className="min-w-0 flex-1 text-sm leading-relaxed">
              <span className="font-medium text-foreground">{item.author.name}</span>
              <span className="text-muted"> 发布了 </span>
              <Link
                href={`/works/${item.id}`}
                className="font-medium text-gold transition-colors hover:text-gold-light"
              >
                《{item.title}》
              </Link>
            </div>

            {/* Time */}
            <span className="flex-shrink-0 text-[11px] text-muted">
              {timeAgo(item.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
