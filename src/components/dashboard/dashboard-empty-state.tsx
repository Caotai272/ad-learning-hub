import Link from "next/link";
import type { ReactNode } from "react";

type DashboardEmptyStateProps = Readonly<{
  eyebrow?: string;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  hint?: string;
  children?: ReactNode;
}>;

export function DashboardEmptyState({
  eyebrow = "Sẵn sàng bắt đầu",
  title,
  description,
  actionHref,
  actionLabel,
  hint,
  children,
}: DashboardEmptyStateProps) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.14),transparent_36%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {eyebrow}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[72, 46, 88].map((height, index) => (
              <div
                key={index}
                className="flex h-24 w-16 items-end rounded-[1.25rem] border border-slate-200 bg-white/80 p-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
              >
                <div
                  className="w-full rounded-full bg-slate-900"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {["Dashboard theo tiến độ", "Giao diện tiếng Việt", "Không cần thiết lập thêm"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
            {hint ? <p className="text-sm leading-7 text-slate-600">{hint}</p> : null}
          </div>

          <Link
            href={actionHref}
            className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {actionLabel}
          </Link>
        </div>

        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
