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
            Tạo tài khoản mới để chuẩn bị cho learning path, quiz và simulator.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-600">
            Form đăng ký đang ghi dữ liệu người dùng vào PostgreSQL qua Prisma. Sau
            đó hệ thống tự đăng nhập để đưa người học vào dashboard.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(17,33,53,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-950">Tạo tài khoản</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Giao diện dùng tiếng Việt, còn các thuật ngữ của ads sẽ được giữ nguyên
            ở các phase tiếp theo.
          </p>
          <div className="mt-8">
            <RegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}
