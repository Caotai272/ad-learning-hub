"use client";

import { signOut } from "next-auth/react";
import { useState, useTransition } from "react";

type StudentSignOutButtonProps = {
  className?: string;
};

export function StudentSignOutButton({ className }: StudentSignOutButtonProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    setServerError(null);

    startTransition(async () => {
      try {
        await signOut({
          callbackUrl: "/login",
        });
      } catch {
        setServerError("Không thể đăng xuất lúc này.");
      }
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className={
          className ??
          "inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-70"
        }
      >
        {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
      </button>
      {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}
    </div>
  );
}
