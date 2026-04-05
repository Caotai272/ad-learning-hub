"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  {
    href: "/dashboard/overview",
    label: "Tổng quan",
    description: "Nhịp học và hành động nên làm tiếp.",
  },
  {
    href: "/dashboard/my-courses",
    label: "Khóa học của tôi",
    description: "Tiến độ theo từng course và lộ trình tiếp theo.",
  },
  {
    href: "/dashboard/my-practice",
    label: "Khu thực hành",
    description: "Lịch sử quiz attempts và kết quả gần nhất.",
  },
  {
    href: "/dashboard/bookmarks",
    label: "Bookmarks",
    description: "Lesson và glossary term đã lưu để mở lại nhanh.",
  },
  {
    href: "/dashboard/settings",
    label: "Cài đặt",
    description: "Thông tin tài khoản và bảo mật.",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-200 bg-white md:w-80 md:border-r md:border-b-0">
      <div className="flex flex-col gap-4 p-5">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Student Area
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Theo dõi tiến độ học, quiz attempts, bookmarks và trạng thái tài khoản của bạn.
          </p>
        </div>

        <nav className="grid gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-[1.25rem] border px-4 py-4 transition",
                  isActive
                    ? "border-slate-900 bg-slate-950 text-white shadow-[0_16px_40px_rgba(17,33,53,0.18)]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <p className="text-sm font-semibold">{link.label}</p>
                <p
                  className={cn(
                    "mt-2 text-xs leading-6",
                    isActive ? "text-slate-300" : "text-slate-500",
                  )}
                >
                  {link.description}
                </p>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
