import { AuthGuard } from "@/components/auth/AuthGuard";
import { UploadForm } from "@/components/work/UploadForm";

export default function UploadPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 border-b border-border pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
              上传作品
            </h1>
            <p className="text-sm font-light tracking-[0.15em] text-muted uppercase">
              分享你的创作
            </p>
          </div>
          <p className="mt-3 text-sm text-muted">
            分享你的创意作品
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <UploadForm />
        </div>
      </div>
    </AuthGuard>
  );
}
