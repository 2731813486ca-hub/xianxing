"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { EditForm } from "@/components/work/EditForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";

interface WorkData {
  id: string;
  title: string;
  description: string;
  productUrl: string;
  images: { url: string; alt: string }[];
  authorId: string;
}

export function EditWorkClient() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [work, setWork] = useState<WorkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/works/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setWork(data as WorkData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (authLoading || loading) return <LoadingSpinner />;

  if (!work) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold">作品不存在</h2>
        <Link href="/" className="mt-4 inline-block text-gold hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  if (!user || user.id !== work.authorId) {
    router.push(`/works/${id}`);
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <BackButton />
      <div className="mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
            编辑作品
          </h1>
          <p className="text-sm font-light tracking-[0.15em] text-muted uppercase">
            修改作品
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <EditForm work={work} />
      </div>
    </div>
  );
}
