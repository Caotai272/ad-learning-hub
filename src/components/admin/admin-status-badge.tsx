import type { ContentStatus } from "@prisma/client";

import { getContentStatusLabel } from "@/lib/learning";
import { cn } from "@/lib/utils";

type AdminStatusBadgeProps = {
  status: ContentStatus;
};

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        status === "PUBLISHED" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        status === "DRAFT" && "border-amber-200 bg-amber-50 text-amber-700",
        status === "ARCHIVED" && "border-slate-200 bg-slate-100 text-slate-600",
      )}
    >
      {getContentStatusLabel(status)}
    </span>
  );
}
