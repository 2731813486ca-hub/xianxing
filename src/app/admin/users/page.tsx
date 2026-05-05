"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SUPER_ADMIN_EMAIL } from "@/lib/constants";
import { FiSearch, FiUserCheck, FiCheck, FiX } from "react-icons/fi";

interface UserItem {
  id: string;
  email: string;
  name: string;
  role: string;
  isForestAdmin: boolean;
  createdAt: string;
}

interface IdentityItem {
  id: string;
  email: string;
  name: string;
  wechatName: string;
  wechatAccount: string;
  memberStatus: string;
  createdAt: string;
}

type Tab = "users" | "identities";

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("users");

  // User management
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [operatingId, setOperatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Forest admin binding
  const [forestAdmin, setForestAdmin] = useState<UserItem | null>(null);
  const [bindName, setBindName] = useState("");
  const [bindEmail, setBindEmail] = useState("");
  const [binding, setBinding] = useState(false);

  // Identity review
  const [identities, setIdentities] = useState<IdentityItem[]>([]);
  const [identityFilter, setIdentityFilter] = useState("pending");
  const [identitiesLoading, setIdentitiesLoading] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async (q: string) => {
    try {
      const url = q ? `/api/admin/users?q=${encodeURIComponent(q)}` : "/api/admin/users";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    }
  }, []);

  const fetchForestAdmin = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/forest-admin");
      if (res.ok) {
        const data = await res.json();
        setForestAdmin(data.forestAdmin || null);
      }
    } catch {}
  }, []);

  const fetchIdentities = useCallback(async (status: string) => {
    setIdentitiesLoading(true);
    try {
      const res = await fetch(`/api/admin/identities?status=${encodeURIComponent(status)}`);
      if (res.ok) {
        const data = await res.json();
        setIdentities(data.users || []);
      }
    } catch {} finally {
      setIdentitiesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.email !== SUPER_ADMIN_EMAIL) {
      router.replace("/");
      return;
    }
    setAuthorized(true);
    Promise.all([fetchUsers(""), fetchForestAdmin()]).then(() => setLoading(false));
  }, [user, authLoading, router]);

  useEffect(() => {
    if (authorized) {
      const timer = setTimeout(() => fetchUsers(search), 300);
      return () => clearTimeout(timer);
    }
  }, [search, authorized, fetchUsers]);

  useEffect(() => {
    if (authorized && tab === "identities") {
      fetchIdentities(identityFilter);
    }
  }, [tab, identityFilter, authorized, fetchIdentities]);

  const toggleRole = async (targetUser: UserItem) => {
    setOperatingId(targetUser.id);
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUser.id, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
        );
      } else {
        alert(data.error || "操作失败");
      }
    } catch {
      alert("操作失败");
    } finally {
      setOperatingId(null);
    }
  };

  const handleBindForestAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bindName.trim() || !bindEmail.trim()) {
      alert("请输入姓名和邮箱");
      return;
    }
    setBinding(true);
    try {
      const res = await fetch("/api/admin/forest-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: bindEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setForestAdmin(data.forestAdmin);
        setBindName("");
        setBindEmail("");
        fetchUsers(search);
      } else {
        alert(data.error || "绑定失败");
      }
    } catch {
      alert("绑定失败");
    } finally {
      setBinding(false);
    }
  };

  const handleReview = async (userId: string, status: "approved" | "rejected") => {
    setReviewingId(userId);
    try {
      const res = await fetch("/api/admin/identities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, memberStatus: status }),
      });
      if (res.ok) {
        setIdentities((prev) => prev.filter((u) => u.id !== userId));
      } else {
        const data = await res.json();
        alert(data.error || "操作失败");
      }
    } catch {
      alert("操作失败");
    } finally {
      setReviewingId(null);
    }
  };

  if (authLoading || !authorized) return <LoadingSpinner />;
  if (loading) return <LoadingSpinner />;

  // Sort: admins first
  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return 0;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: "users", label: "用户管理" },
    { key: "identities", label: "身份审核" },
  ];

  const identityStatusLabels: Record<string, string> = {
    pending: "待审核",
    approved: "已通过",
    rejected: "未通过",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 border-b border-border pb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          管理后台
        </h1>
        <p className="mt-1 text-sm text-muted">用户管理 · 身份审核</p>
      </div>

      {/* Forest Admin Section (always visible) */}
      <div className="mb-6 rounded-xl border border-gold/30 bg-gold/[0.03] p-5">
        <div className="flex items-center gap-2 mb-3">
          <FiUserCheck size={16} className="text-gold" />
          <h2 className="font-serif text-base font-semibold text-foreground">
            树林
          </h2>
          <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-gold">
            唯一名额
          </span>
        </div>

        {forestAdmin ? (
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
            <div>
              <p className="text-sm font-medium text-foreground">{forestAdmin.name}</p>
              <p className="text-xs text-muted">{forestAdmin.email}</p>
            </div>
            <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-gold">
              已绑定
            </span>
          </div>
        ) : (
          <p className="mb-3 text-xs text-muted">暂未绑定，请指定一名用户作为树林管理员</p>
        )}

        <form onSubmit={handleBindForestAdmin} className="mt-3 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <label className="mb-1 block text-[11px] font-medium text-muted">用户姓名</label>
            <input
              type="text"
              value={bindName}
              onChange={(e) => setBindName(e.target.value)}
              placeholder="输入用户姓名"
              className="input-field w-full rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-[11px] font-medium text-muted">用户邮箱</label>
            <input
              type="email"
              value={bindEmail}
              onChange={(e) => setBindEmail(e.target.value)}
              placeholder="输入用户邮箱"
              className="input-field w-full rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={binding}
            className="rounded-lg bg-gold px-5 py-2 text-xs font-semibold tracking-wider text-black transition-all hover:bg-gold-light disabled:opacity-50"
          >
            {binding ? "绑定中..." : forestAdmin ? "重新绑定" : "绑定"}
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-sm font-medium tracking-wider transition-colors relative ${
              tab === t.key
                ? "text-gold"
                : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
            )}
          </button>
        ))}
      </div>

      {/* Tab: User Management */}
      {tab === "users" && (
        <>
          {/* Search */}
          <div className="mb-4 relative">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索用户名或邮箱..."
              className="input-field w-full rounded-lg pl-9 pr-4 py-2.5 text-sm"
            />
          </div>

          {/* Users table */}
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/5">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider text-muted">
                    姓名
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider text-muted">
                    邮箱
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider text-muted">
                    角色
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold tracking-wider text-muted">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-muted/[0.03]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{u.name}</span>
                        {u.isForestAdmin && (
                          <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-gold">
                            树林
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted">{u.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wider ${
                          u.role === "admin"
                            ? "bg-gold/10 text-gold"
                            : "bg-muted/10 text-muted"
                        }`}
                      >
                        {u.role === "admin" ? "管理员" : "用户"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => toggleRole(u)}
                        disabled={u.id === user?.id || operatingId === u.id}
                        className={`text-xs tracking-wider transition-colors ${
                          u.id === user?.id
                            ? "text-muted/30 cursor-not-allowed"
                            : operatingId === u.id
                              ? "text-muted/50 animate-pulse"
                              : u.role === "admin"
                              ? "text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                : "text-gold hover:text-gold-light"
                        }`}
                      >
                        {u.id === user?.id
                          ? "当前账号"
                          : operatingId === u.id
                            ? "处理中..."
                            : u.role === "admin"
                              ? "取消管理员"
                              : "设为管理员"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedUsers.length === 0 && (
            <p className="mt-8 text-center text-sm text-muted">暂无用户</p>
          )}
        </>
      )}

      {/* Tab: Identity Review */}
      {tab === "identities" && (
        <>
          {/* Status filter */}
          <div className="mb-4 flex gap-2">
            {(["pending", "approved", "rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setIdentityFilter(status)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-wider transition-all ${
                  identityFilter === status
                    ? "bg-gold text-black"
                    : "border border-border text-muted hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {identityStatusLabels[status]}
              </button>
            ))}
          </div>

          {identitiesLoading ? (
            <LoadingSpinner />
          ) : identities.length === 0 ? (
            <div className="rounded-xl border border-border py-16 text-center">
              <p className="text-sm text-muted">
                {identityFilter === "pending"
                  ? "暂无待审核的申请"
                  : identityFilter === "approved"
                    ? "暂无已通过的用户"
                    : "暂无未通过的用户"}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/5">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider text-muted">
                      姓名
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider text-muted">
                      邮箱
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider text-muted">
                      微信昵称
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider text-muted">
                      微信号
                    </th>
                    {identityFilter === "pending" && (
                      <th className="px-5 py-3.5 text-right text-xs font-semibold tracking-wider text-muted">
                        操作
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {identities.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-border last:border-0 transition-colors hover:bg-muted/[0.03]"
                    >
                      <td className="px-5 py-4 text-foreground">{u.name}</td>
                      <td className="px-5 py-4 text-muted">{u.email}</td>
                      <td className="px-5 py-4 text-foreground">
                        {u.wechatName || <span className="text-muted/40">-</span>}
                      </td>
                      <td className="px-5 py-4 text-foreground">
                        {u.wechatAccount || <span className="text-muted/40">-</span>}
                      </td>
                      {identityFilter === "pending" && (
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReview(u.id, "approved")}
                              disabled={reviewingId === u.id}
                              className="flex items-center gap-1 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-green-600 transition-colors hover:bg-green-500/20 dark:bg-green-900/20 dark:text-green-500 dark:hover:bg-green-900/30 disabled:opacity-50"
                            >
                              <FiCheck size={13} />
                              通过
                            </button>
                            <button
                              onClick={() => handleReview(u.id, "rejected")}
                              disabled={reviewingId === u.id}
                              className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-red-600 transition-colors hover:bg-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 disabled:opacity-50"
                            >
                              <FiX size={13} />
                              拒绝
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
