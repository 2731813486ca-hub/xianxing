import { AuthGuard } from "@/components/auth/AuthGuard";
import { SettingsForm } from "./SettingsForm";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            设置
          </h1>
          <p className="mt-2 text-sm text-muted">编辑个人资料</p>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
          <SettingsForm />
        </div>
      </div>
    </AuthGuard>
  );
}
