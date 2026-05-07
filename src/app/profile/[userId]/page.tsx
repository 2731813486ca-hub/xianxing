"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WorkCard } from "@/components/work/WorkCard";
import { SUPER_ADMIN_EMAIL } from "@/lib/constants";
import Link from "next/link";
import { FiShield, FiEdit2, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import { BackButton } from "@/components/ui/BackButton";

interface ProfileData {
  id: string;
  email: string;
  name: string;
  role: string;
  memberStatus: string;
  bio: string;
  avatarUrl: string;
  wechatName: string;
  wechatAccount: string;
  _count: { works: number };
}

interface WorkItem {
  id: string;
  title: string;
  description: string;
  popularityScore: number;
  createdAt: string;
  isVisible: boolean;
  images: { url: string; alt: string }[];
  _count: { likes: number; favorites: number };
  author: { id: string; name: string; avatarUrl: string };
}

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchWorks = useCallback(() => {
    fetch(`/api/users/${userId}/works`)
      .then((r) => r.json())
      .then((data) => setWorks(data.items || []))
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${userId}`).then((r) => r.json()),
      fetchWorks(),
    ])
      .then(([profileData]) => {
        setProfile(profileData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId, fetchWorks]);

  const isOwner = !!user && user.id === profile?.id;

  const handleDelete = async (workId: string) => {
    if (!confirm("确定要删除这个作品吗？此操作不可撤销。")) return;
    setDeleting(workId);
    try {
      const res = await fetch(`/api/works/${workId}`, { method: "DELETE" });
      if (res.ok) {
        setWorks((prev) => prev.filter((w) => w.id !== workId));
      } else {
        const data = await res.json();
        alert(data.error || "删除失败");
      }
    } catch {
      alert("删除失败");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleVisibility = async (workId: string, current: boolean) => {
    try {
      const res = await fetch(`/api/works/${workId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !current }),
      });
      if (res.ok) {
        setWorks((prev) =>
          prev.map((w) =>
            w.id === workId ? { ...w, isVisible: !current } : w
          )
        );
      } else {
        const data = await res.json();
        alert(data.error || "操作失败");
      }
    } catch {
      alert("操作失败");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold">用户不存在</h2>
        <Link href="/" className="mt-4 inline-block text-gold hover:underline">
          返回首页
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <BackButton />
      <ProfileHeader
        profile={profile}
        isOwner={!!user && user.id === profile.id}
        onUpdate={({ bio }) => setProfile((prev) => prev ? { ...prev, bio } : prev)}
      />
      {!!user && user.email === SUPER_ADMIN_EMAIL && (
        <div className="mt-4 flex justify-center sm:justify-start">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 rounded-lg border border-gold/25 px-4 py-2 text-xs tracking-wider text-gold transition-all hover:bg-gold/10 hover:border-gold/40"
          >
            <FiShield size={14} />
            管理后台
          </Link>
        </div>
      )}
      <div className="gradient-divider my-8" />
      <div className="mb-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          作品集
        </h2>
        <p className="text-xs font-light tracking-[0.15em] text-muted uppercase mt-0.5">
          Portfolio
        </p>
      </div>
      {works.length === 0 ? (
        <p className="text-center text-muted py-12">暂无作品</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <div key={work.id} className="group relative">
              <WorkCard work={work as any} />
              {isOwner && (
                <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  {/* Visibility toggle */}
                  <button
                    onClick={() => handleToggleVisibility(work.id, work.isVisible)}
                    className="rounded-lg bg-black/60 p-2 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-gold"
                    aria-label={work.isVisible ? "隐藏" : "显示"}
                    title={work.isVisible ? "隐藏作品" : "显示作品"}
                  >
                    {work.isVisible ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                  {/* Edit */}
                  <Link
                    href={`/works/${work.id}/edit`}
                    className="rounded-lg bg-black/60 p-2 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-gold"
                    aria-label="编辑"
                    title="编辑作品"
                  >
                    <FiEdit2 size={14} />
                  </Link>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(work.id)}
                    disabled={deleting === work.id}
                    className="rounded-lg bg-black/60 p-2 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-red-400"
                    aria-label="删除"
                    title="删除作品"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              )}
              {!work.isVisible && isOwner && (
                <div className="pointer-events-none absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] text-white/80 backdrop-blur-sm">
                  已隐藏
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
