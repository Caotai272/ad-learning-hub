import Link from "next/link";

import { auth } from "@/auth";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicButtonClassName } from "@/components/ui/public-button";
import { getLevelLabel, getPlatformLabel } from "@/lib/learning";
import { getStudentPracticeOverview, listPracticeScenarios } from "@/modules/practice/practice.service";

export default async function PracticeHubPage() {
  const session = await auth();
  const scenarios = listPracticeScenarios();
  const overview = session?.user?.id ? await getStudentPracticeOverview(session.user.id) : null;
  const scenarioPerformanceBySlug = new Map(
    (overview?.scenarios ?? []).map((scenario) => [scenario.scenarioSlug, scenario]),
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-800">
            Practice Hub
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Simulator cho Ads Learning Hub
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Đây là trung tâm luyện scenario theo tình huống ads thực tế. Bạn có thể đọc dữ liệu,
            chọn action ưu tiên, nộp đáp án và lưu lại toàn bộ lịch sử practice vào dashboard
            student.
          </p>

          {overview ? (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Simulator attempts",
                  value: overview.totalAttempts.toString(),
                },
                {
                  label: "Pass rate",
                  value: `${overview.passRate}%`,
                },
                {
                  label: "Scenario đã chạm",
                  value: `${overview.activeScenarioCount}/${scenarios.length}`,
                },
              ].map((item) => (
                <article
                  key={item.label}
                  className="rounded-[1.25rem] border border-slate-200 bg-white/80 px-5 py-5"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-white/80 px-6 py-5">
              <p className="text-sm leading-7 text-slate-600">
                Đăng nhập để lưu điểm, xem pass rate theo scenario và đồng bộ lịch sử practice với
                dashboard student.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/login" className={getPublicButtonClassName()}>
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className={getPublicButtonClassName({ variant: "secondary" })}
                >
                  Tạo tài khoản
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-6 py-10 md:grid-cols-3">
          {scenarios.map((scenario) => {
            const performance = scenarioPerformanceBySlug.get(scenario.slug);

            return (
              <article
                key={scenario.id}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {getPlatformLabel(scenario.platform)}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {getLevelLabel(scenario.difficulty)}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {scenario.durationMinutes} phút
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-slate-950">{scenario.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{scenario.summary}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {scenario.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Phù hợp cho</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{scenario.recommendedFor}</p>
                </div>

                {performance && performance.attemptCount > 0 ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1rem] border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        Attempt
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {performance.attemptCount}
                      </p>
                    </div>
                    <div className="rounded-[1rem] border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        Best
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {performance.bestScore}
                      </p>
                    </div>
                    <div className="rounded-[1rem] border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        Pass rate
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {performance.passRate}%
                      </p>
                    </div>
                  </div>
                ) : null}

                <Link
                  href={`/practice/${scenario.slug}`}
                  className={`mt-6 ${getPublicButtonClassName()}`}
                >
                  {performance?.attemptCount ? "Tiếp tục luyện" : "Mở simulator"}
                </Link>
              </article>
            );
          })}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
