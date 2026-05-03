"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toaster";
import Link from "next/link";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const error = await register(form.email, form.password, form.name);
    setLoading(false);
    if (error) {
      toast(error, "error");
    } else {
      toast("注册成功！", "success");
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="昵称"
        placeholder="你的昵称"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <Input
        label="邮箱"
        type="email"
        placeholder="your@email.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <Input
        label="密码"
        type="password"
        placeholder="至少6个字符"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        minLength={6}
      />
      <Button type="submit" loading={loading} className="w-full">
        注册
      </Button>
      <p className="text-center text-sm text-muted">
        已有账号？{" "}
        <Link href="/login" className="text-gold hover:underline">
          登录
        </Link>
      </p>
    </form>
  );
}
