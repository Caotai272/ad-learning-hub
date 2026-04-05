"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/modules/auth/auth.schema";

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/auth/change-password", {
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
        setServerError(payload.error?.message ?? "Không thể đổi mật khẩu lúc này.");
        return;
      }

      reset();
      setSuccessMessage("Mật khẩu đã được cập nhật.");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">
          Mật khẩu hiện tại
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
          {...register("currentPassword")}
        />
        {errors.currentPassword ? (
          <p className="text-sm text-rose-600">{errors.currentPassword.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
          Mật khẩu mới
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
          {...register("newPassword")}
        />
        {errors.newPassword ? (
          <p className="text-sm text-rose-600">{errors.newPassword.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmNewPassword" className="text-sm font-medium text-slate-700">
          Xác nhận mật khẩu mới
        </label>
        <input
          id="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
          {...register("confirmNewPassword")}
        />
        {errors.confirmNewPassword ? (
          <p className="text-sm text-rose-600">{errors.confirmNewPassword.message}</p>
        ) : null}
      </div>

      {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Đang cập nhật..." : "Đổi mật khẩu"}
      </button>
    </form>
  );
}
