"use client";

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AdminButtonVariant = "primary" | "secondary" | "subtle" | "danger" | "dangerSoft";
type AdminButtonSize = "sm" | "md";

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
};

const variantClassNames: Record<AdminButtonVariant, string> = {
  primary:
    "border border-slate-950 bg-slate-950 text-white hover:border-slate-800 hover:bg-slate-800",
  secondary:
    "border border-slate-300 bg-white text-slate-950 hover:border-slate-400 hover:bg-slate-50",
  subtle:
    "border border-slate-200 bg-slate-100 text-slate-900 hover:border-slate-300 hover:bg-slate-200",
  danger:
    "border border-rose-700 bg-rose-700 text-white hover:border-rose-800 hover:bg-rose-800",
  dangerSoft:
    "border border-rose-300 bg-white text-rose-700 hover:border-rose-400 hover:bg-rose-50",
};

const sizeClassNames: Record<AdminButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
};

export function AdminButton({
  className,
  variant = "secondary",
  size = "md",
  type = "button",
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        className,
        "inline-flex max-w-full items-center justify-center rounded-full text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
        variantClassNames[variant],
        sizeClassNames[size],
      )}
      {...props}
    />
  );
}
