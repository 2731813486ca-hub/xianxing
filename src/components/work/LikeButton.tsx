"use client";

import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toaster";

interface LikeButtonProps {
  workId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({ workId, initialLiked, initialCount }: LikeButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    // Optimistic update
    setLiked(!liked);
    setCount((c) => (liked ? c - 1 : c + 1));

    try {
      const res = await fetch(`/api/works/${workId}/like`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        // Revert
        setLiked(!liked);
        setCount((c) => (liked ? c + 1 : c - 1));
        toast(data.error || "操作失败", "error");
      }
    } catch {
      setLiked(!liked);
      setCount((c) => (liked ? c + 1 : c - 1));
      toast("网络错误", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm transition-all ${
        liked
          ? "border-red-800 bg-red-900/20 text-red-400"
          : "border-border text-muted hover:border-red-800 hover:text-red-400"
      }`}
    >
      <FiHeart className={liked ? "fill-current" : ""} size={16} />
      {count}
    </button>
  );
}
