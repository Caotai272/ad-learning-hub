import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicButtonClassName } from "@/components/ui/public-button";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <section className="glass-panel overflow-hidden rounded-[2rem]">
          <div className="grid gap-10 px-8 py-12 md:grid-cols-[1.2fr_0.8fr] md:px-12 md:py-16">
            <div className="space-y-6">
              <div className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-800">
                Giai đoạn 1 đang được triển khai
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">
                  Học ads bằng tiếng Việt, giữ nguyên toàn bộ thuật ngữ của ngành.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Đây là bộ khung kỹ thuật đầu tiên của Ads Learning Hub. Dự án đang dựng nền cho
                  public site, xác thực người dùng, dashboard học viên, admin area và lớp dữ liệu
                  với PostgreSQL + Prisma.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/learning-paths" className={getPublicButtonClassName()}>
                  Xem lộ trình học
                </Link>
                <Link
                  href="/courses"
                  className={getPublicButtonClassName({ variant: "secondary" })}
                >
                  Xem khóa học
                </Link>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/register" className={getPublicButtonClassName()}>
                  Tạo tài khoản học thử
                </Link>
                <Link
                  href="/login"
                  className={getPublicButtonClassName({ variant: "secondary" })}
                >
                  Đăng nhập hệ thống
                </Link>
              </div>
            </div>

            <div className="grid gap-4 self-start">
              {[
                "Next.js App Router + TypeScript",
                "Auth.js credentials foundation",
                "PostgreSQL + Prisma schema",
                "Dashboard và Admin shell",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-[0_12px_30px_rgba(17,33,53,0.07)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 py-10 md:grid-cols-3">
          {[
            {
              title: "Learning paths",
              text: "Route /learning-paths và /learning-paths/[slug] đã đọc dữ liệu thật từ PostgreSQL qua Prisma.",
            },
            {
              title: "Course catalog",
              text: "Listing và detail của courses hiện đã đọc module, lesson và quiz theo trạng thái publish.",
            },
            {
              title: "Lesson + Quiz reader",
              text: "Lesson page đọc LessonBlock, còn quiz page đọc QuizQuestion và QuizChoice từ database seeded.",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]"
            >
              <h2 className="text-xl font-semibold text-slate-950">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
