import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-bold text-gold">404</h1>
        <p className="mt-4 text-lg text-muted">页面不存在</p>
        <Link
          href="/"
          className="btn-gold mt-8 inline-block rounded-lg px-6 py-3 text-sm"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
