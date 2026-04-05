import { AdminContentStatusControl } from "@/components/admin/admin-content-status-control";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { formatDateTime } from "@/lib/format";
import { getAdminContentWorkflow } from "@/modules/admin/admin.service";

export default async function AdminContentPage() {
  const workflow = await getAdminContentWorkflow();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Draft queue",
            value: workflow.draftCount.toString(),
            note: "Những item đang chờ rà soát, biên tập hoặc publish.",
          },
          {
            label: "Published",
            value: workflow.publishedCount.toString(),
            note: "Những item đã được mở trạng thái public trong hệ thống.",
          },
          {
            label: "Archived",
            value: workflow.archivedCount.toString(),
            note: "Nội dung đã dừng sử dụng nhưng vẫn cần lưu vết vận hành.",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Quy tắc content workflow</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Draft",
              text: "Dùng khi nội dung còn đang soạn, chưa muốn public hoặc cần quay lại chỉnh sửa.",
            },
            {
              title: "Published",
              text: "Chỉ nên dùng khi nội dung đã đủ điều kiện hiển thị ra student/public flow.",
            },
            {
              title: "Archived",
              text: "Dùng để khóa item cũ mà không cần xóa dữ liệu khỏi hệ thống.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <p className="text-sm font-semibold text-slate-950">{item.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {[
          {
            title: "Cần xử lý trước",
            description: "Queue ưu tiên để biên tập và publish.",
            items: workflow.draftQueue.slice(0, 12),
          },
          {
            title: "Đang public",
            description: "Những item hiện đã mở public.",
            items: workflow.publishedQueue.slice(0, 12),
          },
          {
            title: "Đã archive",
            description: "Những item đang bị khóa khỏi luồng dùng chính.",
            items: workflow.archivedQueue.slice(0, 12),
          },
        ].map((column) => (
          <article
            key={column.title}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-slate-950">{column.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{column.description}</p>

            <div className="mt-5 grid gap-4">
              {column.items.length > 0 ? (
                column.items.map((item) => (
                  <div
                    key={`${column.title}-${item.entityType}-${item.id}`}
                    className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                            {item.entityLabel}
                          </p>
                          <h3 className="mt-2 text-base font-semibold text-slate-950">
                            {item.title}
                          </h3>
                        </div>
                        <AdminStatusBadge status={item.status} />
                      </div>

                      <p className="text-sm leading-7 text-slate-600">{item.subtitle}</p>

                      <div className="grid gap-2 text-xs text-slate-500">
                        <p>Cập nhật: {formatDateTime(item.updatedAt)}</p>
                        <p>
                          Publish:
                          {" "}
                          {item.publishedAt ? formatDateTime(item.publishedAt) : "Chưa publish"}
                        </p>
                      </div>

                      <AdminContentStatusControl
                        entityType={item.entityType}
                        entityId={item.id}
                        currentStatus={item.status}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-5">
                  <p className="text-sm leading-7 text-slate-600">
                    Chưa có item nào trong nhóm trạng thái này.
                  </p>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
