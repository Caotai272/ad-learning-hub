"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/modules/auth/auth.schema";

type ResetPasswordFormProps = {
  email: string;
  token: string;
};

export function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      token,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(payload.error?.message ?? "Không thể đặt lại mật khẩu lúc này.");
        return;
      }

      setSuccessMessage("Mật khẩu đã được đặt lại. Bạn có thể đăng nhập bằng mật khẩu mới.");
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1200);
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" {...register("email")} />
      <input type="hidden" {...register("token")} />

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Mật khẩu mới
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
          {...register("password")}
        />
        {errors.password ? <p className="text-sm text-rose-600">{errors.password.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
          Xác nhận mật khẩu mới
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-rose-600">{errors.confirmPassword.message}</p>
        ) : null}
      </div>

      {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Đang cập nhật mật khẩu..." : "Đặt lại mật khẩu"}
      </button>

      <p className="text-sm text-slate-600">
        <Link href="/login" className="font-semibold text-slate-900">
          Quay lại đăng nhập
        </Link>
      </p>
    </form>
  );
}
