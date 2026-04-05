"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { AdminEntityType } from "@/modules/admin/admin.service";

import { AdminButton } from "@/components/admin/admin-button";

type AdminSortOrderControlsProps = {
  entityType: AdminEntityType;
  entityId: string;
  sortOrder: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

type SortDirection = "UP" | "DOWN";

export function AdminSortOrderControls({
  entityType,
  entityId,
  sortOrder,
  canMoveUp,
  canMoveDown,
}: AdminSortOrderControlsProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleMove = (direction: SortDirection) => {
    setServerError(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/admin/learning-entities", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityType,
          entityId,
          direction,
        }),
      });

      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(payload.error?.message ?? "Không thể cập nhật thứ tự lúc này.");
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          Sort order: {sortOrder}
        </span>
        <AdminButton
          size="sm"
          variant="subtle"
          disabled={isPending || !canMoveUp}
          onClick={() => handleMove("UP")}
        >
          Lên
        </AdminButton>
        <AdminButton
          size="sm"
          variant="subtle"
          disabled={isPending || !canMoveDown}
          onClick={() => handleMove("DOWN")}
        >
          Xuống
        </AdminButton>
      </div>

      {serverError ? <p className="text-xs text-rose-600">{serverError}</p> : null}
    </div>
  );
}
