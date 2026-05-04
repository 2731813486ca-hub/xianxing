"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  totalWorks: number;
  totalUsers: number;
  totalLikes: number;
  totalFavorites: number;
}

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, "") + "w";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export function HeroSection() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const totalLikesFavorites =
    (stats?.totalLikes ?? 0) + (stats?.totalFavorites ?? 0);

  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-hero lg:min-h-[70vh]">
      {/* ===== Multi-layer glow ===== */}
      {/* Layer 1: center-left warm focus behind XIANXING title */}
      {/* Layer 2: right panel vertical soft light */}
      {/* Layer 3: large ambient fill — very subtle */}
      {/* Bottom: gold grid lines — subdued */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 30% 42%, rgba(183,146,46,0.20) 0%, rgba(183,146,46,0.06) 25%, transparent 50%)," +
            "radial-gradient(ellipse 200px 500px at 82% 40%, rgba(215,170,69,0.10) 0%, transparent 50%)," +
            "radial-gradient(ellipse 1000px 600px at 50% 55%, rgba(215,170,69,0.04) 0%, transparent 50%)," +
            "linear-gradient(rgba(215,170,69,0.10) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(215,170,69,0.10) 1px, transparent 1px)",
          backgroundSize: "auto, auto, auto, 80px 80px, 80px 80px",
          backgroundColor: "#0e0c08",
        }}
      />

      {/* Vertical divider between center content and right panel */}
      <div className="pointer-events-none absolute right-[280px] top-[15%] z-0 hidden h-[70%] w-px bg-gradient-to-b from-transparent via-gold/8 to-transparent lg:block" />

      {/* Decorative arcs — top-right */}
      <svg
        className="pointer-events-none absolute -right-10 -top-10 h-[420px] w-[420px] opacity-10 md:h-[520px] md:w-[520px]"
        viewBox="0 0 520 520"
        fill="none"
      >
        <path
          d="M 500 80 C 500 310, 320 500, 80 500"
          stroke="#D7AA45"
          strokeWidth="0.6"
        />
        <path
          d="M 440 120 C 440 310, 260 460, 120 460"
          stroke="#D7AA45"
          strokeWidth="0.4"
        />
        <path
          d="M 380 160 C 380 290, 220 400, 160 400"
          stroke="#D7AA45"
          strokeWidth="0.3"
        />
        <circle cx="360" cy="220" r="2" fill="#D7AA45" fillOpacity="0.4" />
        <circle cx="240" cy="360" r="1.5" fill="#D7AA45" fillOpacity="0.3" />
        <circle cx="200" cy="320" r="1" fill="#D7AA45" fillOpacity="0.2" />
      </svg>

      {/* Giant X watermark — bottom-right */}
      <div className="pointer-events-none absolute bottom-0 right-[8%] select-none">
        <span className="font-serif text-[min(45vw,380px)] font-bold tracking-tighter text-white/[0.025]">
          X
        </span>
      </div>

      {/* Decorative geo frame — right side */}
      <div className="pointer-events-none absolute bottom-[15%] right-[4%] h-40 w-32 border border-gold/10 md:bottom-[18%] md:right-[3%]" />
      <div className="pointer-events-none absolute bottom-[18%] right-[5%] h-24 w-20 border border-gold/[0.06] md:bottom-[21%]" />
      <div className="pointer-events-none absolute bottom-[45%] right-[2%] h-px w-16 bg-gradient-to-r from-gold/20 to-transparent" />

      {/* ===== Main content container ===== */}
      <div className="relative z-10 mx-auto flex h-[60vh] max-w-[1180px] items-stretch px-4 lg:h-[70vh]">
        {/* ——— Left: vertical info column ——— */}
        <div className="hidden w-14 flex-shrink-0 flex-col items-center pt-20 lg:flex">
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <div className="h-16 w-px bg-gradient-to-b from-gold/30 to-transparent" />
            <span className="py-2 text-[7px] tracking-[0.35em] text-white/25 [writing-mode:vertical-rl]">
              INDEPENDENT WORKS ARCHIVE
            </span>
            <div className="h-10 w-px bg-gradient-to-b from-transparent to-gold/20" />
          </div>
          <div className="pb-10">
            <span className="text-[11px] font-light tracking-wider text-white/40">
              01
            </span>
            <span className="mx-1 text-[8px] text-white/20">/</span>
            <span className="text-[11px] font-light tracking-wider text-white/20">
              10
            </span>
          </div>
        </div>

        {/* ——— Center: brand ——— */}
        <div className="flex flex-1 flex-col justify-center pt-14 md:pr-6 lg:pt-10">
          {/* Eyebrow */}
          <p className="mb-3 text-[10px] tracking-[0.45em] text-gold md:mb-4 md:text-xs">
            INDEPENDENT WORKS ARCHIVE
          </p>

          {/* XIANXING — exhibition-scale serif */}
          <h1 className="font-serif text-[clamp(2.5rem,8vw,8rem)] font-bold leading-[0.9] tracking-[-0.04em] text-white">
            XIANXING
          </h1>

          {/* 先行 — brand hammer */}
          <h2 className="mt-2 font-serif text-[clamp(2rem,5vw,4.25rem)] font-black leading-[1.1] tracking-[0.12em] text-gold md:mt-3">
            先行
          </h2>

          {/* Description */}
          <p className="mt-3 max-w-md text-xs leading-relaxed tracking-wider text-white/45 md:mt-4 md:text-sm">
            发现独立开发者正在创造的产品、工具与实验项目
          </p>

          {/* CTAs */}
          <div className="mt-5 flex flex-wrap gap-3 md:mt-6">
            <a
              href="#works"
              className="inline-flex items-center gap-2 rounded bg-gold px-5 py-2.5 text-xs font-semibold tracking-wider text-[#080807] transition-all hover:bg-gold-light md:px-6 md:py-3 md:text-sm"
            >
              发现作品
              <span className="text-sm leading-none md:text-base">→</span>
            </a>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded border border-white/15 px-5 py-2.5 text-xs tracking-wider text-white/60 transition-all hover:border-white/30 hover:text-white md:px-6 md:py-3 md:text-sm"
            >
              提交作品
            </Link>
          </div>
        </div>

        {/* ——— Right: info group embedded in background ——— */}
        <div className="hidden w-[260px] flex-shrink-0 flex-col justify-center lg:flex">
          {/* Motto — floating text */}
          <p className="text-sm font-light tracking-wider text-white/60">
            独立思考
          </p>
          <p className="mt-0.5 text-sm font-light tracking-wider text-white/60">
            创造未来
          </p>

          {/* Subtle divider */}
          <div className="my-4 h-px bg-gradient-to-r from-gold/20 via-gold/8 to-transparent" />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatItem
              value={stats ? formatNumber(stats.totalWorks) : "—"}
              label="作品总数"
            />
            <StatItem
              value={stats ? formatNumber(stats.totalUsers) : "—"}
              label="创作者"
            />
            <StatItem
              value={stats ? formatNumber(totalLikesFavorites) : "—"}
              label="点赞收藏"
            />
          </div>

          {/* Footer */}
          <p className="mt-4 text-center text-[8px] tracking-[0.35em] text-white/15">
            CURATE · DISCOVER · INSPIRE
          </p>

          {/* Embedded geo line frame */}
          <div className="mt-5 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        </div>
      </div>
    </section>
  );
}

/* ─── Sub-components ─── */

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-base font-semibold text-gold md:text-lg">
        {value}
      </p>
      <p className="text-[9px] tracking-wider text-white/35 md:text-[10px]">
        {label}
      </p>
    </div>
  );
}
