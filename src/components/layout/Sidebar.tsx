"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FiGrid,
  FiTrendingUp,
  FiUpload,
  FiUser,
  FiLogOut,
  FiBookmark,
  FiShield,
  FiFileText,
  FiX,
  FiMenu,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { SUPER_ADMIN_EMAIL } from "@/lib/constants";

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Poll pending admin count
  useEffect(() => {
    if (!user || user.email !== SUPER_ADMIN_EMAIL) return;
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/admin/pending-count");
        if (res.ok) {
          const data = await res.json();
          setPendingCount(data.total);
        }
      } catch { /* ignore */ }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [user]);

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLink = (href: string, icon: React.ReactNode, label: string) => (
    <Link
      href={href}
      className={`nav-item${isActive(href) ? " active" : ""}`}
    >
      {icon}
      {label}
    </Link>
  );

  const bottomLink = (href: string, icon: React.ReactNode, label: string) => (
    <Link
      href={href}
      className={`nav-item${isActive(href) ? " active" : ""}`}
    >
      {icon}
      {label}
    </Link>
  );

  const navContent = (
    <div className="flex h-full flex-col bg-[#0e0c08]">
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
          <span className="text-sm font-bold leading-snug tracking-[0.12em] text-white/90">
            先行
          </span>
          <span className="text-[7px] leading-none tracking-[0.35em] text-white/30">
            XIANXING
          </span>
        </div>
      </Link>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 px-3 py-5">
        {navLink("/", <FiGrid size={17} />, "发现")}
        {navLink("/works/top", <FiTrendingUp size={17} />, "热门")}
        {navLink("/forest-zone", <FiBookmark size={17} />, "树林专区")}
        {!loading && user && navLink("/upload", <FiUpload size={17} />, "上传")}
        {!loading && user?.email === SUPER_ADMIN_EMAIL && (
          <>
            <Link href="/admin/users" className={`nav-item${isActive("/admin/users") ? " active" : ""}`}>
              <FiShield size={17} />
              <span className="flex items-center gap-2">
                管理后台
                {pendingCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold leading-none text-white shadow-[0_0_8px_rgba(220,38,38,0.4)]">
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
              </span>
            </Link>
            <Link href="/admin/archives" className={`nav-item${isActive("/admin/archives") ? " active" : ""}`}>
              <FiFileText size={17} />
              档案管理
            </Link>
          </>
        )}
      </nav>

      {/* Bottom divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-gold/10 to-gold/20" />

      {/* Bottom section */}
      <div className="space-y-0.5 px-3 py-4">
        {!loading && user ? (
          <>
            {bottomLink("/profile/me", <FiUser size={17} />, user.name)}
            <button
              onClick={logout}
              className="nav-item w-full"
            >
              <FiLogOut size={17} />
              退出
            </button>
          </>
        ) : !loading ? (
          bottomLink("/login", <FiUser size={17} />, "登录")
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {/* ===== Desktop sidebar ===== */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-56 flex-col border-r border-white/[0.06] bg-[#0e0c08] md:flex">
        {navContent}
      </aside>

      {/* ===== Mobile: top bar + drawer ===== */}
      <div className="md:hidden">
        {/* Top bar */}
        <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between bg-[#0e0c08] px-4 text-white/90">
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
            <div className="absolute left-0 top-0 h-full w-64 bg-[#0e0c08] shadow-2xl">
              <div className="flex justify-end px-4 pt-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-white/70"
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
