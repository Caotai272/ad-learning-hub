"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    description: "Toàn cảnh vận hành nội dung và dữ liệu học tập.",
  },
  {
    href: "/admin/content",
    label: "Nội dung",
    description: "Editorial queue, publish workflow và trạng thái public.",
  },
  {
    href: "/admin/learning",
    label: "Learning",
    description: "Inventory của learning paths, courses, modules, lessons, quizzes.",
  },
  {
    href: "/admin/practice",
    label: "Practice",
    description: "Nhánh simulator và scoring hub ở giai đoạn sau.",
  },
  {
    href: "/admin/users",
    label: "Người dùng",
    description: "Quản lý student/admin sẽ mở rộng ở phase kế tiếp.",
  },
  {
    href: "/admin/settings",
    label: "Cài đặt",
    description: "System settings, storage và vận hành nội bộ.",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-amber-200 bg-amber-50 md:w-80 md:border-r md:border-b-0">
      <div className="flex flex-col gap-4 p-5">
        <div className="rounded-[1.5rem] border border-amber-200 bg-white px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Admin Area
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Khu vận hành dùng để kiểm soát trạng thái nội dung, cấu trúc learning và các nhánh CMS
            quan trọng của dự án.
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
                    ? "border-amber-300 bg-amber-100 text-slate-950 shadow-[0_16px_40px_rgba(180,83,9,0.12)]"
                    : "border-transparent bg-transparent text-slate-700 hover:border-amber-200 hover:bg-white",
                )}
              >
                <p className="text-sm font-semibold">{link.label}</p>
                <p className="mt-2 text-xs leading-6 text-slate-500">{link.description}</p>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
