"use client";

import Link from "next/link";

import { getPublicButtonClassName } from "@/components/ui/public-button";

type AppErrorStateProps = {
  title: string;
  description: string;
  resetLabel?: string;
  onReset?: () => void;
  homeHref?: string;
  homeLabel?: string;
};

export function AppErrorState({
  title,
  description,
  resetLabel = "Thử lại",
  onReset,
  homeHref = "/",
  homeLabel = "Quay về trang chủ",
}: AppErrorStateProps) {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <div className="glass-panel max-w-2xl rounded-[2rem] px-8 py-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">System</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className={getPublicButtonClassName()}
            >
              {resetLabel}
            </button>
          ) : null}
          <Link
            href={homeHref}
            className={getPublicButtonClassName({ variant: onReset ? "secondary" : "primary" })}
          >
            {homeLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
