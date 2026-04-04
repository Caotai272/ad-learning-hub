import { redirect } from "next/navigation";

import { auth } from "@/auth";
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
    <div className="min-h-screen bg-slate-100/80">
      <div className="container-shell py-8">
        <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white px-6 py-5 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Xin chào {session.user.name ?? session.user.email}
          </h1>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(17,33,53,0.06)] md:flex">
          <DashboardSidebar />
          <div className="flex-1 p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
