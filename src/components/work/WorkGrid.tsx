"use client";

import type { WorkListItem } from "@/types";
import { WorkCard } from "./WorkCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FiGrid } from "react-icons/fi";

export function WorkGrid({ items }: { items: WorkListItem[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<FiGrid size={40} />}
        title="还没有作品"
        description="成为第一个分享作品的人吧"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((work) => (
        <WorkCard key={work.id} work={work} />
      ))}
    </div>
  );
}
