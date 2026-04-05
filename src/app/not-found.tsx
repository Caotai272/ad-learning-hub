import Link from "next/link";

import { getPublicButtonClassName } from "@/components/ui/public-button";

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <div className="glass-panel max-w-2xl rounded-[2rem] px-8 py-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">
          Không tìm thấy trang bạn đang mở
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Route này không tồn tại, đã bị gỡ hoặc đường dẫn bạn nhập chưa đúng. Hãy quay về các
          khu vực chính để tiếp tục truy cập hệ thống.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={getPublicButtonClassName()}>
            Quay về trang chủ
          </Link>
          <Link href="/courses" className={getPublicButtonClassName({ variant: "secondary" })}>
            Xem khóa học
          </Link>
        </div>
      </div>
    </main>
  );
}
