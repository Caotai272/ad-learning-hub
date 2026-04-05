import Link from "next/link";

import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { formatDateTime } from "@/lib/format";
import { getAdminDashboardOverview } from "@/modules/admin/admin.service";

export default async function AdminDashboardPage() {
  const overview = await getAdminDashboardOverview();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Học viên",
            value: overview.studentCount.toString(),
            note: "Tổng số tài khoản student đang có trong hệ thống.",
          },
          {
            label: "Nội dung public",
            value: overview.publishedContentCount.toString(),
            note: "Tổng learning paths, courses, modules, lessons, quizzes đang Published.",
          },
          {
            label: "Nội dung Draft",
            value: overview.draftContentCount.toString(),
            note: "Những item đang chờ publish hoặc đang chỉnh sửa.",
          },
          {
            label: "Quiz attempts",
            value: overview.quizAttemptCount.toString(),
            note: "Tổng attempts đã phát sinh từ student flow.",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5"
          >
            <p className="text-sm text-amber-800">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Tổng quan vận hành</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Snapshot này lấy trực tiếp từ data production của learning flow và content schema.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/content"
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
              >
                Mở content workflow
              </Link>
              <Link
                href="/admin/learning"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Mở learning inventory
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Tổng content item",
                value: overview.totalContentCount.toString(),
              },
              {
                label: "Archived",
                value: overview.archivedContentCount.toString(),
              },
              {
                label: "Enrollment",
                value: overview.enrollmentCount.toString(),
              },
              {
                label: "Lesson hoàn thành",
                value: overview.completedLessonProgressCount.toString(),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Inventory theo loại</h2>
          <div className="mt-5 space-y-4">
            {overview.inventory.map((item) => {
              const publishedPercent =
                item.count > 0 ? Math.round((item.publishedCount / item.count) * 100) : 0;

              return (
                <div key={item.entityType} className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="text-slate-500">
                      {item.publishedCount}/{item.count} published
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${publishedPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Cập nhật gần nhất</h2>
          <div className="mt-5 grid gap-3">
            {overview.recentlyUpdated.map((item) => (
              <div
                key={`${item.entityType}-${item.id}`}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {item.entityLabel}
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.subtitle}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Cập nhật: {formatDateTime(item.updatedAt)}
                    </p>
                  </div>
                  <AdminStatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Publish gần nhất</h2>
          <div className="mt-5 grid gap-3">
            {overview.recentlyPublished.length > 0 ? (
              overview.recentlyPublished.map((item) => (
                <div
                  key={`${item.entityType}-${item.id}`}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {item.entityLabel}
                      </p>
                      <p className="mt-2 text-base font-semibold text-slate-950">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{item.subtitle}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        Publish: {formatDateTime(item.publishedAt)}
                      </p>
                    </div>
                    <AdminStatusBadge status={item.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-5">
                <p className="text-sm leading-7 text-slate-600">
                  Chưa có item nào được publish trong inventory hiện tại.
                </p>
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
