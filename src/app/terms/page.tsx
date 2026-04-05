import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description:
    "Điều khoản sử dụng của Ads Learning Hub cho website, lesson, quiz, simulator và khu admin.",
};

const sections = [
  {
    title: "1. Chấp nhận điều khoản",
    body: "Khi truy cập và sử dụng Ads Learning Hub, người dùng đồng ý tuân thủ các điều khoản vận hành hiện hành của hệ thống.",
  },
  {
    title: "2. Tài khoản và bảo mật",
    body: "Người dùng chịu trách nhiệm bảo mật thông tin đăng nhập của mình. Mọi hành vi truy cập trái phép vào khu dashboard hoặc admin đều bị xem là vi phạm nghiêm trọng.",
  },
  {
    title: "3. Nội dung học tập",
    body: "Lesson, quiz, simulator và các tài liệu liên quan được cung cấp nhằm mục đích đào tạo và tham khảo nghiệp vụ ads. Người dùng không được sao chép hoặc phát tán lại toàn bộ nội dung khi chưa có chấp thuận phù hợp.",
  },
  {
    title: "4. Quy tắc sử dụng practice hub",
    body: "Practice hub và simulator được xây dựng để hỗ trợ người học rèn kỹ năng đọc dữ liệu, reasoning và ra quyết định. Kết quả practice không phải là chứng chỉ nghề nghiệp hoặc cam kết hiệu quả kinh doanh thực tế.",
  },
  {
    title: "5. Quyền vận hành của hệ thống",
    body: "Ads Learning Hub có quyền điều chỉnh lesson, quiz, simulator, publish status, route truy cập hoặc nội dung admin nhằm duy trì chất lượng vận hành và an toàn hệ thống.",
  },
  {
    title: "6. Giới hạn trách nhiệm",
    body: "Hệ thống được cung cấp theo mô hình phần mềm giáo dục. Dự án không chịu trách nhiệm cho các quyết định media buying, ngân sách hoặc doanh thu phát sinh trực tiếp từ việc áp dụng nội dung học tập vào tài khoản thực tế của người dùng.",
  },
  {
    title: "7. Cập nhật điều khoản",
    body: "Điều khoản có thể được cập nhật trước khi launch staging hoặc production. Phiên bản hiển thị trên website là phiên bản có hiệu lực mới nhất trong phạm vi MVP hiện tại.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <span className="inline-flex rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-700">
            Legal
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Điều khoản sử dụng
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Văn bản này mô tả các nguyên tắc sử dụng website, lesson, quiz, practice hub, simulator
            và khu vực quản trị của Ads Learning Hub.
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
