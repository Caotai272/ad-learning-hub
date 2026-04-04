import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <div className="glass-panel max-w-2xl rounded-[2rem] px-8 py-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">
          Không tìm thấy trang bạn đang mở
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Route này chưa tồn tại hoặc sẽ được triển khai ở phase tiếp theo của dự án.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Quay về trang chủ
        </Link>
      </div>
    </main>
  );
}
