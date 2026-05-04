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

const slogans = [
  "让美好不止被想象，也被创造",
  "“献给以 AI 开路的创造者”",
  "让每一次创造，都成为未来的入口",
  "在想象抵达之前，先行创造",
  "每一个作品，都是未来的预告",
  "为创意的先行者留下坐标",
  "为尚未命名的未来，留下第一批作品",
  "创意先行，未来有迹",
  "先行者，创造未来",
];

export function HeroSection() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  // Slogan carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setSloganIndex((prev) => (prev + 1) % slogans.length);
        setVisible(true);
      }, 600);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const totalLikesFavorites =
    (stats?.totalLikes ?? 0) + (stats?.totalFavorites ?? 0);

  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-hero lg:min-h-[70vh]">
      {/* ===== Subtle gold grid lines ===== */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(rgba(215,170,69,0.08) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(215,170,69,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundColor: "#0e0c08",
        }}
      />

      {/* ===== Noise / grain texture ===== */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "512px 512px",
        }}
      />

      {/* ===== Large logo mark — left side (CSS luminance mask) ===== */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block select-none"
        style={{
          width: "clamp(200px, 22vw, 340px)",
          height: "clamp(200px, 22vw, 340px)",
          marginLeft: "clamp(-30px, -1vw, 0px)",
        }}
      >
        <div
          className="h-full w-full"
          style={{
            maskImage: "url(/logo-brand.png)",
            maskMode: "luminance",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskImage: "url(/logo-brand.png)",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            backgroundColor: "rgba(215,170,69,0.08)",
          }}
        />
      </div>

      {/* ===== Vertical divider between center and right panel ===== */}
      <div className="pointer-events-none absolute right-[280px] top-[15%] z-0 hidden h-[70%] w-px bg-gradient-to-b from-transparent via-gold/8 to-transparent lg:block" />

      {/* ===== Decorative arcs — top-right & right-center ===== */}
      <svg
        className="pointer-events-none absolute right-0 top-0 h-full w-[60%] max-w-[700px] opacity-15"
        viewBox="0 0 700 700"
        fill="none"
        preserveAspectRatio="xMaxYMin meet"
      >
        {/* Large outer arc — top right */}
        <path
          d="M 680 50 C 680 420, 480 670, 50 670"
          stroke="#D7AA45"
          strokeWidth="0.5"
        />
        {/* Medium arc */}
        <path
          d="M 620 100 C 620 380, 420 580, 100 580"
          stroke="#D7AA45"
          strokeWidth="0.35"
        />
        {/* Inner arc */}
        <path
          d="M 550 160 C 550 320, 360 480, 160 480"
          stroke="#D7AA45"
          strokeWidth="0.25"
        />
        {/* Right-center large arc */}
        <path
          d="M 680 300 C 680 520, 520 620, 300 620"
          stroke="#D7AA45"
          strokeWidth="0.3"
        />
        {/* Floating dots */}
        <circle cx="520" cy="240" r="1.8" fill="#D7AA45" fillOpacity="0.35" />
        <circle cx="380" cy="420" r="1.3" fill="#D7AA45" fillOpacity="0.25" />
        <circle cx="300" cy="360" r="0.8" fill="#D7AA45" fillOpacity="0.15" />
        <circle cx="480" cy="480" r="1" fill="#D7AA45" fillOpacity="0.2" />
      </svg>

      {/* ===== Giant X watermark — bottom-right ===== */}
      <div className="pointer-events-none absolute bottom-0 right-[8%] select-none">
        <span className="font-serif text-[min(45vw,380px)] font-bold tracking-tighter text-white/[0.025]">
          X
        </span>
      </div>

      {/* ===== Framed info panel area — bottom-right ===== */}
      <div className="pointer-events-none absolute bottom-[10%] right-[2%] h-52 w-[280px] border border-gold/12 rounded-sm md:bottom-[12%] md:right-[1.5%]" />
      <div className="pointer-events-none absolute bottom-[13%] right-[3.2%] h-[168px] w-[252px] border border-gold/[0.07] rounded-sm md:bottom-[15%]" />
      {/* Corner accent lines */}
      <div className="pointer-events-none absolute bottom-[7%] right-[1%] h-px w-12 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="pointer-events-none absolute bottom-[5%] right-[0.5%] h-8 w-px bg-gradient-to-b from-gold/20 to-transparent" />

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
          <div className="pb-10 flex flex-col items-center gap-2">
            <div className="h-8 w-px bg-gradient-to-b from-transparent to-gold/20" />
            <span className="font-cinzel text-[9px] tracking-[0.35em] text-gold/40 [writing-mode:vertical-rl]">
              SILVA
            </span>
          </div>
        </div>

        {/* ——— Center: brand ——— */}
        <div className="flex flex-1 flex-col justify-center pt-14 md:pr-6 lg:pt-10">
          {/* Eyebrow */}
          <p className="mb-3 font-serif text-[10px] tracking-[0.45em] text-gold md:mb-4 md:text-xs">
            INDEPENDENT WORKS ARCHIVE
          </p>

          {/* XIANXING — structured geometric font */}
          <h1 className="font-cinzel text-[clamp(2rem,6.5vw,6.5rem)] font-bold leading-[0.9] tracking-[0.02em] text-white">
            XIANXING
          </h1>

          {/* 先行 — same size as English, angular sans-serif */}
          <h2 className="mt-2 font-sans text-[clamp(2rem,6.5vw,6.5rem)] font-black leading-[0.9] tracking-[0.08em] text-gold md:mt-3">
            先行
          </h2>

          {/* Slogan carousel */}
          <p
            className="mt-4 max-w-md text-xs leading-relaxed tracking-wider text-white/45 transition-opacity duration-500 md:mt-5 md:text-sm"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {slogans[sloganIndex]}
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
        <div className="hidden w-[260px] flex-shrink-0 flex-col justify-end pb-16 lg:flex">
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
          <p className="mt-4 text-center font-serif text-[8px] tracking-[0.35em] text-white/15">
            CURATE · DISCOVER · INSPIRE
          </p>

          {/* Embedded geo line */}
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
