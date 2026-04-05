import Link from "next/link";

import { auth } from "@/auth";
import { PricingPlanActivateButton } from "@/components/pricing/pricing-plan-activate-button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { listPublishedCourses } from "@/modules/courses/course.service";

export default async function PricingPage() {
  const session = await auth();
  const courses = await listPublishedCourses();

  const starterCourses = courses.filter((course) => course.level === "BEGINNER");
  const growthCourses = courses.filter(
    (course) => course.level === "BEGINNER" || course.level === "INTERMEDIATE",
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <span className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-800">
            Pricing & Enrollment
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Kích hoạt gói học và đưa course vào dashboard
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Ở giai đoạn hiện tại, hệ thống đã có self-serve enrollment flow. Khi kích hoạt gói, các
            course phù hợp sẽ được đưa thẳng vào dashboard học của bạn.
          </p>
        </section>

        <section className="grid gap-6 py-10 xl:grid-cols-3">
          {[
            {
              code: "STARTER" as const,
              title: "Starter",
              price: "299.000đ",
              description: "Dành cho người mới, tập trung vào các course Cơ bản để vào nghề chắc.",
              courseCount: starterCourses.length,
              highlights: [
                "Toàn bộ course Cơ bản đang publish",
                "Dashboard progress theo lesson và quiz",
                "Phù hợp để làm quen CTR, CPM, CPC, Conversion foundation",
              ],
            },
            {
              code: "GROWTH" as const,
              title: "Growth",
              price: "699.000đ",
              description: "Mở rộng thêm các course Trung cấp để tăng tốc nhịp học và thực hành.",
              courseCount: growthCourses.length,
              highlights: [
                "Bao gồm toàn bộ Starter",
                "Mở thêm nhóm course Trung cấp",
                "Hợp cho người đang cần tối ưu campaign và ROAS workflow",
              ],
            },
            {
              code: "LIBRARY" as const,
              title: "Library",
              price: "1.290.000đ",
              description: "Kích hoạt toàn bộ thư viện course đang publish trong hệ thống hiện tại.",
              courseCount: courses.length,
              highlights: [
                "Mở toàn bộ course hiện có",
                "Đi thẳng từ learning path sang course detail và dashboard",
                "Phù hợp cho team lead hoặc người muốn học full-stack ads",
              ],
            },
          ].map((plan) => (
            <article
              key={plan.code}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{plan.title}</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-950">{plan.price}</h2>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  {plan.courseCount} course
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">{plan.description}</p>

              <div className="mt-5 grid gap-3">
                {plan.highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                {session?.user?.id ? (
                  <PricingPlanActivateButton
                    planCode={plan.code}
                    label={`Kích hoạt gói ${plan.title}`}
                  />
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex w-full justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Đăng nhập để kích hoạt gói
                  </Link>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Luồng hiện tại</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              "Chọn gói phù hợp với mức độ học.",
              "Hệ thống tạo enrollment cho các course phù hợp và đưa vào dashboard.",
              "Bạn bắt đầu lesson hoặc quiz, progress sẽ được ghi ngay vào student area.",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <p className="text-sm font-semibold text-slate-950">Bước {index + 1}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
