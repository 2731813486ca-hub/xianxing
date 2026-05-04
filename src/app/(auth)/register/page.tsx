import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center px-4">
      <div className="w-full">
        <div className="mb-8 text-center">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
              创建账号
            </h1>
            <p className="text-sm font-light tracking-[0.15em] text-muted uppercase">
              Create Account
            </p>
          </div>
          <p className="mt-4 text-sm text-muted">加入先行，分享你的作品</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
