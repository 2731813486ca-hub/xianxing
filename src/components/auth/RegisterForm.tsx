"use client";

import { useState, useRef } from "react";
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
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [form, setForm] = useState({ email: "", code: "", password: "", name: "" });
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const startCountdown = () => {
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast("请输入有效的邮箱地址", "error");
      return;
    }

    setSendingCode(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast("验证码已发送到邮箱", "success");
        setCodeSent(true);
        startCountdown();
      } else {
        toast(data.error || "发送失败", "error");
      }
    } catch {
      toast("网络错误", "error");
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeSent) {
      toast("请先发送验证码", "error");
      return;
    }

    setLoading(true);
    const error = await register(form.email, form.password, form.name, form.code);
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

      {/* Email + Send Code */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          邮箱
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            disabled={codeSent}
            className="input-field flex-1 rounded-lg px-4 py-2.5 text-sm disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={sendingCode || countdown > 0 || codeSent}
            className="shrink-0 rounded-lg bg-gold px-4 py-2.5 text-xs font-semibold tracking-wider text-black transition-all hover:bg-gold-light disabled:opacity-50"
          >
            {sendingCode ? "发送中..." : countdown > 0 ? `${countdown}s` : codeSent ? "已发送" : "发送验证码"}
          </button>
        </div>
      </div>

      <Input
        label="验证码"
        placeholder="先发送验证码"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
        required
        maxLength={6}
        disabled={!codeSent}
        className={!codeSent ? "opacity-50" : ""}
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
