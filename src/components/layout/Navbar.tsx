"use client";

import Link from "next/link";
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
} from "react-icons/fi";
import { useState } from "react";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute h-3 w-3 rounded-full bg-gold transition-all duration-500 group-hover:scale-150 group-hover:opacity-60" />
            <span className="absolute h-2 w-2 rounded-full bg-gold" />
          </span>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold leading-none tracking-[0.12em] text-gold uppercase">
              先行
            </span>
            <span className="mt-0.5 text-[10px] font-light tracking-[0.3em] text-muted uppercase">
              Xianxing
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLinks user={user} loading={loading} logout={logout} />
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold"
            aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
          >
            {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-foreground md:hidden"
          aria-label="菜单"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <MobileNavLinks user={user} loading={loading} logout={logout} />
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
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

function NavLinks({
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
      <NavItem href="/" icon={<FiGrid size={16} />} label="发现" />
      <NavItem href="/works/top" icon={<FiTrendingUp size={16} />} label="热门" />
      {!loading && user ? (
        <>
          <NavItem href="/upload" icon={<FiUpload size={16} />} label="上传" />
          <NavItem href="/profile/me" icon={<FiUser size={16} />} label={user.name} />
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold"
          >
            <FiLogOut size={16} />
            退出
          </button>
        </>
      ) : !loading ? (
        <Link
          href="/login"
          className="btn-gold rounded-lg px-4 py-2 text-sm"
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
      <MobileNavItem href="/" label="发现" />
      <MobileNavItem href="/works/top" label="热门" />
      {!loading && user ? (
        <>
          <MobileNavItem href="/upload" label="上传" />
          <MobileNavItem href="/profile/me" label={user.name} />
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
          >
            <FiLogOut size={16} />
            退出
          </button>
        </>
      ) : !loading ? (
        <Link
          href="/login"
          className="btn-gold rounded-lg px-4 py-2 text-center text-sm"
        >
          登录
        </Link>
      ) : null}
    </>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm text-muted transition-colors hover:text-gold"
    >
      {label}
    </Link>
  );
}
