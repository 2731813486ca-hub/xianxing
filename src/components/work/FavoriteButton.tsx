"use client";

import { useState } from "react";
import { FiBookmark } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toaster";

interface FavoriteButtonProps {
  workId: string;
  initialFavorited: boolean;
  initialCount: number;
}

export function FavoriteButton({
  workId,
  initialFavorited,
  initialCount,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setFavorited(!favorited);
    setCount((c) => (favorited ? c - 1 : c + 1));

    try {
      const res = await fetch(`/api/works/${workId}/favorite`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setFavorited(!favorited);
        setCount((c) => (favorited ? c + 1 : c - 1));
        toast(data.error || "操作失败", "error");
      }
    } catch {
      setFavorited(!favorited);
      setCount((c) => (favorited ? c + 1 : c - 1));
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
        favorited
          ? "border-gold bg-gold/10 text-gold"
          : "border-[#2a2a2a] text-muted hover:border-gold hover:text-gold"
      }`}
    >
      <FiBookmark className={favorited ? "fill-current" : ""} size={16} />
      {count}
    </button>
  );
}
