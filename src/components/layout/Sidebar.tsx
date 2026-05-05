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
  FiSun,
  FiMoon,
  FiBookmark,
  FiX,
  FiMenu,
} from "react-icons/fi";
import { useState, useEffect } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close on route change / Escape
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLink = (href: string, icon: React.ReactNode, label: string) => {
    const active =
      href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs tracking-wider transition-all duration-200 ${
          active
            ? "bg-gold/10 text-gold font-semibold"
            : isDark
              ? "text-white/45 hover:bg-white/[0.04] hover:text-white/75"
              : "text-black/45 hover:bg-black/[0.04] hover:text-black/70"
        }`}
      >
        <span className="flex items-center justify-center">{icon}</span>
        {label}
      </Link>
    );
  };

  const bottomBtn = (
    onClick: () => void,
    icon: React.ReactNode,
    label: string,
    isActive?: boolean,
  ) => (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs tracking-wider transition-all duration-200 ${
        isActive
          ? "bg-gold/10 text-gold font-semibold"
          : isDark
            ? "text-white/45 hover:bg-white/[0.04] hover:text-white/75"
            : "text-black/45 hover:bg-black/[0.04] hover:text-black/70"
      }`}
    >
      <span className="flex items-center justify-center">{icon}</span>
      {label}
    </button>
  );

  const bottomLink = (
    href: string,
    icon: React.ReactNode,
    label: string,
  ) => {
    const active = pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs tracking-wider transition-all duration-200 ${
          active
            ? "bg-gold/10 text-gold font-semibold"
            : isDark
              ? "text-white/45 hover:bg-white/[0.04] hover:text-white/75"
              : "text-black/45 hover:bg-black/[0.04] hover:text-black/70"
        }`}
      >
        <span className="flex items-center justify-center">{icon}</span>
        {label}
      </Link>
    );
  };

  const navContent = (
    <div className={`flex h-full flex-col ${isDark ? "bg-[#0e0c08]" : "bg-[#f5f0e8]/95 backdrop-blur-lg"}`}>
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3 px-5 pt-6 pb-4">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-sm">
          <img
            src="/logo-brand.png"
            alt="先行"
            className="h-full w-full scale-[1.8] object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span
            className={`text-sm font-bold leading-snug tracking-[0.12em] ${
              isDark ? "text-white/90" : "text-[#1a1a1a]/85"
            }`}
          >
            先行
          </span>
          <span
            className={`text-[7px] leading-none tracking-[0.35em] ${
              isDark ? "text-white/30" : "text-[#1a1a1a]/40"
            }`}
          >
            XIANXING
          </span>
        </div>
      </Link>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />

      {/* Nav items */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        {navLink("/", <FiGrid size={15} />, "发现")}
        {navLink("/works/top", <FiTrendingUp size={15} />, "热门")}
        {navLink("/forest-zone", <FiBookmark size={15} />, "树林专区")}
        {!loading && user && navLink("/upload", <FiUpload size={15} />, "上传")}
      </nav>

      {/* Bottom divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-gold/10 to-gold/20" />

      {/* Bottom section */}
      <div className="space-y-1 px-3 py-4">
        {bottomBtn(toggleTheme, isDark ? <FiSun size={15} /> : <FiMoon size={15} />, isDark ? "亮色模式" : "暗色模式")}

        {!loading && user ? (
          <>
            {bottomLink("/profile", <FiUser size={15} />, user.name)}
            {bottomBtn(logout, <FiLogOut size={15} />, "退出")}
          </>
        ) : !loading ? (
          bottomLink("/login", <FiUser size={15} />, "登录")
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {/* ===== Desktop sidebar ===== */}
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-full w-56 flex-col border-r md:flex ${
          isDark
            ? "border-white/[0.06] bg-[#0e0c08]"
            : "border-gold/[0.10] bg-[#f5f0e8]/95"
        }`}
      >
        {navContent}
      </aside>

      {/* ===== Mobile: top bar + drawer ===== */}
      <div className="md:hidden">
        {/* Top bar */}
        <div
          className={`fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between px-4 ${
            isDark
              ? "bg-[#0e0c08] text-white/90"
              : "bg-[#f5f0e8]/95 text-[#1a1a1a]/85 backdrop-blur-lg"
          }`}
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-sm">
              <img
                src="/logo-brand.png"
                alt="先行"
                className="h-full w-full scale-[1.8] object-cover"
              />
            </div>
            <span className="text-sm font-bold tracking-[0.12em]">先行</span>
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center"
            aria-label="打开菜单"
          >
            <FiMenu size={22} />
          </button>
        </div>

        {/* Drawer overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer panel */}
            <div
              className={`absolute left-0 top-0 h-full w-64 shadow-2xl ${
                isDark ? "bg-[#0e0c08]" : "bg-[#f5f0e8]"
              }`}
            >
              <div className="flex justify-end px-4 pt-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className={isDark ? "text-white/70" : "text-[#1a1a1a]/70"}
                  aria-label="关闭菜单"
                >
                  <FiX size={22} />
                </button>
              </div>
              {navContent}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
