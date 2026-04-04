export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Khóa học đang học", value: "0" },
          { label: "Quiz đã hoàn thành", value: "0" },
          { label: "Simulator đã thử", value: "0" },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Trạng thái Phase 1</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Dashboard shell đã sẵn sàng. Ở các phase tiếp theo, khu này sẽ nối với
          learning paths, progress tracking, quiz history và simulator sessions.
        </p>
      </section>
    </div>
  );
}
