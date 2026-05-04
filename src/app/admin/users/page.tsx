"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SUPER_ADMIN_EMAIL } from "@/lib/constants";

interface UserItem {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [operatingId, setOperatingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.email !== SUPER_ADMIN_EMAIL) {
      router.replace("/");
      return;
    }
    setAuthorized(true);
    fetchUsers();
  }, [user, authLoading, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

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

  if (authLoading || !authorized) return <LoadingSpinner />;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-10 border-b border-border pb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          管理后台
        </h1>
        <p className="mt-1 text-sm text-muted">用户角色管理</p>
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
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-border last:border-0 transition-colors hover:bg-muted/[0.03]"
              >
                <td className="px-5 py-4 text-foreground">{u.name}</td>
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
                            ? "text-red-400 hover:text-red-300"
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

      {users.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted">暂无用户</p>
      )}
    </div>
  );
}
