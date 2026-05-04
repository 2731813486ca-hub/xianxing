"use client";

import { useState } from "react";
import { toast } from "@/components/ui/Toaster";

interface CommentFormProps {
  workId: string;
  onCommentAdded: () => void;
  isReview?: boolean;
}

export function CommentForm({ workId, onCommentAdded, isReview }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const endpoint = isReview
        ? `/api/works/${workId}/reviews`
        : `/api/works/${workId}/comments`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (res.ok) {
        setContent("");
        onCommentAdded();
        toast(isReview ? "点评成功" : "评论成功", "success");
      } else {
        const data = await res.json();
        toast(data.error || "发送失败", "error");
      }
    } catch {
      toast("网络错误", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isReview ? "写下你的管理员点评..." : "写下你的评论..."}
        maxLength={500}
        rows={3}
        className="input-field min-h-[80px] w-full resize-none rounded-lg border px-4 py-3 text-sm"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted">{content.length}/500</span>
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className={`inline-flex items-center gap-1 rounded px-4 py-2 text-xs font-semibold tracking-wider transition-all disabled:opacity-40 ${
            isReview
              ? "border border-gold bg-gold/10 text-gold hover:bg-gold/20"
              : "bg-gold text-[#080807] hover:bg-gold-light"
          }`}
        >
          {submitting ? "发送中..." : isReview ? "发布点评" : "发表评论"}
        </button>
      </div>
    </form>
  );
}
