import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Tạo tài khoản",
};

export default function RegisterPage() {
  return (
    <main className="container-shell flex min-h-screen items-center py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-[1fr_420px]">
        <section className="space-y-5 self-center">
          <span className="inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-semibold text-cyan-800">
            Khởi động luồng học viên
          </span>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-slate-950">
            Tạo tài khoản mới để bắt đầu lesson, quiz và progress tracking.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-600">
            Sau khi đăng ký thành công, hệ thống sẽ tự đăng nhập để đưa người học vào dashboard và
            bắt đầu ghi nhận tiến độ học tập.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(17,33,53,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-950">Tạo tài khoản</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Giao diện dùng tiếng Việt, còn các thuật ngữ của ads vẫn được giữ nguyên trong bài học
            và quiz.
          </p>
          <div className="mt-8">
            <RegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}
