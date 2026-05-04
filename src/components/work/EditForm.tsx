"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploader } from "./ImageUploader";
import { toast } from "@/components/ui/Toaster";

interface EditFormProps {
  work: {
    id: string;
    title: string;
    description: string;
    productUrl: string;
    images: { url: string; alt: string }[];
  };
}

export function EditForm({ work }: EditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: work.title,
    description: work.description,
    productUrl: work.productUrl,
  });
  const [images, setImages] = useState<string[]>(
    work.images.map((i) => i.url)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast("请输入作品标题", "error");
      return;
    }
    if (images.length === 0) {
      toast("请上传至少一张图片", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/works/${work.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrls: images }),
      });
      if (res.ok) {
        toast("更新成功！", "success");
        router.push(`/works/${work.id}`);
        router.refresh();
      } else {
        const data = await res.json();
        toast(data.error || "更新失败", "error");
      }
    } catch {
      toast("网络错误", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium">作品图片</label>
        <ImageUploader images={images} onChange={setImages} />
      </div>
      <Input
        label="作品标题"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          作品描述
        </label>
        <textarea
          className="input-field min-h-[100px] w-full rounded-lg px-4 py-2.5 text-sm"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <Input
        label="产品链接（可选）"
        placeholder="放入网页、小程序等产品的链接或文档的下载链接"
        value={form.productUrl}
        onChange={(e) => setForm({ ...form, productUrl: e.target.value })}
      />
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          保存修改
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
