import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center px-4">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            欢迎回来
          </h1>
          <p className="mt-2 text-sm text-muted">登录你的账号</p>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
          <Suspense fallback={<LoadingSpinner size="sm" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
