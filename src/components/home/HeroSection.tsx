"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  FiGrid,
  FiTrendingUp,
  FiUpload,
  FiUser,
  FiLogOut,
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
  const pathname = usePathname();
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

  const totalLikesFavorites =
    (stats?.totalLikes ?? 0) + (stats?.totalFavorites ?? 0);

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#080807] md:min-h-[600px] lg:min-h-[620px]">
      {/* ===== Background layers ===== */}
      {/* Gold radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 35% 45%, rgba(215,170,69,0.1) 0%, transparent 60%)",
        }}
      />

      {/* Subtle gold grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(215,170,69,0.12) 1px, transparent 1px),linear-gradient(90deg, rgba(215,170,69,0.12) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative arcs — top-right */}
      <svg
        className="pointer-events-none absolute -right-16 -top-16 h-[360px] w-[360px] opacity-[0.04] md:-right-20 md:-top-20 md:h-[420px] md:w-[420px]"
        viewBox="0 0 420 420"
        fill="none"
      >
        <path
          d="M 400 60 C 400 250, 260 400, 60 400"
          stroke="#D7AA45"
          strokeWidth="0.3"
        />
        <path
          d="M 350 80 C 350 220, 230 350, 80 350"
          stroke="#D7AA45"
          strokeWidth="0.2"
        />
        <circle cx="300" cy="140" r="1.5" fill="#D7AA45" fillOpacity="0.3" />
        <circle cx="180" cy="280" r="1" fill="#D7AA45" fillOpacity="0.2" />
      </svg>

      {/* Giant X watermark — bottom-right */}
      <div className="pointer-events-none absolute bottom-0 right-[8%] select-none">
        <span className="font-serif text-[min(45vw,380px)] font-bold tracking-tighter text-white/[0.015]">
          X
        </span>
      </div>

      {/* ===== Logo — top-left ===== */}
      <Link href="/" className="absolute left-6 top-6 z-20 md:left-8 md:top-8">
        <img src="/logo.png" alt="先行" className="h-7 w-7 md:h-8 md:w-8" />
      </Link>

      {/* ===== Navigation — top-right ===== */}
      <nav className="absolute right-4 top-4 z-20 md:right-6 md:top-6 lg:right-8 lg:top-8">
        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex lg:gap-5">
          <NavItem
            href="/"
            icon={<FiGrid size={14} />}
            label="发现"
            active={pathname === "/"}
          />
          <NavItem
            href="/works/top"
            icon={<FiTrendingUp size={14} />}
            label="热门"
            active={pathname === "/works/top"}
          />
          {!loading && user && (
            <NavItem
              href="/upload"
              icon={<FiUpload size={14} />}
              label="上传"
              active={pathname === "/upload"}
            />
          )}
          {!loading && user ? (
            <>
              <NavItem
                href="/profile/me"
                icon={<FiUser size={14} />}
                label={user.name}
                active={pathname.startsWith("/profile")}
              />
              <button
                onClick={logout}
                className="flex items-center gap-1 text-[11px] tracking-wider text-white/40 transition-colors hover:text-gold"
              >
                <FiLogOut size={13} />
                退出
              </button>
            </>
          ) : !loading ? (
            <Link
              href="/login"
              className="rounded border border-gold/30 px-3 py-1 text-[11px] tracking-wider text-gold transition-colors hover:bg-gold/10"
            >
              登录
            </Link>
          ) : null}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="text-white/35 transition-colors hover:text-gold"
              aria-label={theme === "dark" ? "亮色模式" : "暗色模式"}
            >
              {theme === "dark" ? <FiSun size={14} /> : <FiMoon size={14} />}
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex text-white/60 md:hidden"
          aria-label="菜单"
        >
          {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-0 z-10 border-t border-white/10 bg-[#080807]/95 px-5 pb-6 pt-16 backdrop-blur-lg md:hidden">
          <div className="flex flex-col gap-3">
            <MobileNavItem
              href="/"
              icon={<FiGrid size={14} />}
              label="发现"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavItem
              href="/works/top"
              icon={<FiTrendingUp size={14} />}
              label="热门"
              onClick={() => setMobileMenuOpen(false)}
            />
            {!loading && user ? (
              <>
                <MobileNavItem
                  href="/upload"
                  icon={<FiUpload size={14} />}
                  label="上传"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <MobileNavItem
                  href="/profile/me"
                  icon={<FiUser size={14} />}
                  label={user.name}
                  onClick={() => setMobileMenuOpen(false)}
                />
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-left text-xs text-white/50"
                >
                  <FiLogOut size={13} /> 退出
                </button>
              </>
            ) : !loading ? (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-gold"
              >
                登录
              </Link>
            ) : null}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-xs text-white/50"
              >
                {theme === "dark" ? (
                  <>
                    <FiSun size={13} /> 亮色
                  </>
                ) : (
                  <>
                    <FiMoon size={13} /> 暗色
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===== Main content ===== */}
      <div className="relative z-10 mx-auto flex h-[560px] max-w-[1180px] items-stretch px-4 md:h-[600px] lg:h-[620px]">
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
        <div className="flex flex-1 flex-col justify-center pr-0 pt-14 md:pr-6 lg:pt-12">
          {/* Eyebrow */}
          <p className="mb-4 text-[10px] tracking-[0.45em] text-gold md:mb-5 md:text-xs">
            INDEPENDENT WORKS ARCHIVE
          </p>

          {/* XIANXING */}
          <h1 className="font-serif text-[clamp(2.6rem,6vw,5rem)] font-bold leading-none tracking-tight text-white md:text-[clamp(3rem,7vw,6rem)] lg:text-[clamp(3.5rem,8vw,7.5rem)]">
            XIANXING
          </h1>

          {/* 先行 */}
          <h2 className="mt-1 font-serif text-[clamp(1.5rem,3vw,2.8rem)] font-semibold tracking-wide text-gold md:text-[clamp(1.8rem,3.5vw,3.2rem)] lg:text-[clamp(2rem,4vw,4rem)]">
            先行
          </h2>

          {/* Description */}
          <p className="mt-3 max-w-md text-xs leading-relaxed tracking-wider text-white/45 md:mt-4 md:text-sm">
            发现独立开发者正在创造的产品、工具与实验项目
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap gap-3 md:mt-7 lg:mt-8">
            <a
              href="#works"
              className="inline-flex items-center gap-2 rounded bg-gold px-5 py-2.5 text-xs font-semibold tracking-wider text-[#080807] transition-all hover:bg-gold-light md:px-6 md:py-3 md:text-sm"
            >
              发现作品
              <span className="text-sm leading-none md:text-base">→</span>
            </a>
            {!loading && user && (
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 rounded border border-white/15 px-5 py-2.5 text-xs tracking-wider text-white/60 transition-all hover:border-white/30 hover:text-white md:px-6 md:py-3 md:text-sm"
              >
                提交作品
              </Link>
            )}
          </div>
        </div>

        {/* ——— Right: stats & visual panel ——— */}
        <div className="hidden w-[280px] flex-shrink-0 flex-col justify-center md:w-[300px] lg:flex">
          <div className="relative border border-gold/15 p-5 md:p-6">
            {/* Corner decorations */}
            <div className="absolute -left-[1px] -top-[1px] h-6 w-6 border-l-2 border-t-2 border-gold/40" />
            <div className="absolute -bottom-[1px] -right-[1px] h-6 w-6 border-b-2 border-r-2 border-gold/40" />

            {/* Motto */}
            <p className="text-sm font-light tracking-wider text-white/60">
              独立思考
            </p>
            <p className="mt-0.5 text-sm font-light tracking-wider text-white/60">
              创造未来
            </p>

            {/* Divider */}
            <div className="my-4 h-px bg-gradient-to-r from-gold/30 to-transparent md:my-5" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
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

            {/* Divider */}
            <div className="my-4 h-px bg-gradient-to-r from-gold/30 to-transparent md:my-5" />

            {/* Footer */}
            <p className="text-center text-[8px] tracking-[0.35em] text-white/20 md:text-[9px]">
              CURATE · DISCOVER · INSPIRE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Sub-components ─── */

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1 text-[11px] tracking-wider transition-colors ${
        active ? "text-gold" : "text-white/40 hover:text-gold"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 text-xs text-white/50 transition-colors hover:text-gold"
    >
      {icon}
      {label}
    </Link>
  );
}

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
