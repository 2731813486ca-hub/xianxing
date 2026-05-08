"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { SUPER_ADMIN_EMAIL } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toaster";
import type { ArchiveItem, PaginatedResponse } from "@/types";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiEye,
  FiEyeOff,
  FiX,
} from "react-icons/fi";

const POINT_PLACEHOLDER = "输入要点后按回车添加";
const KEYWORD_PLACEHOLDER = "输入关键词后按回车添加";

export default function AdminArchivesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ArchiveItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [abstract, setAbstract] = useState("");
  const [points, setPoints] = useState<string[]>([]);
  const [pointInput, setPointInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceDate, setSourceDate] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentType, setAttachmentType] = useState<"" | "pdf" | "word">("");
  const [originalFileName, setOriginalFileName] = useState("");
  const [rawText, setRawText] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "hidden">("published");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.email !== SUPER_ADMIN_EMAIL)) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  const fetchArchives = useCallback(() => {
    fetch("/api/archives?pageSize=50")
      .then((r) => r.json())
      .then((data: PaginatedResponse<ArchiveItem>) => {
        setArchives(data.items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user?.email === SUPER_ADMIN_EMAIL) fetchArchives();
  }, [user, fetchArchives]);

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setAbstract("");
    setPoints([]);
    setPointInput("");
    setKeywords([]);
    setKeywordInput("");
    setSourceName("");
    setSourceUrl("");
    setSourceDate("");
    setAttachmentUrl("");
    setAttachmentType("");
    setOriginalFileName("");
    setRawText("");
    setStatus("published");
    setEditing(null);
  };

  const openEdit = (archive: ArchiveItem) => {
    setEditing(archive);
    setTitle(archive.title);
    setSummary(archive.summary);
    setAbstract(archive.abstract);
    setPoints([...archive.points]);
    setKeywords([...archive.keywords]);
    setSourceName(archive.sourceName);
    setSourceUrl(archive.sourceUrl);
    setSourceDate(archive.sourceDate);
    setAttachmentUrl(archive.attachmentUrl);
    setAttachmentType(archive.attachmentType as "" | "pdf" | "word");
    setOriginalFileName(archive.originalFileName);
    setRawText(archive.rawText);
    setStatus(archive.status as "draft" | "published" | "hidden");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast("请输入标题", "error");
      return;
    }
    setSaving(true);
    const body = {
      title: title.trim(),
      summary,
      abstract,
      points: points.filter(Boolean),
      keywords: keywords.filter(Boolean),
      sourceName,
      sourceUrl,
      sourceDate,
      attachmentUrl,
      attachmentType,
      originalFileName,
      rawText,
      status,
    };
    try {
      const url = editing
        ? `/api/admin/archives/${editing.id}`
        : "/api/admin/archives";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast(editing ? "已更新" : "已创建", "success");
        resetForm();
        setShowForm(false);
        fetchArchives();
      } else {
        const data = await res.json();
        toast(data.error || "保存失败", "error");
      }
    } catch {
      toast("网络错误", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个档案吗？")) return;
    try {
      const res = await fetch(`/api/admin/archives/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("已删除", "success");
        setArchives((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      toast("删除失败", "error");
    }
  };

  const addItem = (input: string, setter: (fn: (prev: string[]) => string[]) => void, field: string[]) => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (field.includes(trimmed)) return;
    setter((prev) => [...prev, trimmed]);
  };

  const removeItem = (index: number, setter: (fn: (prev: string[]) => string[]) => void) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  if (authLoading) return <LoadingSpinner />;
  if (!user || user.email !== SUPER_ADMIN_EMAIL) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <ScrollReveal>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">档案管理</h1>
            <p className="mt-1 text-sm text-muted">管理树林专区的观点档案</p>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <FiPlus size={16} />
            新建档案
          </Button>
        </div>
      </ScrollReveal>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); resetForm(); }} />
          <div className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="mb-6 font-serif text-xl font-bold text-foreground">
              {editing ? "编辑档案" : "新建档案"}
            </h2>

            <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
              <Input label="标题 *" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="观点标题" />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">摘要</label>
                <textarea
                  className="input-field min-h-[60px] w-full rounded-lg px-4 py-2.5 text-sm"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="简短的摘要"
                  maxLength={500}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">正文</label>
                <textarea
                  className="input-field min-h-[120px] w-full rounded-lg px-4 py-2.5 text-sm"
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="详细正文内容"
                  maxLength={5000}
                />
              </div>

              {/* Points */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">核心要点</label>
                <div className="flex gap-2">
                  <input
                    className="input-field flex-1 rounded-lg px-4 py-2.5 text-sm"
                    value={pointInput}
                    onChange={(e) => setPointInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem(pointInput, setPoints as any, points);
                        setPointInput("");
                      }
                    }}
                    placeholder={POINT_PLACEHOLDER}
                  />
                </div>
                {points.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {points.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 text-[10px] text-gold">{i + 1}</span>
                        <span className="flex-1">{p}</span>
                        <button onClick={() => removeItem(i, setPoints as any)} className="text-muted hover:text-red-400"><FiX size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Keywords */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">关键词</label>
                <div className="flex gap-2">
                  <input
                    className="input-field flex-1 rounded-lg px-4 py-2.5 text-sm"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem(keywordInput, setKeywords as any, keywords);
                        setKeywordInput("");
                      }
                    }}
                    placeholder={KEYWORD_PLACEHOLDER}
                  />
                </div>
                {keywords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {keywords.map((k, i) => (
                      <span key={i} className="inline-flex items-center gap-1 rounded-full border border-gold/15 bg-gold/[0.03] px-2.5 py-1 text-xs text-gold/80">
                        {k}
                        <button onClick={() => removeItem(i, setKeywords as any)} className="hover:text-red-400"><FiX size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Source */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input label="来源" value={sourceName} onChange={(e) => setSourceName(e.target.value)} placeholder="来源名称" />
                <Input label="来源链接" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://..." />
                <Input label="来源日期" value={sourceDate} onChange={(e) => setSourceDate(e.target.value)} placeholder="2026-01-01" />
              </div>

              {/* Attachment */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="附件链接" value={attachmentUrl} onChange={(e) => setAttachmentUrl(e.target.value)} placeholder="附件下载链接" />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">附件类型</label>
                  <select
                    className="input-field w-full rounded-lg px-4 py-2.5 text-sm"
                    value={attachmentType}
                    onChange={(e) => setAttachmentType(e.target.value as "" | "pdf" | "word")}
                  >
                    <option value="">无附件</option>
                    <option value="pdf">PDF</option>
                    <option value="word">Word</option>
                  </select>
                </div>
              </div>
              {attachmentType && (
                <Input label="原文件名" value={originalFileName} onChange={(e) => setOriginalFileName(e.target.value)} placeholder="example.pdf" />
              )}

              {/* Raw Text */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">原文全文 (rawText)</label>
                <textarea
                  className="input-field min-h-[100px] w-full rounded-lg px-4 py-2.5 text-sm"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="文章纯文本内容，用于在线阅读模式"
                  maxLength={50000}
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">状态</label>
                <select
                  className="input-field w-full rounded-lg px-4 py-2.5 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published" | "hidden")}
                >
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                  <option value="hidden">隐藏</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button onClick={handleSave} loading={saving}>{editing ? "保存修改" : "创建档案"}</Button>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="text-sm text-muted hover:text-foreground transition-colors">
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive List */}
      {loading ? (
        <LoadingSpinner />
      ) : archives.length === 0 ? (
        <EmptyState icon={<FiFileText size={40} />} title="暂无档案" description="点击右上角新建档案" />
      ) : (
        <div className="space-y-3">
          {archives.map((a, i) => (
            <ScrollReveal key={a.id} delay={i * 50}>
              <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 interactive-card">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{a.title}</h3>
                  {a.status !== "published" && (
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${
                      a.status === "draft" ? "bg-yellow-500/10 text-yellow-500" : "bg-muted/10 text-muted"
                    }`}>
                      {a.status === "draft" ? "草稿" : "隐藏"}
                    </span>
                  )}
                </div>
                {a.summary && <p className="mt-1 truncate text-sm text-muted">{a.summary}</p>}
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted/60">
                  {a.sourceName && <span>{a.sourceName}</span>}
                  <span>{new Date(a.createdAt).toLocaleDateString("zh-CN")}</span>
                  {a.keywords.length > 0 && <span>{a.keywords.length} 个关键词</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(a)} className="rounded-lg p-2 text-muted transition-colors hover:text-gold" title="编辑">
                  <FiEdit2 size={16} />
                </button>
                <button onClick={() => handleDelete(a.id)} className="rounded-lg p-2 text-muted transition-colors hover:text-red-400" title="删除">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
