"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { FiGrid, FiTrendingUp, FiUpload, FiUser, FiLogOut, FiMenu, FiX, FiSun, FiMoon, FiBookmark, FiActivity } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change, back gesture, or Escape
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handlePopState = () => setMenuOpen(false);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        isTransparent
          ? isDark
            ? "bg-transparent"
            : "bg-white/15 backdrop-blur-md"
          : "bg-background backdrop-blur-lg after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gold/10"
      }`}
    >
      <div className="mx-auto flex h-14 items-center justify-between px-4 md:h-16 md:px-6 lg:max-w-[1180px] lg:px-0">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 md:gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden md:h-[44px] md:w-[44px]">
            <img
              src="/logo-brand.png"
              alt="先行"
              className={`h-full w-full object-cover scale-[1.8] transition-all duration-500 ${
                isTransparent && isDark ? "mix-blend-screen" : ""
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm font-bold leading-snug tracking-[0.12em] transition-colors duration-500 md:text-base ${
                isTransparent
                  ? isDark
                    ? "text-white/90"
                    : "text-[#1a1a1a]/85"
                  : "text-foreground"
              }`}
            >
              先行
            </span>
            <span
              className={`text-[7px] leading-none tracking-[0.35em] transition-colors duration-500 md:text-[8px] ${
                isTransparent
                  ? isDark
                    ? "text-white/30"
                    : "text-[#1a1a1a]/40"
                  : "text-muted"
              }`}
            >
              XIANXING
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          <NavLinks
            user={user}
            loading={loading}
            logout={logout}
            isTransparent={isTransparent}
            isDark={isDark}
          />
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1 text-[11px] tracking-wider transition-colors ${
              isTransparent
                ? isDark
                  ? "text-white/70 hover:text-gold"
                  : "text-[#1a1a1a]/60 hover:text-gold"
                : "text-foreground/70 hover:text-gold"
            }`}
            aria-label={theme === "dark" ? "亮色模式" : "暗色模式"}
          >
            {theme === "dark" ? <FiSun size={14} /> : <FiMoon size={14} />}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex md:hidden ${
            isTransparent
              ? isDark
                ? "text-white/70"
                : "text-[#1a1a1a]/70"
              : "text-foreground"
          }`}
          aria-label="菜单"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gold/10 bg-background/80 backdrop-blur-xl px-4 py-6 md:hidden">
          <div className="mx-auto flex max-w-[200px] flex-col items-center gap-2">
            <MobileNavLinks user={user} loading={loading} logout={logout} />
            <div className="mt-2 w-full border-t border-border/30 pt-3 text-center">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 text-xs text-foreground/60 transition-colors hover:text-gold"
              >
                {theme === "dark" ? <FiSun size={15} /> : <FiMoon size={15} />}
                {theme === "dark" ? "亮色模式" : "暗色模式"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Sub-components ─── */

function NavLinks({
  user,
  loading,
  logout,
  isTransparent,
  isDark,
}: {
  user: any;
  loading: boolean;
  logout: () => void;
  isTransparent: boolean;
  isDark: boolean;
}) {
  const pathname = usePathname();
  const [showDiscover, setShowDiscover] = useState(false);
  const discoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (discoverRef.current && !discoverRef.current.contains(e.target as Node)) {
        setShowDiscover(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const linkClass = (active: boolean) =>
    `group flex items-center gap-1 text-[11px] tracking-wider transition-colors relative after:absolute after:-bottom-[3px] after:left-0 after:h-px after:bg-current after:transition-all after:duration-300 ${
      active
        ? "text-gold after:w-full"
        : isTransparent
          ? isDark
            ? "text-white/70 hover:text-gold after:w-0 hover:after:w-full"
            : "text-[#1a1a1a]/60 hover:text-gold after:w-0 hover:after:w-full"
          : "text-foreground/70 hover:text-gold after:w-0 hover:after:w-full"
    }`;

  return (
    <>
      <div className="relative" ref={discoverRef}>
        <button
          onClick={() => setShowDiscover((p) => !p)}
          className={linkClass(pathname === "/")}
        >
          <FiGrid size={14} /> 发现
        </button>
        {showDiscover && (
          <div className={`absolute left-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-lg border shadow-xl ${
            isTransparent
              ? isDark
                ? "border-white/10 bg-[#12120f]"
                : "border-gold/10 bg-white/90 backdrop-blur-md"
              : "border-border bg-card"
          }`}>
            <Link
              href="/"
              onClick={() => setShowDiscover(false)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-left text-xs transition-colors md:text-sm ${
                isTransparent
                  ? isDark
                    ? "text-white/70 hover:bg-white/[0.04] hover:text-gold"
                    : "text-[#1a1a1a]/70 hover:bg-gold/10 hover:text-gold"
                  : "text-foreground/70 hover:bg-gold/5 hover:text-gold"
              }`}
            >
              <FiGrid size={13} className={
                isTransparent
                  ? isDark
                    ? "text-white/30"
                    : "text-[#1a1a1a]/30"
                  : "text-muted"
              } />
              <span>最新作品</span>
            </Link>
            <div className={`mx-3 h-px ${
              isTransparent
                ? isDark
                  ? "bg-white/[0.06]"
                  : "bg-gold/10"
                : "bg-border"
            }`} />
            <Link
              href="/"
              onClick={() => setShowDiscover(false)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-left text-xs transition-colors md:text-sm ${
                isTransparent
                  ? isDark
                    ? "text-white/70 hover:bg-white/[0.04] hover:text-gold"
                    : "text-[#1a1a1a]/70 hover:bg-gold/10 hover:text-gold"
                  : "text-foreground/70 hover:bg-gold/5 hover:text-gold"
              }`}
            >
              <FiActivity size={13} className={
                isTransparent
                  ? isDark
                    ? "text-white/30"
                    : "text-[#1a1a1a]/30"
                  : "text-muted"
              } />
              <span>社群动态</span>
            </Link>
          </div>
        )}
      </div>
      <Link href="/works/top" className={linkClass(pathname === "/works/top")}>
        <FiTrendingUp size={14} /> 热门
      </Link>
      <Link href="/forest-zone" className={linkClass(pathname === "/forest-zone")}>
        <FiBookmark size={14} /> 树林专区
      </Link>
      {!loading && user ? (
        <>
          <Link href="/upload" className={linkClass(pathname === "/upload")}>
            <FiUpload size={14} /> 上传
          </Link>
          <Link
            href="/profile/me"
            className={linkClass(pathname.startsWith("/profile"))}
          >
            <FiUser size={14} /> {user.name}
          </Link>
          <button
            onClick={logout}
            className={`flex items-center gap-1 text-[11px] tracking-wider transition-colors ${
              isTransparent
                ? isDark
                  ? "text-white/70 hover:text-gold"
                  : "text-[#1a1a1a]/60 hover:text-gold"
                : "text-foreground/70 hover:text-gold"
            }`}
          >
            <FiLogOut size={13} /> 退出
          </button>
        </>
      ) : !loading ? (
        <Link
          href="/login"
          className="rounded border border-gold/30 px-3 py-1 text-[11px] tracking-wider text-gold transition-all duration-300 hover:bg-gold/10 hover:shadow-[0_0_16px_rgba(215,170,69,0.15)]"
        >
          登录
        </Link>
      ) : null}
    </>
  );
}

function MobileNavLinks({
  user,
  loading,
  logout,
}: {
  user: any;
  loading: boolean;
  logout: () => void;
}) {
  return (
    <>
      <Link
        href="/"
        className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-foreground/70 transition-colors hover:bg-gold/5 hover:text-gold"
      >
        <FiGrid size={14} /> 发现
      </Link>
      <Link
        href="/works/top"
        className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-foreground/70 transition-colors hover:bg-gold/5 hover:text-gold"
      >
        <FiTrendingUp size={14} /> 热门
      </Link>
      <Link
        href="/forest-zone"
        className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-foreground/70 transition-colors hover:bg-gold/5 hover:text-gold"
      >
        <FiBookmark size={14} /> 树林专区
      </Link>
      {!loading && user ? (
        <>
          <Link
            href="/upload"
            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-foreground/70 transition-colors hover:bg-gold/5 hover:text-gold"
          >
            <FiUpload size={14} /> 上传
          </Link>
          <Link
            href="/profile/me"
            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-foreground/70 transition-colors hover:bg-gold/5 hover:text-gold"
          >
            <FiUser size={14} /> {user.name}
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-foreground/70 transition-colors hover:bg-gold/5 hover:text-gold"
          >
            <FiLogOut size={14} /> 退出
          </button>
        </>
      ) : !loading ? (
        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10"
        >
          登录
        </Link>
      ) : null}
    </>
  );
}
