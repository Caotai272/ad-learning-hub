import Link from "next/link";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { getPublicButtonClassName } from "@/components/ui/public-button";
import { getLevelLabel, getPlatformLabel } from "@/lib/learning";
import type { StudentPracticeOverview } from "@/modules/practice/practice.types";

type PracticeHistoryPanelProps = {
  overview: StudentPracticeOverview;
};

export function PracticeHistoryPanel({ overview }: PracticeHistoryPanelProps) {
  if (overview.totalAttempts === 0) {
    return (
      <DashboardEmptyState
        eyebrow="Practice hub"
        title="Bạn chưa có practice attempt nào"
        description="Phase 6 đã sẵn practice hub và simulator scenario. Hãy bắt đầu một case đầu tiên để hệ thống lưu điểm, pass rate và tín hiệu tiến bộ theo từng scenario."
        actionHref="/practice"
        actionLabel="Mở practice hub"
        hint="Mỗi simulator được thiết kế theo tình huống ads thực tế, tập trung vào kỹ năng đọc số liệu, chọn action ưu tiên và review reasoning sau khi nộp."
      />
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <h3 className="text-xl font-semibold text-slate-950">Practice hub analytics</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Khu này theo dõi riêng phần simulator của Phase 6: số lần luyện tập, pass rate, độ phủ
            scenario và mức tiến bộ của bạn theo từng case.
          </p>
        </div>

        <Link href="/practice" className={getPublicButtonClassName()}>
          Mở practice hub
        </Link>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Simulator attempts",
            value: overview.totalAttempts.toString(),
            note: "Tổng số lượt nộp scenario đã được lưu về hệ thống.",
          },
          {
            label: "Pass rate",
            value: `${overview.passRate}%`,
            note: "Tỷ lệ attempt đạt mốc passing score của từng scenario.",
          },
          {
            label: "Điểm trung bình",
            value: overview.averageScore.toString(),
            note: "Mức điểm chung của toàn bộ practice attempts.",
          },
          {
            label: "Scenario đã chạm",
            value: `${overview.activeScenarioCount}/${overview.scenarios.length}`,
            note: "Số scenario bạn đã có ít nhất một attempt.",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <h4 className="text-lg font-semibold text-slate-950">Mức độ làm chủ theo scenario</h4>
          <div className="mt-4 space-y-4">
            {overview.scenarios
              .filter((scenario) => scenario.attemptCount > 0)
              .slice(0, 6)
              .map((scenario) => (
                <div key={scenario.scenarioSlug} className="space-y-2">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{scenario.scenarioTitle}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {getPlatformLabel(scenario.platform)} · {getLevelLabel(scenario.difficulty)} ·{" "}
                        {scenario.attemptCount} attempt
                      </p>
                    </div>
                    <div className="text-sm text-slate-500">
                      Best score:{" "}
                      <span className="font-semibold text-slate-900">{scenario.bestScore}</span>
                    </div>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${Math.max(scenario.averageScore, 6)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                    <span>Average score: {scenario.averageScore}</span>
                    <span>Pass rate: {scenario.passRate}%</span>
                  </div>
                </div>
              ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
          <h4 className="text-lg font-semibold text-slate-950">Attempt gần đây</h4>
          <div className="mt-4 space-y-3">
            {overview.attempts.map((attempt) => (
              <div
                key={attempt.id}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{attempt.scenarioTitle}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(attempt.submittedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-slate-950">{attempt.score}</p>
                    <p
                      className={`text-xs font-semibold ${
                        attempt.passed ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      {attempt.passed ? "Đạt" : "Chưa đạt"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
