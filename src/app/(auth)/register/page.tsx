import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center px-4">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            创建账号
          </h1>
          <p className="mt-2 text-sm text-muted">加入先行，分享你的作品</p>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
