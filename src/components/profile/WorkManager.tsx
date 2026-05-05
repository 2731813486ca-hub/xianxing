"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toaster";
import { FiEdit2, FiTrash2, FiEye, FiEyeOff, FiExternalLink } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface ManagedWork {
  id: string;
  title: string;
  description: string;
  isVisible: boolean;
  isPinned: boolean;
  images: { url: string }[];
  _count: { likes: number; favorites: number };
}

export function WorkManager({ works }: { works: ManagedWork[] }) {
  const router = useRouter();
  const [localWorks, setLocalWorks] = useState(works);

  const toggleVisibility = async (workId: string, current: boolean) => {
    setLocalWorks((prev) =>
      prev.map((w) => (w.id === workId ? { ...w, isVisible: !current } : w))
    );
    const res = await fetch(`/api/works/${workId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: localWorks.find((w) => w.id === workId)?.title || "",
        description: localWorks.find((w) => w.id === workId)?.description || "",
        imageUrls: localWorks.find((w) => w.id === workId)?.images.map((i) => i.url) || [],
      }),
    });
    if (!res.ok) {
      setLocalWorks((prev) =>
        prev.map((w) => (w.id === workId ? { ...w, isVisible: current } : w))
      );
      toast("操作失败", "error");
    }
  };

  const deleteWork = async (workId: string) => {
    if (!confirm("确定要删除这个作品吗？")) return;
    setLocalWorks((prev) => prev.filter((w) => w.id !== workId));
    const res = await fetch(`/api/works/${workId}`, { method: "DELETE" });
    if (!res.ok) {
      toast("删除失败", "error");
      router.refresh();
    } else {
      toast("已删除", "success");
    }
  };

  if (localWorks.length === 0) {
    return (
      <div className="py-12 text-center text-muted">
        还没有作品 No works yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {localWorks.map((work) => (
        <div
          key={work.id}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
        >
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-card-hover">
            {work.images[0] && (
              <img
                src={work.images[0].url}
                alt={work.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-foreground">
              {work.title}
            </h3>
            <p className="text-xs text-muted">
              {work._count.likes} 赞 · {work._count.favorites} 收藏
              {!work.isVisible && " · 已隐藏"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleVisibility(work.id, work.isVisible)}
              className="rounded-lg p-2 text-muted transition-colors hover:text-gold"
              title={work.isVisible ? "隐藏" : "显示"}
            >
              {work.isVisible ? <FiEye size={16} /> : <FiEyeOff size={16} />}
            </button>
            <Link
              href={`/works/${work.id}/edit`}
              className="rounded-lg p-2 text-muted transition-colors hover:text-gold"
            >
              <FiEdit2 size={16} />
            </Link>
            <button
              onClick={() => deleteWork(work.id)}
              className="rounded-lg p-2 text-muted transition-colors hover:text-red-500 dark:hover:text-red-400"
              title="删除"
            >
              <FiTrash2 size={16} />
            </button>
            <Link
              href={`/works/${work.id}`}
              className="rounded-lg p-2 text-muted transition-colors hover:text-gold"
            >
              <FiExternalLink size={16} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
