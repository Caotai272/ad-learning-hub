import { getLevelLabel, getPlatformLabel } from "@/lib/learning";
import { getAdminPracticeOverview } from "@/modules/practice/practice.service";

export default async function AdminPracticePage() {
  const overview = await getAdminPracticeOverview();

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Quản lý practice</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Phase 6 hiện dùng scenario definitions trong code để chốt UX, logic chấm điểm và vòng dữ
          liệu học viên. Practice attempts đã được lưu về database để admin theo dõi mức độ sử
          dụng, pass rate và sức hút của từng scenario.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Scenario đang có", value: overview.totalScenarios },
          { label: "Practice attempts", value: overview.totalAttempts },
          { label: "Học viên đã luyện", value: overview.activeStudentCount },
          { label: "Pass rate", value: `${overview.passRate}%` },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-950">Hiệu suất theo scenario</h3>
          <div className="mt-5 grid gap-4">
            {overview.scenarios.map((scenario) => (
              <article
                key={scenario.scenarioSlug}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        {getPlatformLabel(scenario.platform)}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        {getLevelLabel(scenario.difficulty)}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        {scenario.questionCount} câu hỏi
                      </span>
                    </div>

                    <h4 className="mt-4 text-lg font-semibold text-slate-950">
                      {scenario.scenarioTitle}
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{scenario.recommendedFor}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {scenario.tags.map((tag) => (
                        <span
                          key={`${scenario.scenarioSlug}-${tag}`}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid w-full max-w-sm gap-3 sm:grid-cols-2">
                    {[
                      {
                        label: "Attempts",
                        value: scenario.attemptCount,
                      },
                      {
                        label: "Pass rate",
                        value: `${scenario.passRate}%`,
                      },
                      {
                        label: "Average",
                        value: scenario.averageScore,
                      },
                      {
                        label: "Best",
                        value: scenario.bestScore,
                      },
                    ].map((item) => (
                      <div
                        key={`${scenario.scenarioSlug}-${item.label}`}
                        className="rounded-[1rem] border border-slate-200 bg-white px-4 py-4"
                      >
                        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-950">Attempt gần đây</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Dùng khối này để kiểm tra chất lượng usage thực tế trước khi mở nhánh CMS/editor cho
            practice ở phase sau.
          </p>

          {overview.recentAttempts.length > 0 ? (
            <div className="mt-5 space-y-3">
              {overview.recentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{attempt.scenarioTitle}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {attempt.user.name} · {attempt.user.email}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(attempt.submittedAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        Score: {attempt.score}
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          attempt.passed
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {attempt.passed ? "Đạt" : "Chưa đạt"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-sm leading-7 text-slate-500">
              Chưa có practice attempt nào. Khi học viên bắt đầu làm simulator, admin sẽ thấy log
              usage, score và pass status ngay tại đây.
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
