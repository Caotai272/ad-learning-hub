"use client";

import type { ContentStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { AdminEntityType } from "@/modules/admin/admin.service";

import { cn } from "@/lib/utils";

type AdminContentStatusControlProps = {
  entityType: AdminEntityType;
  entityId: string;
  currentStatus: ContentStatus;
};

const statuses: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

function getStatusButtonClassName(status: ContentStatus, isActive: boolean) {
  if (isActive) {
    return "border-slate-950 bg-slate-950 text-white";
  }

  if (status === "PUBLISHED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-300 hover:bg-emerald-100";
  }

  if (status === "DRAFT") {
    return "border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-300 hover:bg-amber-100";
  }

  return "border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50";
}

export function AdminContentStatusControl({
  entityType,
  entityId,
  currentStatus,
}: AdminContentStatusControlProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpdateStatus = (status: ContentStatus) => {
    if (status === currentStatus) {
      return;
    }

    setServerError(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/admin/content-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityType,
          entityId,
          status,
        }),
      });

      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(payload.error?.message ?? "Không thể cập nhật trạng thái lúc này.");
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            disabled={isPending}
            onClick={() => handleUpdateStatus(status)}
            className={cn(
              "inline-flex items-center justify-center rounded-full border px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-70",
              getStatusButtonClassName(status, status === currentStatus),
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {serverError ? <p className="text-xs text-rose-600">{serverError}</p> : null}
    </div>
  );
}
