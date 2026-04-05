import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { StudentSignOutButton } from "@/components/dashboard/student-sign-out-button";

export default async function DashboardSettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const profileHealthScore = [session.user.name, session.user.email].filter(Boolean).length * 50;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Cài đặt tài khoản</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Quản lý thông tin truy cập, đổi mật khẩu và kiểm soát trạng thái phiên làm việc của bạn.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-950">Thông tin hiện tại</h3>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              Hồ sơ {profileHealthScore}%
            </span>
          </div>

          <dl className="mt-5 grid gap-4 text-sm text-slate-600">
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <dt className="text-slate-500">Họ tên</dt>
              <dd className="mt-2 font-semibold text-slate-950">
                {session.user.name ?? "Chưa cập nhật"}
              </dd>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <dt className="text-slate-500">Email</dt>
              <dd className="mt-2 font-semibold text-slate-950">{session.user.email}</dd>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <dt className="text-slate-500">Vai trò</dt>
              <dd className="mt-2 font-semibold text-slate-950">{session.user.role}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">Mức độ hoàn thiện hồ sơ</span>
              <span className="font-semibold text-slate-950">{profileHealthScore}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-slate-900"
                style={{ width: `${profileHealthScore}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {[
              {
                title: "Email đăng nhập",
                text: "Đang là định danh chính để truy cập và nhận luồng đặt lại mật khẩu.",
              },
              {
                title: "Đổi mật khẩu",
                text: "Có thể thực hiện trực tiếp trong dashboard sau khi xác nhận mật khẩu hiện tại.",
              },
              {
                title: "Forgot password",
                text: "Luồng đặt lại mật khẩu đã sẵn sàng ở màn hình đăng nhập khi bạn quên mật khẩu.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4"
              >
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-950">Quản lý phiên làm việc</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Khi dùng máy dùng chung, bạn nên đăng xuất sau khi hoàn thành lesson hoặc quiz.
            </p>
            <div className="mt-4">
              <StudentSignOutButton />
            </div>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-950">Đổi mật khẩu</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Dùng mật khẩu hiện tại để xác nhận quyền sở hữu tài khoản trước khi cập nhật mật khẩu
            mới. Nếu quên mật khẩu, bạn cũng có thể dùng luồng đặt lại mật khẩu từ trang đăng nhập.
          </p>
          <div className="mt-6">
            <ChangePasswordForm />
          </div>
        </article>
      </section>
    </div>
  );
}
