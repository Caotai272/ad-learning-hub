import Link from "next/link";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/content", label: "Nội dung" },
  { href: "/admin/learning", label: "Learning" },
  { href: "/admin/practice", label: "Practice" },
  { href: "/admin/users", label: "Người dùng" },
  { href: "/admin/settings", label: "Cài đặt" },
];

export function AdminSidebar() {
  return (
    <aside className="w-full border-b border-amber-200 bg-amber-50 md:w-72 md:border-r md:border-b-0">
      <div className="flex flex-col gap-2 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Admin Area
        </h2>

        <nav className="grid gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
