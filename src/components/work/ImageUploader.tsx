"use client";

import { useState, useCallback } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { toast } from "@/components/ui/Toaster";

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function ImageUploader({ images, onChange, max = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (images.length + files.length > max) {
        toast(`最多上传 ${max} 张图片`, "error");
        return;
      }

      setUploading(true);
      const newUrls = [...images];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (res.ok) {
            newUrls.push(data.url);
          } else {
            toast(data.error || "上传失败", "error");
          }
        } catch {
          toast("上传失败", "error");
        }
      }

      onChange(newUrls);
      setUploading(false);
    },
    [images, onChange, max]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-border">
            <img
              src={url}
              alt={`图片 ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => removeImage(i)}
              className="absolute right-1 top-1 rounded-full bg-foreground/60 p-1 text-background opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="删除图片"
            >
              <FiX size={12} />
            </button>
          </div>
        ))}
        {images.length < max && (
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-muted transition-colors hover:border-gold hover:text-gold">
            {uploading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <FiUpload size={20} />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>
      <p className="text-xs text-muted">
        支持 JPG/PNG/WebP，单张最大 5MB，最多 {max} 张
      </p>
    </div>
  );
}
