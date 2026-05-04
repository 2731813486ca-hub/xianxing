"use client";

import type { CommentItem } from "@/types";
import { FiUser } from "react-icons/fi";

interface CommentCardProps {
  comment: CommentItem;
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        comment.isReview
          ? "border-gold/40 bg-gold/[0.04]"
          : "border-border bg-card"
      }`}
    >
      {comment.isReview && (
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5">
          <span className="text-[10px] font-semibold tracking-wider text-gold">
            管理员点评
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-border">
          {comment.user.avatarUrl ? (
            <img
              src={comment.user.avatarUrl}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <FiUser size={14} className="text-muted" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {comment.user.name}
            </span>
            {comment.isReview && (
              <span className="text-[10px] font-medium text-gold">
                点评
              </span>
            )}
            <span className="ml-auto text-[11px] text-muted">
              {new Date(comment.createdAt).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
}
