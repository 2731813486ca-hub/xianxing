"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toaster";
import { FiUser, FiUpload } from "react-icons/fi";

export function SettingsForm() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", wechatName: "", wechatAccount: "" });
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, bio: user.bio, wechatName: user.wechatName || "", wechatAccount: user.wechatAccount || "" });
      setAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setAvatarUrl(data.url);
        toast("头像上传成功", "success");
      } else {
        toast(data.error || "上传失败", "error");
      }
    } catch {
      toast("网络错误", "error");
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
        body: JSON.stringify({ ...form, avatarUrl }),
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gold bg-card">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={form.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <FiUser size={32} className="text-gold" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            className="btn-ghost flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
          >
            {avatarUploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <FiUpload size={14} />
            )}
            {avatarUrl ? "更换头像" : "上传头像"}
          </button>
          {avatarUrl && (
            <button
              type="button"
              onClick={() => setAvatarUrl("")}
              className="text-xs text-muted transition-colors hover:text-red-500 dark:hover:text-red-400"
            >
              清除头像
            </button>
          )}
        </div>
      </div>

      <Input
        label="昵称"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          个人简介
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

      {/* WeChat identity */}
      <div className="border-t border-border pt-4">
        <p className="mb-3 text-xs font-semibold tracking-wider text-foreground/60 uppercase">
          群身份
        </p>
        {user.memberStatus && user.memberStatus !== "unfilled" && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] text-muted">状态：</span>
            {user.memberStatus === "approved" && (
              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] font-medium text-green-600 dark:bg-green-900/20 dark:text-green-500">
                已审核通过
              </span>
            )}
            {user.memberStatus === "pending" && (
              <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[11px] font-medium text-gold">
                等待审核
              </span>
            )}
            {user.memberStatus === "rejected" && (
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
                审核未通过
              </span>
            )}
          </div>
        )}
        <Input
          label="微信昵称"
          placeholder="输入微信昵称"
          value={form.wechatName}
          onChange={(e) => setForm({ ...form, wechatName: e.target.value })}
        />
        <div className="mt-3">
          <Input
            label="微信账号"
            placeholder="输入微信号"
            value={form.wechatAccount}
            onChange={(e) => setForm({ ...form, wechatAccount: e.target.value })}
          />
        </div>
        {user.memberStatus === "unfilled" && (
          <p className="mt-2 text-[11px] text-muted">
            填写群身份并保存后，将提交管理员审核。审核通过后方可发布作品。
          </p>
        )}
        {user.memberStatus === "rejected" && (
          <p className="mt-2 text-[11px] text-muted">
            请修改群身份信息后重新提交审核。
          </p>
        )}
      </div>

      <Button type="submit" loading={loading}>
        保存
      </Button>
    </form>
  );
}
