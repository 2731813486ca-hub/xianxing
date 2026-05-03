"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ImageGallery } from "@/components/work/ImageGallery";
import { LikeButton } from "@/components/work/LikeButton";
import { FavoriteButton } from "@/components/work/FavoriteButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FiEdit2, FiExternalLink, FiUser } from "react-icons/fi";
import type { WorkDetail } from "@/types";

export function WorkDetailClient() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [work, setWork] = useState<WorkDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/works/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setWork(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

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
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2a2a2a]">
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
      </div>
    </div>
  );
}
