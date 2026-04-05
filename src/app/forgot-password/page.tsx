import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
};

export default function ForgotPasswordPage() {
  return (
    <main className="container-shell flex min-h-screen items-center py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-[1fr_420px]">
        <section className="space-y-5 self-center">
          <span className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-800">
            Khôi phục truy cập
          </span>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-slate-950">
            Yêu cầu liên kết đặt lại mật khẩu để quay lại dashboard và luồng học.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-600">
            Hệ thống sẽ tạo một liên kết đặt lại mật khẩu một lần. Trong môi trường local/dev,
            liên kết sẽ hiển thị trực tiếp để bạn kiểm tra nhanh luồng.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(17,33,53,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-950">Quên mật khẩu</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Nhập email đã dùng để đăng ký tài khoản.
          </p>
          <div className="mt-8">
            <ForgotPasswordForm />
          </div>
        </section>
      </div>
    </main>
  );
}
