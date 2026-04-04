import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { isAdmin } from "@/server/permissions";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!isAdmin(session.user.role)) {
    redirect("/dashboard/overview");
  }

  return (
    <div className="min-h-screen bg-amber-50/70">
      <div className="container-shell py-8">
        <div className="mb-6 rounded-[1.75rem] border border-amber-200 bg-white px-6 py-5 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
          <p className="text-sm uppercase tracking-[0.18em] text-amber-700">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Khu vận hành nội dung và hệ thống
          </h1>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white shadow-[0_18px_50px_rgba(17,33,53,0.06)] md:flex">
          <AdminSidebar />
          <div className="flex-1 p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
