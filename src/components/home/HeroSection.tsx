"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCompass, FiUpload, FiArrowUpRight } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

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
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
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

  return isDark ? (
    <DarkHero
      stats={stats}
      totalLikesFavorites={totalLikesFavorites}
      sloganIndex={sloganIndex}
      sloganVisible={visible}
      onBrowse={() => router.push("/works/top")}
    />
  ) : (
    <LightHero
      stats={stats}
      totalLikesFavorites={totalLikesFavorites}
      sloganIndex={sloganIndex}
      sloganVisible={visible}
      onBrowse={() => router.push("/works/top")}
    />
  );
}

/* ==================================================================
   DARK HERO — 保留原版不变
   ================================================================== */

function DarkHero({
  stats,
  totalLikesFavorites,
  sloganIndex,
  sloganVisible,
  onBrowse,
}: HeroContentProps) {
  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-hero lg:min-h-[70vh]">
      {/* Gold grid lines */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(rgba(215,170,69,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(215,170,69,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundColor: "#0e0c08",
        }}
      />

      {/* Noise / grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "512px 512px",
        }}
      />

      {/* Large logo mark — left side */}
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

      {/* Vertical divider */}
      <div className="pointer-events-none absolute right-[280px] top-[15%] z-0 hidden h-[70%] w-px bg-gradient-to-b from-transparent via-gold/8 to-transparent lg:block" />

      {/* Decorative arcs */}
      <svg
        className="pointer-events-none absolute right-0 top-0 h-full w-[60%] max-w-[700px] opacity-15"
        viewBox="0 0 700 700"
        fill="none"
        preserveAspectRatio="xMaxYMin meet"
      >
        <path d="M 680 50 C 680 420, 480 670, 50 670" stroke="#D7AA45" strokeWidth="0.5" />
        <path d="M 620 100 C 620 380, 420 580, 100 580" stroke="#D7AA45" strokeWidth="0.35" />
        <path d="M 550 160 C 550 320, 360 480, 160 480" stroke="#D7AA45" strokeWidth="0.25" />
        <path d="M 680 300 C 680 520, 520 620, 300 620" stroke="#D7AA45" strokeWidth="0.3" />
        <circle cx="520" cy="240" r="1.8" fill="#D7AA45" fillOpacity="0.35" />
        <circle cx="380" cy="420" r="1.3" fill="#D7AA45" fillOpacity="0.25" />
        <circle cx="300" cy="360" r="0.8" fill="#D7AA45" fillOpacity="0.15" />
        <circle cx="480" cy="480" r="1" fill="#D7AA45" fillOpacity="0.2" />
      </svg>

      {/* Giant X watermark */}
      <div className="pointer-events-none absolute bottom-0 right-[8%] select-none">
        <span className="font-serif text-[min(45vw,380px)] font-bold tracking-tighter text-white/[0.025]">X</span>
      </div>

      {/* Framed info panel area */}
      <div className="pointer-events-none absolute bottom-[10%] right-[2%] h-52 w-[280px] border border-gold/12 rounded-sm md:bottom-[12%] md:right-[1.5%]" />
      <div className="pointer-events-none absolute bottom-[13%] right-[3.2%] h-[168px] w-[252px] border border-gold/[0.07] rounded-sm md:bottom-[15%]" />
      <div className="pointer-events-none absolute bottom-[7%] right-[1%] h-px w-12 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="pointer-events-none absolute bottom-[5%] right-[0.5%] h-8 w-px bg-gradient-to-b from-gold/20 to-transparent" />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex h-[60vh] max-w-[1180px] items-stretch px-4 lg:h-[70vh]">
        {/* Left column */}
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
              FOREST
            </span>
          </div>
        </div>

        {/* Center */}
        <div className="flex flex-1 flex-col justify-center pt-14 md:pr-6 lg:pt-10">
          <p className="mb-3 font-serif text-[10px] tracking-[0.45em] text-gold md:mb-4 md:text-xs">
            INDEPENDENT WORKS ARCHIVE
          </p>
          <h1 className="font-cinzel text-[clamp(2rem,6.5vw,6.5rem)] font-bold leading-[0.9] tracking-[0.02em] text-white">
            XIANXING
          </h1>
          <h2 className="mt-2 font-sans text-[clamp(2rem,6.5vw,6.5rem)] font-black leading-[0.9] tracking-[0.08em] text-gold md:mt-3">
            先行
          </h2>
          <p
            className="mt-4 max-w-md text-xs leading-relaxed tracking-wider text-white/45 transition-opacity duration-500 md:mt-5 md:text-sm"
            style={{ opacity: sloganVisible ? 1 : 0 }}
          >
            {slogans[sloganIndex]}
          </p>
          <div className="mt-5 flex flex-wrap gap-3 md:mt-6">
            <button onClick={onBrowse} className="group relative inline-flex items-center gap-2 overflow-hidden rounded border border-gold/50 px-5 py-2.5 text-xs font-semibold tracking-wider text-gold transition-all duration-300 hover:border-gold md:px-6 md:py-3 md:text-sm">
              <span className="absolute inset-0 -translate-x-full rounded transition-transform duration-300 group-hover:translate-x-0 bg-gold" />
              <span className="relative z-10 inline-flex items-center gap-2 transition-colors duration-300 group-hover:text-[#080807]">
                全部作品
                <FiCompass className="inline-block text-sm leading-none transition-transform duration-300 group-hover:translate-x-1 md:text-base" />
              </span>
            </button>
            <Link href="/upload" className="group relative inline-flex items-center gap-2 overflow-hidden rounded border-2 border-white/45 px-5 py-[9px] text-xs font-semibold tracking-wider text-white transition-all duration-300 hover:border-white md:px-6 md:py-[11px] md:text-sm">
              <span className="absolute inset-0 -translate-x-full rounded transition-transform duration-300 group-hover:translate-x-0 bg-white" />
              <span className="relative z-10 inline-flex items-center gap-2 transition-colors duration-300 group-hover:text-[#080807]">
                提交作品
                <FiUpload className="inline-block text-sm leading-none transition-transform duration-300 group-hover:translate-x-1 md:text-base" />
              </span>
            </Link>
          </div>
        </div>

        {/* Right panel */}
        <div className="hidden w-[260px] flex-shrink-0 flex-col justify-end pb-16 lg:flex">
          <p className="text-sm font-light tracking-wider text-white/60">独立思考</p>
          <p className="mt-0.5 text-sm font-light tracking-wider text-white/60">创造未来</p>
          <div className="my-4 h-px bg-gradient-to-r from-gold/20 via-gold/8 to-transparent" />
          <div className="grid grid-cols-3 gap-4">
            <DarkStatItem value={stats ? formatNumber(stats.totalWorks) : "—"} label="作品总数" />
            <DarkStatItem value={stats ? formatNumber(stats.totalUsers) : "—"} label="创作者" />
            <DarkStatItem value={stats ? formatNumber(totalLikesFavorites) : "—"} label="点赞收藏" />
          </div>
          <p className="mt-4 text-center font-serif text-[8px] tracking-[0.35em] text-white/15">
            CURATE · DISCOVER · INSPIRE
          </p>
          <div className="mt-5 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function DarkStatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-base font-semibold text-gold md:text-lg">{value}</p>
      <p className="text-[9px] tracking-wider text-white/35 md:text-[10px]">{label}</p>
    </div>
  );
}

/* ==================================================================
   LIGHT HERO — 独立设计，不是暗色版换色
   ================================================================== */

function LightHero({
  stats,
  totalLikesFavorites,
  sloganIndex,
  sloganVisible,
  onBrowse,
}: HeroContentProps) {
  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-[#f2ede4] lg:min-h-[70vh]">
      {/* ===== Small brand emblem — left watermark, very faint ===== */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block select-none"
        style={{
          width: "clamp(180px, 18vw, 280px)",
          height: "clamp(180px, 18vw, 280px)",
          marginLeft: "clamp(-20px, -0.5vw, 0px)",
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
            backgroundColor: "rgba(215,170,69,0.06)",
          }}
        />
      </div>

      {/* ===== Decorative arcs — very subtle ===== */}
      <svg
        className="pointer-events-none absolute right-0 top-0 h-full w-[60%] max-w-[700px] opacity-[0.05]"
        viewBox="0 0 700 700"
        fill="none"
        preserveAspectRatio="xMaxYMin meet"
      >
        <path d="M 680 50 C 680 420, 480 670, 50 670" stroke="#8B7D6B" strokeWidth="0.4" />
        <path d="M 620 100 C 620 380, 420 580, 100 580" stroke="#8B7D6B" strokeWidth="0.25" />
        <circle cx="520" cy="240" r="1.5" fill="#8B7D6B" fillOpacity="0.2" />
        <circle cx="380" cy="420" r="1" fill="#8B7D6B" fillOpacity="0.15" />
      </svg>

      {/* ===== Subtle bottom line ===== */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      {/* ===== Main content ===== */}
      <div className="relative z-10 mx-auto flex h-[60vh] max-w-[1180px] items-stretch px-4 lg:h-[70vh]">
        {/* ——— Left column ——— */}
        <div className="hidden w-14 flex-shrink-0 flex-col items-center pt-20 lg:flex">
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <div className="h-16 w-px bg-gradient-to-b from-gold/20 to-transparent" />
            <span className="py-2 text-[7px] tracking-[0.35em] text-black/20 [writing-mode:vertical-rl]">
              INDEPENDENT WORKS ARCHIVE
            </span>
            <div className="h-10 w-px bg-gradient-to-b from-transparent to-gold/15" />
          </div>
          <div className="pb-10 flex flex-col items-center gap-2">
            <div className="h-8 w-px bg-gradient-to-b from-transparent to-gold/15" />
            <span className="font-cinzel text-[9px] tracking-[0.35em] text-gold/30 [writing-mode:vertical-rl]">
              FOREST
            </span>
          </div>
        </div>

        {/* ——— Center: brand ——— */}
        <div className="flex flex-1 flex-col justify-center pt-14 lg:pt-10">
          {/* Eyebrow */}
          <p className="mb-3 font-serif text-[10px] tracking-[0.45em] text-gold md:mb-4 md:text-xs">
            INDEPENDENT WORKS ARCHIVE
          </p>

          {/* XIANXING — dark tone on light bg */}
          <h1 className="font-cinzel text-[clamp(2rem,6.5vw,6.5rem)] font-bold leading-[0.9] tracking-[0.02em] text-[#1a1a1a]">
            XIANXING
          </h1>

          {/* 先行 — gold accent */}
          <h2 className="mt-2 font-sans text-[clamp(2rem,6.5vw,6.5rem)] font-black leading-[0.9] tracking-[0.08em] text-gold md:mt-3">
            先行
          </h2>

          {/* Slogan carousel */}
          <p
            className="mt-4 max-w-md text-xs leading-relaxed tracking-wider text-black/40 transition-opacity duration-500 md:mt-5 md:text-sm"
            style={{ opacity: sloganVisible ? 1 : 0 }}
          >
            {slogans[sloganIndex]}
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap gap-3 md:mt-7">
            <button
              onClick={onBrowse}
              className="group inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-xs font-semibold tracking-wider text-[#1a1a1a] transition-all duration-300 hover:bg-gold-light md:px-6 md:py-3 md:text-sm"
            >
              全部作品
              <FiArrowUpRight className="inline-block text-sm leading-none transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:text-base" />
            </button>
            <Link
              href="/upload"
              className="group inline-flex items-center gap-2 rounded-lg border border-[#1a1a1a]/25 px-5 py-2.5 text-xs font-semibold tracking-wider text-[#1a1a1a] transition-all duration-300 hover:border-[#1a1a1a]/50 hover:bg-white/40 md:px-6 md:py-3 md:text-sm"
            >
              提交作品
              <FiUpload className="inline-block text-sm leading-none transition-transform duration-300 group-hover:translate-x-0.5 md:text-base" />
            </Link>
          </div>
        </div>

        {/* ——— Right: inline stats, no card, no split ——— */}
        <div className="hidden w-[200px] flex-shrink-0 flex-col justify-center pb-12 lg:flex">
          <p className="text-sm font-medium tracking-wider text-[#1a1a1a]/60">独立思考</p>
          <p className="mt-0.5 text-sm font-medium tracking-wider text-[#1a1a1a]/60">创造未来</p>

          <div className="my-4 h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />

          <div className="grid grid-cols-3 gap-4">
            <LightStatItem value={stats ? formatNumber(stats.totalWorks) : "—"} label="作品总数" />
            <LightStatItem value={stats ? formatNumber(stats.totalUsers) : "—"} label="创作者" />
            <LightStatItem value={stats ? formatNumber(totalLikesFavorites) : "—"} label="点赞收藏" />
          </div>

          <p className="mt-4 text-center font-serif text-[8px] tracking-[0.35em] text-black/20">
            CURATE · DISCOVER · INSPIRE
          </p>
        </div>
      </div>
    </section>
  );
}

function LightStatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-base font-semibold text-gold md:text-lg">{value}</p>
      <p className="text-[9px] tracking-wider text-black/35 md:text-[10px]">{label}</p>
    </div>
  );
}

/* ─── Shared types ─── */

interface HeroContentProps {
  stats: Stats | null;
  totalLikesFavorites: number;
  sloganIndex: number;
  sloganVisible: boolean;
  onBrowse: () => void;
}
