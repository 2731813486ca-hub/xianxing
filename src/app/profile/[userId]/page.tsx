"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WorkCard } from "@/components/work/WorkCard";
import Link from "next/link";

interface ProfileData {
  id: string;
  email: string;
  name: string;
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

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${userId}`).then((r) => r.json()),
      fetch(`/api/users/${userId}/works`).then((r) => r.json()),
    ])
      .then(([profileData, worksData]) => {
        setProfile(profileData);
        setWorks(worksData.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

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
      <ProfileHeader
        profile={profile}
        isOwner={!!user && user.id === profile.id}
        onUpdate={({ bio }) => setProfile((prev) => prev ? { ...prev, bio } : prev)}
      />
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
            <WorkCard key={work.id} work={work as any} />
          ))}
        </div>
      )}
    </div>
  );
}
