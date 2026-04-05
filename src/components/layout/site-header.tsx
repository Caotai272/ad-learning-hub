import Link from "next/link";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/learning-paths", label: "Lộ trình" },
  { href: "/courses", label: "Khóa học" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/pricing", label: "Bảng giá" },
  { href: "/login", label: "Đăng nhập" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Ads Learning Hub
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-slate-600 transition hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
