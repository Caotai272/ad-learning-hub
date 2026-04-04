import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

export default function LoginPage() {
  return (
    <main className="container-shell flex min-h-screen items-center py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-[1fr_420px]">
        <section className="space-y-5 self-center">
          <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-800">
            Student & Admin Access
          </span>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-slate-950">
            Đăng nhập để tiếp tục học, làm quiz và kiểm soát vận hành nội dung.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-600">
            Phase 1 đang dựng nền xác thực với Auth.js, Prisma và role `student` /
            `admin`. Từ đây chúng ta sẽ nối tiếp sang lesson flow và dashboard thật.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(17,33,53,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-950">Đăng nhập hệ thống</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Dùng email và mật khẩu đã tạo để truy cập khu học viên hoặc admin.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
