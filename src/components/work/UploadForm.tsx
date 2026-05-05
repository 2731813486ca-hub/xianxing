"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploader } from "./ImageUploader";
import { toast } from "@/components/ui/Toaster";

const CATEGORIES = [
  { value: "", label: "选择类目" },
  { value: "AI作品", label: "AI 作品" },
  { value: "IP作品", label: "IP 作品" },
];

export function UploadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    productUrl: "",
    category: "",
  });
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast("请输入作品标题", "error");
      return;
    }
    if (!form.category) {
      toast("请选择作品类目", "error");
      return;
    }
    if (images.length === 0) {
      toast("请上传至少一张图片", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrls: images }),
      });
      const data = await res.json();
      if (res.ok) {
        toast("作品发布成功！", "success");
        router.push(`/works/${data.id}`);
      } else {
        toast(data.error || "发布失败", "error");
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
        placeholder="给你的作品起个名字"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      {/* Category selector */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          作品类目
        </label>
        <div className="flex gap-2">
          {CATEGORIES.filter((c) => c.value).map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setForm({ ...form, category: cat.value })}
              className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium tracking-wider transition-all duration-200 ${
                form.category === cat.value
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-muted hover:border-foreground/20 hover:text-foreground/70"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          作品描述
        </label>
        <textarea
          className="input-field min-h-[100px] w-full rounded-lg px-4 py-2.5 text-sm"
          placeholder="描述你的作品..."
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
      <Button type="submit" loading={loading} className="w-full">
        发布作品
      </Button>
    </form>
  );
}
