"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/modules/auth/auth.schema";

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    setSuccessMessage(null);
    setResetUrl(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as {
        data?: { message?: string; resetUrl?: string | null };
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(payload.error?.message ?? "Không thể xử lý yêu cầu lúc này.");
        return;
      }

      setSuccessMessage(
        payload.data?.message ??
          "Nếu email tồn tại trong hệ thống, chúng tôi đã tạo liên kết đặt lại mật khẩu.",
      );
      setResetUrl(payload.data?.resetUrl ?? null);
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
          {...register("email")}
        />
        {errors.email ? <p className="text-sm text-rose-600">{errors.email.message}</p> : null}
      </div>

      {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}

      {successMessage ? (
        <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-950">
          <p>{successMessage}</p>
          {resetUrl ? (
            <p className="mt-3">
              Link local/dev:
              {" "}
              <a
                href={resetUrl}
                className="font-semibold text-slate-900 underline underline-offset-4"
              >
                Mở trang đặt lại mật khẩu
              </a>
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Đang tạo liên kết..." : "Gửi yêu cầu đặt lại mật khẩu"}
      </button>

      <p className="text-sm text-slate-600">
        Đã nhớ lại mật khẩu?
        {" "}
        <Link href="/login" className="font-semibold text-slate-900">
          Quay lại đăng nhập
        </Link>
      </p>
    </form>
  );
}
