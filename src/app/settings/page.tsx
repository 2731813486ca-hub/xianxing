"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { SettingsForm } from "./SettingsForm";
import { BackButton } from "@/components/ui/BackButton";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BackButton />
        <div className="mb-8 border-b border-border pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
              设置
            </h1>
            <p className="text-sm text-muted">编辑个人资料</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <SettingsForm />
        </div>
      </div>
    </AuthGuard>
  );
}
