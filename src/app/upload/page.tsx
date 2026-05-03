import { AuthGuard } from "@/components/auth/AuthGuard";
import { UploadForm } from "@/components/work/UploadForm";

export default function UploadPage() {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            上传作品
          </h1>
          <p className="mt-2 text-sm text-muted">
            分享你的创意作品
          </p>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
          <UploadForm />
        </div>
      </div>
    </AuthGuard>
  );
}
