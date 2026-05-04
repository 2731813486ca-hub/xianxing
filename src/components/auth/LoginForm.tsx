"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toaster";
import Link from "next/link";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const error = await login(form.email, form.password);
    setLoading(false);
    if (error) {
      toast(error, "error");
    } else {
      toast("登录成功！", "success");
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="邮箱 Email"
        type="email"
        placeholder="your@email.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <Input
        label="密码 Password"
        type="password"
        placeholder="••••••"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <Button type="submit" loading={loading} className="w-full">
        登录 Login
      </Button>
      <p className="text-center text-sm text-muted">
        还没有账号？{" "}
        <Link href="/register" className="text-gold hover:underline">
          注册 Register
        </Link>
      </p>
    </form>
  );
}
