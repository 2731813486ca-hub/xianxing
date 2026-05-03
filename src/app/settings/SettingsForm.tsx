"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toaster";

export function SettingsForm() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, bio: user.bio });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.name.trim()) {
      toast("请输入昵称", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await refreshUser();
        toast("保存成功！", "success");
      } else {
        const data = await res.json();
        toast(data.error || "保存失败", "error");
      }
    } catch {
      toast("网络错误", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="昵称"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          个人标语
        </label>
        <textarea
          className="input-field min-h-[80px] w-full rounded-lg px-4 py-2.5 text-sm"
          placeholder="介绍一下自己..."
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          maxLength={200}
        />
        <p className="mt-1 text-xs text-muted">{form.bio.length}/200</p>
      </div>
      <Button type="submit" loading={loading}>
        保存
      </Button>
    </form>
  );
}
