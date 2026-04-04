export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Học viên", value: "0" },
          { label: "Nội dung public", value: "0" },
          { label: "Simulator draft", value: "0" },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5"
          >
            <p className="text-sm text-amber-800">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Trạng thái admin shell</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Admin routes đã được khóa theo role. Các route con như content, learning,
          practice, users và settings sẽ được nối dần khi bước sang phase CMS.
        </p>
      </section>
    </div>
  );
}
