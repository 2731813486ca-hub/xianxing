"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { ArchiveItem } from "@/types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BackButton } from "@/components/ui/BackButton";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  FiExternalLink,
  FiDownload,
  FiFileText,
  FiCalendar,
  FiTag,
  FiBookOpen,
} from "react-icons/fi";

export default function ArchiveDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [archive, setArchive] = useState<ArchiveItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [attachment, setAttachment] = useState<{
    url: string | null;
    attachmentType: string | null;
    originalFileName: string | null;
    rawText: string | null;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/archives/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setArchive(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!archive) return;
    if (archive.attachmentUrl || archive.rawText) {
      fetch(`/api/archives/${id}/attachment`)
        .then((r) => r.json())
        .then(setAttachment)
        .catch(() => {});
    }
  }, [archive, id]);

  if (loading) return <LoadingSpinner />;

  if (!archive) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-foreground">档案不存在</h2>
        <Link href="/forest-zone" className="mt-4 inline-block text-gold hover:underline">
          返回树林专区
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <BackButton />

      <article className="mt-6">
        {/* Header */}
        <ScrollReveal>
          <header className="mb-10 border-b border-border pb-8">
            <h1 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {archive.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
              {archive.sourceName && (
                <span className="flex items-center gap-1.5">
                  <FiTag size={12} />
                  {archive.sourceName}
                </span>
              )}
              {archive.sourceDate && (
                <span className="flex items-center gap-1.5">
                  <FiCalendar size={12} />
                  {archive.sourceDate}
                </span>
              )}
              {archive.sourceUrl && (
                <a
                  href={archive.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gold transition-colors hover:text-gold-light"
                >
                  <FiExternalLink size={12} />
                  原文链接
                </a>
              )}
            </div>
          </header>
        </ScrollReveal>

        {/* Summary */}
        {archive.summary && (
          <ScrollReveal delay={60}>
            <div className="mb-8 rounded-lg border border-gold/10 bg-gold/[0.02] p-5">
              <p className="text-base leading-relaxed text-foreground/80">
                {archive.summary}
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Points */}
        {archive.points.length > 0 && (
          <ScrollReveal delay={100}>
            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
                <FiBookOpen size={18} className="text-gold" />
                核心要点
              </h2>
              <ul className="space-y-3">
                {archive.points.map((point, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/75">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-[10px] font-bold text-gold">
                      {i + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </section>
          </ScrollReveal>
        )}

        {/* Abstract / Body */}
        {archive.abstract && (
          <ScrollReveal delay={140}>
            <section className="mb-8">
              <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
                正文
              </h2>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/75">
                {archive.abstract}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Keywords */}
        {archive.keywords.length > 0 && (
          <ScrollReveal delay={180}>
            <section className="mb-8">
              <h2 className="mb-3 font-serif text-lg font-semibold text-foreground">
                关键词
              </h2>
              <div className="flex flex-wrap gap-2">
                {archive.keywords.map((kw) => (
                  <Link
                    key={kw}
                    href={`/forest-zone?keyword=${encodeURIComponent(kw)}`}
                    className="rounded-full border border-gold/20 bg-gold/[0.03] px-3 py-1 text-xs text-gold/80 transition-colors hover:bg-gold/10"
                  >
                    {kw}
                  </Link>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Attachment / Raw Text */}
        {(archive.attachmentUrl || archive.rawText) && (
          <ScrollReveal delay={220}>
            <section className="mt-10 border-t border-border pt-8">
              <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
                原文阅读
              </h2>
              <div className="flex flex-wrap gap-3">
                {archive.attachmentUrl && (
                  <a
                    href={archive.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gold/25 px-4 py-2.5 text-sm text-gold transition-all hover:bg-gold/10 hover:border-gold/40"
                  >
                    <FiDownload size={16} />
                    下载
                    {archive.attachmentType === "pdf" ? "PDF" : "Word"}
                    {archive.originalFileName ? ` (${archive.originalFileName})` : ""}
                  </a>
                )}
                {archive.rawText && (
                  <button
                    onClick={() => {
                      const w = window.open("", "_blank");
                      if (w) {
                        w.document.write(
                          `<pre style="max-width:800px;margin:2rem auto;padding:2rem;font-family:serif;font-size:16px;line-height:1.8;white-space:pre-wrap">${archive.rawText}</pre>`
                        );
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-foreground transition-all hover:border-gold/30"
                  >
                    <FiFileText size={16} />
                    在线阅读
                  </button>
                )}
              </div>
            </section>
          </ScrollReveal>
        )}
      </article>
    </div>
  );
}
