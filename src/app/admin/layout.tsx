import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { isAdmin } from "@/server/permissions";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!isAdmin(session.user.role)) {
    redirect("/dashboard/overview");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf0_0%,#f8fafc_100%)]">
      <div className="container-shell py-8">
        <div className="mb-6 rounded-[1.75rem] border border-amber-200 bg-white px-6 py-5 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-amber-700">Admin</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                Khu vận hành nội dung và hệ thống
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Từ đây bạn có thể kiểm soát inventory nội dung, publish workflow và các nhánh
                quản trị quan trọng của Ad Learning Hub.
              </p>
            </div>

            <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
              Vai trò: {session.user.role}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white shadow-[0_18px_50px_rgba(17,33,53,0.06)] md:flex">
          <AdminSidebar />
          <div className="flex-1 p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
