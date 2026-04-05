import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { StudentSignOutButton } from "@/components/dashboard/student-sign-out-button";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <div className="container-shell py-8">
        <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white px-6 py-5 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                Xin chào {session.user.name ?? session.user.email}
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Từ đây bạn có thể tiếp tục lesson, xem tiến độ course, theo dõi quiz attempts và
                quản lý bảo mật tài khoản.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                Vai trò: {session.user.role}
              </div>
              <StudentSignOutButton />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(17,33,53,0.06)] md:flex">
          <DashboardSidebar />
          <div className="flex-1 p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
