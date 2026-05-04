"use client";

import { useState } from "react";
import Link from "next/link";
import type { UserProfile } from "@/types";
import { FiMail, FiUser, FiEdit2, FiSave, FiX, FiMessageCircle } from "react-icons/fi";

interface ProfileHeaderProps {
  profile: UserProfile & { _count?: { works: number } };
  isOwner?: boolean;
  onUpdate?: (data: { bio: string }) => void;
}

export function ProfileHeader({ profile, isOwner, onUpdate }: ProfileHeaderProps) {
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(profile.bio);
  const [saving, setSaving] = useState(false);
  const [showWechat, setShowWechat] = useState(false);

  const handleSaveBio = async () => {
    if (!onUpdate) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, bio: bioDraft, avatarUrl: profile.avatarUrl, wechatName: profile.wechatName, wechatAccount: profile.wechatAccount }),
      });
      if (res.ok) {
        onUpdate({ bio: bioDraft });
        setEditingBio(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancelBio = () => {
    setBioDraft(profile.bio);
    setEditingBio(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center sm:flex-row sm:text-left">
      {/* Avatar */}
      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-gold bg-card">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <FiUser size={32} className="text-gold" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          {profile.name}
        </h1>

        {/* Bio — with inline editing for owner */}
        <div className="group mt-1 flex items-start gap-2">
          {editingBio ? (
            <div className="flex-1 space-y-1">
              <textarea
                className="input-field min-h-[60px] w-full rounded-lg px-3 py-2 text-sm"
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                maxLength={200}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveBio}
                  disabled={saving}
                  className="flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors"
                >
                  <FiSave size={12} /> {saving ? "保存中..." : "保存"}
                </button>
                <button
                  onClick={handleCancelBio}
                  className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
                >
                  <FiX size={12} /> 取消
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={`font-serif text-sm ${profile.bio ? "text-muted" : "text-muted/50 italic"}`}>
                {profile.bio || (isOwner ? "添加个人简介..." : "")}
              </p>
              {isOwner && (
                <button
                  onClick={() => { setBioDraft(profile.bio); setEditingBio(true); }}
                  className="mt-0.5 flex-shrink-0 text-muted/40 hover:text-gold transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="编辑简介"
                >
                  <FiEdit2 size={12} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Meta row */}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <FiMail size={12} />
            {profile.email}
          </span>
          {profile._count && (
            <span>{profile._count.works} 个作品</span>
          )}

          {/* 群身份 button */}
          <button
            onClick={() => setShowWechat(!showWechat)}
            className="flex items-center gap-1 border border-gold/30 rounded px-2 py-0.5 text-gold text-[11px] tracking-wider transition-colors hover:bg-gold/10"
          >
            <FiMessageCircle size={11} />
            群身份
          </button>
        </div>

        {/* WeChat popover */}
        {showWechat && (
          <div className="mt-3 w-64 rounded-lg border border-gold/15 bg-card p-3 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold tracking-wider text-foreground">群身份</span>
              <button onClick={() => setShowWechat(false)} className="text-muted hover:text-foreground">
                <FiX size={14} />
              </button>
            </div>
            {profile.wechatName || profile.wechatAccount ? (
              <div className="space-y-1.5 text-xs text-muted">
                {profile.wechatName && (
                  <div className="flex justify-between">
                    <span className="text-muted/60">微信昵称</span>
                    <span>{profile.wechatName}</span>
                  </div>
                )}
                {profile.wechatAccount && (
                  <div className="flex justify-between">
                    <span className="text-muted/60">微信账号</span>
                    <span>{profile.wechatAccount}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted/50 italic">
                {isOwner ? "在设置中填写群身份信息" : "暂无群身份信息"}
              </p>
            )}
            {isOwner && (
              <Link
                href="/settings"
                className="mt-2 block text-center text-[11px] tracking-wider text-gold hover:text-gold-light transition-colors"
              >
                编辑群身份 →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
