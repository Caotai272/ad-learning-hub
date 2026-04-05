import type { Metadata } from "next";
import Link from "next/link";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    email?: string;
    token?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const email = params.email ?? "";
  const token = params.token ?? "";
  const isValidRequest = Boolean(email && token);

  return (
    <main className="container-shell flex min-h-screen items-center py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-[1fr_420px]">
        <section className="space-y-5 self-center">
          <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-800">
            Bảo mật tài khoản
          </span>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-slate-950">
            Đặt lại mật khẩu mới để quay lại luồng học và dashboard student.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-600">
            Liên kết đặt lại mật khẩu chỉ dùng được một lần và sẽ hết hạn theo thời gian.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(17,33,53,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-950">Đặt lại mật khẩu</h2>
          {isValidRequest ? (
            <>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Thiết lập mật khẩu mới cho tài khoản
                {" "}
                <span className="font-semibold text-slate-900">{email}</span>.
              </p>
              <div className="mt-8">
                <ResetPasswordForm email={email} token={token} />
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-5 py-5 text-sm leading-7 text-amber-950">
              <p>Liên kết đặt lại mật khẩu chưa hợp lệ hoặc đang thiếu thông tin.</p>
              <Link
                href="/forgot-password"
                className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Tạo lại liên kết
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
