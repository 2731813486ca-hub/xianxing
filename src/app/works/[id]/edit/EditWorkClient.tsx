"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { EditForm } from "@/components/work/EditForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

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
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          编辑作品
        </h1>
      </div>
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
        <EditForm work={work} />
      </div>
    </div>
  );
}
