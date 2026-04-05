"use client";

import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";

type BookmarkToggleButtonProps = {
  targetType: "LESSON" | "GLOSSARY_TERM";
  targetId: string;
  initialBookmarked: boolean;
  activeLabel: string;
  idleLabel: string;
  className?: string;
};

type BookmarkToggleResponse = {
  data: {
    bookmarked: boolean;
  } | null;
  error: {
    message: string;
  } | null;
};

export function BookmarkToggleButton({
  targetType,
  targetId,
  initialBookmarked,
  activeLabel,
  idleLabel,
  className,
}: BookmarkToggleButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    setServerError(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/student/bookmarks/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetType,
          targetId,
        }),
      });

      const payload = (await response.json()) as BookmarkToggleResponse;

      if (!response.ok || !payload.data) {
        setServerError(payload.error?.message ?? "Không thể cập nhật bookmark.");
        return;
      }

      setIsBookmarked(payload.data.bookmarked);
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          "inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition",
          isBookmarked
            ? "border-slate-900 bg-slate-950 text-white hover:bg-slate-800"
            : "border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50",
          isPending ? "cursor-not-allowed opacity-70" : null,
          className,
        )}
      >
        {isPending ? "Đang lưu..." : isBookmarked ? activeLabel : idleLabel}
      </button>

      {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}
    </div>
  );
}
