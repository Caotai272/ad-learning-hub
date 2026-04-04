import Link from "next/link";

const links = [
  { href: "/dashboard/overview", label: "Tổng quan" },
  { href: "/dashboard/my-courses", label: "Khóa học của tôi" },
  { href: "/dashboard/my-practice", label: "Khu thực hành" },
  { href: "/dashboard/settings", label: "Cài đặt" },
];

export function DashboardSidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white md:w-72 md:border-r md:border-b-0">
      <div className="flex flex-col gap-2 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Student Area
        </h2>

        <nav className="grid gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
