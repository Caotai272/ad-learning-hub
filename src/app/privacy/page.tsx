import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description:
    "Chính sách bảo mật của Ads Learning Hub dành cho người dùng Việt Nam, mô tả cách thu thập, sử dụng và bảo vệ dữ liệu.",
};

const sections = [
  {
    title: "1. Phạm vi áp dụng",
    body: "Chính sách này áp dụng cho toàn bộ website Ads Learning Hub, bao gồm khu public, dashboard học viên, practice hub và khu admin nội bộ.",
  },
  {
    title: "2. Dữ liệu được thu thập",
    body: "Hệ thống có thể lưu các nhóm dữ liệu như họ tên, email, lịch sử đăng nhập, enrollments, lesson progress, quiz attempts, practice attempts và các tín hiệu sử dụng cần thiết để vận hành sản phẩm.",
  },
  {
    title: "3. Mục đích sử dụng dữ liệu",
    body: "Dữ liệu được dùng để xác thực tài khoản, ghi nhận tiến độ học tập, chấm điểm quiz và simulator, hỗ trợ vận hành admin, cải thiện chất lượng nội dung và xử lý sự cố hệ thống.",
  },
  {
    title: "4. Chia sẻ dữ liệu",
    body: "Ads Learning Hub không bán dữ liệu cá nhân của người dùng. Dữ liệu chỉ được chia sẻ trong phạm vi nhà cung cấp hạ tầng, dịch vụ xác thực hoặc các công cụ vận hành cần thiết cho việc duy trì sản phẩm.",
  },
  {
    title: "5. Bảo mật dữ liệu",
    body: "Hệ thống áp dụng các lớp bảo vệ ở mức ứng dụng và database phù hợp với MVP, bao gồm route protection, role-based access và giới hạn truy cập khu admin.",
  },
  {
    title: "6. Quyền của người dùng",
    body: "Người dùng có thể yêu cầu cập nhật thông tin tài khoản, đổi mật khẩu hoặc đề nghị hỗ trợ xử lý dữ liệu cá nhân thông qua kênh hỗ trợ chính thức của dự án.",
  },
  {
    title: "7. Cập nhật chính sách",
    body: "Chính sách này có thể được cập nhật khi sản phẩm bước vào staging hoặc production. Mọi thay đổi lớn cần được phản ánh lại trên website trước khi launch chính thức.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <span className="inline-flex rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-700">
            Legal
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Chính sách bảo mật
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Văn bản này mô tả cách Ads Learning Hub thu thập, sử dụng và bảo vệ dữ liệu khi người
            dùng truy cập website, học lesson, làm quiz và thực hành simulator.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]"
            >
              <h2 className="text-2xl font-semibold text-slate-950">{section.title}</h2>
              <p className="mt-3 text-sm leading-8 text-slate-600">{section.body}</p>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
