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
              "rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-70",
              status === currentStatus
                ? "border-slate-900 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
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
