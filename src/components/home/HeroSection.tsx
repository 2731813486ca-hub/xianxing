"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
} from "react-icons/fi";

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
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState<Stats | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-[#0A0A0A] lg:min-h-[90vh]">
      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Decorative arcs */}
      <svg
        className="pointer-events-none absolute -right-24 -top-24 h-[600px] w-[600px] opacity-[0.04] lg:h-[700px] lg:w-[700px]"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 580 80 C 580 300, 380 500, 80 500"
          stroke="#d4a843"
          strokeWidth="0.4"
        />
        <path
          d="M 520 120 C 520 310, 340 480, 120 480"
          stroke="#d4a843"
          strokeWidth="0.3"
        />
        <path
          d="M 460 160 C 460 320, 300 460, 160 460"
          stroke="#d4a843"
          strokeWidth="0.2"
        />
        <circle cx="420" cy="180" r="2" fill="#d4a843" fillOpacity="0.3" />
        <circle cx="320" cy="380" r="1.5" fill="#d4a843" fillOpacity="0.2" />
        <circle cx="180" cy="380" r="1" fill="#d4a843" fillOpacity="0.15" />
      </svg>

      {/* Second arc bottom-left */}
      <svg
        className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] opacity-[0.03]"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 50 450 C 50 250, 200 80, 450 50"
          stroke="#d4a843"
          strokeWidth="0.3"
        />
        <path
          d="M 100 400 C 100 230, 230 130, 400 100"
          stroke="#d4a843"
          strokeWidth="0.2"
        />
      </svg>

      {/* Watermark X */}
      <div className="pointer-events-none absolute right-[12%] top-1/2 -translate-y-1/2 select-none">
        <span className="font-serif text-[min(35vw,300px)] font-bold tracking-tighter text-white/[0.03]">
          X
        </span>
      </div>

      {/* Vertical text — desktop only */}
      <div className="pointer-events-none absolute bottom-28 right-10 hidden select-none lg:block">
        <span className="text-[10px] font-light tracking-[0.5em] text-white/[0.07] [writing-mode:vertical-rl]">
          INDEPENDENT WORKS ARCHIVE
        </span>
      </div>

      {/* ===== Floating Navigation ===== */}
      <nav className="relative z-20 mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute h-2.5 w-2.5 rounded-full bg-gold" />
          </span>
          <span className="font-serif text-lg font-bold tracking-[0.15em] text-white/90">
            先行
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink href="/" label="发现" />
          <NavLink href="/works/top" label="热门" />
          {!loading && user ? (
            <>
              <NavLink href="/upload" label="上传" />
              <NavLink href="/profile/me" label={user.name} />
              <button
                onClick={logout}
                className="text-sm tracking-wider text-white/50 transition-colors hover:text-gold"
              >
                退出
              </button>
            </>
          ) : !loading ? (
            <Link
              href="/login"
              className="rounded-lg border border-gold/30 px-5 py-2 text-sm tracking-wider text-gold transition-all hover:border-gold/60 hover:bg-gold/10"
            >
              登录
            </Link>
          ) : null}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="text-white/40 transition-colors hover:text-gold"
              aria-label={theme === "dark" ? "亮色模式" : "暗色模式"}
            >
              {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white/60 md:hidden"
          aria-label="菜单"
        >
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="relative z-20 border-t border-white/10 bg-[#0A0A0A]/95 px-4 py-5 backdrop-blur-lg md:hidden">
          <div className="flex flex-col gap-4">
            <MobileNavLink
              href="/"
              label="发现"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/works/top"
              label="热门"
              onClick={() => setMobileMenuOpen(false)}
            />
            {!loading && user ? (
              <>
                <MobileNavLink
                  href="/upload"
                  label="上传"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <MobileNavLink
                  href="/profile/me"
                  label={user.name}
                  onClick={() => setMobileMenuOpen(false)}
                />
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm text-white/50"
                >
                  退出
                </button>
              </>
            ) : !loading ? (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-gold"
              >
                登录
              </Link>
            ) : null}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-sm text-white/50"
              >
                {theme === "dark" ? (
                  <>
                    <FiSun size={14} /> 亮色
                  </>
                ) : (
                  <>
                    <FiMoon size={14} /> 暗色
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===== Hero Content ===== */}
      <div className="relative z-10 mx-auto flex min-h-[calc(85vh-5rem)] max-w-6xl items-center px-4 pb-20 pt-8 lg:min-h-[calc(90vh-5rem)]">
        <div className="flex w-full flex-col gap-16 lg:flex-row lg:items-center lg:justify-between">
          {/* ——— Left: Brand ——— */}
          <div className="max-w-2xl">
            <h1 className="font-serif text-[clamp(2.8rem,10vw,8rem)] font-bold leading-none tracking-tight text-white">
              XIANXING
            </h1>
            <div className="mt-5 flex items-center gap-4">
              <span className="h-px w-10 bg-gold/60" />
              <span className="font-serif text-[clamp(1.5rem,3vw,3rem)] font-semibold tracking-[0.08em] text-gold">
                先行
              </span>
              <span className="h-px w-10 bg-gold/60" />
            </div>
            <p className="mt-6 max-w-lg text-sm leading-relaxed tracking-wider text-white/45 md:text-base">
              发现独立开发者正在创造的产品、工具与实验项目
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#works"
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-7 py-3 text-sm font-semibold tracking-wider text-[#0A0A0A] transition-all hover:bg-gold-light"
              >
                发现作品
                <span className="text-base leading-none">→</span>
              </a>
              {user && (
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-7 py-3 text-sm tracking-wider text-white/60 transition-all hover:border-white/30 hover:text-white"
                >
                  提交作品
                </Link>
              )}
            </div>
          </div>

          {/* ——— Right: Stats Panel ——— */}
          <div className="hidden flex-shrink-0 lg:block">
            <div className="border border-gold/20 bg-white/[0.02] p-8 backdrop-blur-sm">
              <div className="space-y-5">
                <StatItem
                  label="作品总数"
                  value={stats ? formatNumber(stats.totalWorks) : "—"}
                />
                <div className="h-px bg-gradient-to-r from-gold/20 to-transparent" />
                <StatItem
                  label="创作者"
                  value={stats ? formatNumber(stats.totalUsers) : "—"}
                />
                <div className="h-px bg-gradient-to-r from-gold/20 to-transparent" />
                <StatItem
                  label="累计点赞"
                  value={stats ? formatNumber(stats.totalLikes) : "—"}
                />
                <div className="h-px bg-gradient-to-r from-gold/20 to-transparent" />
                <StatItem
                  label="收藏次数"
                  value={stats ? formatNumber(stats.totalFavorites) : "—"}
                />
              </div>
              <div className="mt-6 border-t border-gold/10 pt-5">
                <p className="text-center text-[10px] tracking-[0.35em] text-white/[0.15]">
                  CURATED COLLECTION
                </p>
              </div>
            </div>
          </div>

          {/* Mobile mini-stats */}
          <div className="flex flex-wrap gap-6 lg:hidden">
            <MiniStat label="作品" value={stats ? formatNumber(stats.totalWorks) : "—"} />
            <MiniStat label="创作者" value={stats ? formatNumber(stats.totalUsers) : "—"} />
            <MiniStat label="点赞" value={stats ? formatNumber(stats.totalLikes) : "—"} />
          </div>
        </div>
      </div>

      {/* Fade transition to works section */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, var(--color-background))" }}
      />
    </section>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm tracking-wider text-white/50 transition-colors hover:text-gold"
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-sm text-white/50 transition-colors hover:text-gold"
    >
      {label}
    </Link>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-12">
      <span className="text-xs tracking-widest text-white/35">{label}</span>
      <span className="font-serif text-2xl font-bold text-gold">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-serif text-lg font-bold text-gold">{value}</span>
      <span className="text-xs tracking-wider text-white/35">{label}</span>
    </div>
  );
}
