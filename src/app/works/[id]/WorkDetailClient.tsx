"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { ImageGallery } from "@/components/work/ImageGallery";
import { LikeButton } from "@/components/work/LikeButton";
import { FavoriteButton } from "@/components/work/FavoriteButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CommentForm } from "@/components/comment/CommentForm";
import { CommentCard } from "@/components/comment/CommentCard";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FiEdit2, FiExternalLink, FiUser } from "react-icons/fi";
import type { WorkDetail, CommentItem } from "@/types";
import { BackButton } from "@/components/ui/BackButton";

export function WorkDetailClient() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [work, setWork] = useState<WorkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/works/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setWork(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const fetchComments = useCallback(() => {
    fetch(`/api/works/${id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments || []);
        setCommentsLoading(false);
      })
      .catch(() => setCommentsLoading(false));
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  if (loading) return <LoadingSpinner />;
  if (!work)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold">作品不存在</h2>
        <Link href="/" className="mt-4 inline-block text-gold hover:underline">
          返回首页
        </Link>
      </div>
    );

  const isOwner = user?.id === work.author.id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <BackButton />
      <ImageGallery images={work.images} />

      <div className="mt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {work.title}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href={`/profile/${work.author.id}`}
                className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-border">
                  {work.author.avatarUrl ? (
                    <img
                      src={work.author.avatarUrl}
                      alt=""
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser size={12} />
                  )}
                </div>
                {work.author.name}
              </Link>
            </div>
          </div>
          {isOwner && (
            <Link
              href={`/works/${id}/edit`}
              className="btn-ghost flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
            >
              <FiEdit2 size={14} />
              编辑
            </Link>
          )}
        </div>

        {work.description && (
          <p className="mt-4 leading-relaxed text-muted">{work.description}</p>
        )}

        {work.productUrl && (
          <a
            href={work.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 text-sm text-gold transition-colors hover:text-gold-light"
          >
            <FiExternalLink size={14} />
            查看产品
          </a>
        )}

        <div className="mt-6 gradient-divider" />

        <div className="mt-6 flex items-center gap-4">
          <LikeButton
            workId={work.id}
            initialLiked={work.userLiked || false}
            initialCount={work._count.likes}
          />
          <FavoriteButton
            workId={work.id}
            initialFavorited={work.userFavorited || false}
            initialCount={work._count.favorites}
          />
        </div>

        {/* Comment Section */}
        <div className="mt-10">
          <div className="gradient-divider" />
          <h2 className="mt-6 font-serif text-xl font-semibold text-foreground">
            评论 ({comments.length})
          </h2>

          {/* Admin review form — only visible to admins */}
          {user && user.role === "admin" && (
            <div className="mt-6 rounded-xl border border-gold/20 bg-gold/[0.03] p-4">
              <p className="mb-1 text-xs font-semibold tracking-wider text-gold">
                管理员点评
              </p>
              <p className="mb-2 text-[11px] text-muted">
                点评会置顶显示，被点评的作品将出现在「树林专区」
              </p>
              <CommentForm
                workId={id}
                onCommentAdded={fetchComments}
                isReview
              />
            </div>
          )}

          {/* User comment form */}
          {user ? (
            !user.role || user.role !== "admin" ? (
              <CommentForm workId={id} onCommentAdded={fetchComments} />
            ) : null
          ) : (
            <p className="mt-4 text-sm text-muted">
              <Link href="/login" className="text-gold hover:underline">
                登录
              </Link>{" "}
              后发表评论
            </p>
          )}

          {/* Comments list */}
          {commentsLoading ? (
            <div className="mt-6 flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : comments.length === 0 ? (
            <p className="mt-6 text-sm text-muted">暂无评论</p>
          ) : (
            <div className="mt-6 space-y-4">
              {comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
