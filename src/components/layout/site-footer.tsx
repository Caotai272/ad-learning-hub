import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "Giới thiệu" },
  { href: "/pricing", label: "Bảng giá" },
  { href: "/practice", label: "Practice hub" },
  { href: "/glossary", label: "Glossary" },
  { href: "/privacy", label: "Chính sách bảo mật" },
  { href: "/terms", label: "Điều khoản sử dụng" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p>Ads Learning Hub - Nền tảng học ads bằng tiếng Việt.</p>
          <p>Giai đoạn 8 mở rộng trải nghiệm học với glossary và bookmarks sau MVP.</p>
        </div>

        <nav className="flex flex-wrap gap-4">
          {footerLinks.map((item) => (
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
    </footer>
  );
}
