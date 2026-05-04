"use client";

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
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiBookmark,
} from "react-icons/fi";
import { useState, useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  const isTransparent = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        isTransparent
          ? "bg-transparent"
          : "border-b border-gold/10 bg-background/80 backdrop-blur-lg"
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
                isTransparent ? "mix-blend-screen" : ""
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm font-bold leading-snug tracking-[0.12em] transition-colors duration-500 md:text-base ${
                isTransparent ? "text-white/90" : "text-foreground"
              }`}
            >
              先行
            </span>
            <span
              className={`text-[7px] leading-none tracking-[0.35em] transition-colors duration-500 md:text-[8px] ${
                isTransparent ? "text-white/30" : "text-muted"
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
          />
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1 text-[11px] tracking-wider transition-colors ${
              isTransparent
                ? "text-white/70 hover:text-gold"
                : "text-muted hover:text-gold"
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
            isTransparent ? "text-white/70" : "text-foreground"
          }`}
          aria-label="菜单"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gold/10 bg-background/95 px-4 py-4 backdrop-blur-lg md:hidden">
          <div className="flex flex-col gap-3">
            <MobileNavLinks user={user} loading={loading} logout={logout} />
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-gold"
            >
              {theme === "dark" ? (
                <><FiSun size={16} /> 亮色</>
              ) : (
                <><FiMoon size={16} /> 暗色</>
              )}
            </button>
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
}: {
  user: any;
  loading: boolean;
  logout: () => void;
  isTransparent: boolean;
}) {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    `flex items-center gap-1 text-[11px] tracking-wider transition-colors ${
      active
        ? "text-gold"
        : isTransparent
          ? "text-white/70 hover:text-gold"
          : "text-muted hover:text-gold"
    }`;

  return (
    <>
      <Link href="/" className={linkClass(pathname === "/")}>
        <FiGrid size={14} /> 发现
      </Link>
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
                ? "text-white/70 hover:text-gold"
                : "text-muted hover:text-gold"
            }`}
          >
            <FiLogOut size={13} /> 退出
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
        className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-gold"
      >
        <FiGrid size={14} /> 发现
      </Link>
      <Link
        href="/works/top"
        className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-gold"
      >
        <FiTrendingUp size={14} /> 热门
      </Link>
      <Link
        href="/forest-zone"
        className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-gold"
      >
        <FiBookmark size={14} /> 树林专区
      </Link>
      {!loading && user ? (
        <>
          <Link
            href="/upload"
            className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-gold"
          >
            <FiUpload size={14} /> 上传
          </Link>
          <Link
            href="/profile/me"
            className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-gold"
          >
            <FiUser size={14} /> {user.name}
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-gold"
          >
            <FiLogOut size={14} /> 退出
          </button>
        </>
      ) : !loading ? (
        <Link
          href="/login"
          className="inline-block rounded border border-gold/30 px-4 py-1.5 text-xs tracking-wider text-gold"
        >
          登录
        </Link>
      ) : null}
    </>
  );
}
