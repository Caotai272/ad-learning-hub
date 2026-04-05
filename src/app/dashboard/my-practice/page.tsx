import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { PracticeHistoryPanel } from "@/components/practice/practice-history-panel";
import { formatDateTime } from "@/lib/format";
import { getStudentPracticeOverview } from "@/modules/practice/practice.service";
import { listStudentPracticeHistory } from "@/modules/student-learning/student-learning.service";

export default async function DashboardPracticePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [practiceOverview, attempts] = await Promise.all([
    getStudentPracticeOverview(session.user.id),
    listStudentPracticeHistory(session.user.id),
  ]);
  const passedAttemptCount = attempts.filter((attempt) => attempt.passed).length;
  const averageScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)
      : 0;
  const passRate = attempts.length > 0 ? Math.round((passedAttemptCount / attempts.length) * 100) : 0;
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((attempt) => attempt.score)) : 0;
  const scoreBands = [
    {
      label: "0-49",
      count: attempts.filter((attempt) => attempt.score < 50).length,
    },
    {
      label: "50-69",
      count: attempts.filter((attempt) => attempt.score >= 50 && attempt.score < 70).length,
    },
    {
      label: "70-84",
      count: attempts.filter((attempt) => attempt.score >= 70 && attempt.score < 85).length,
    },
    {
      label: "85-100",
      count: attempts.filter((attempt) => attempt.score >= 85).length,
    },
  ];

  return (
    <div className="space-y-6">
      <PracticeHistoryPanel overview={practiceOverview} />

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Quiz analytics</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Bên cạnh practice hub, dashboard này vẫn tổng hợp quiz attempts để bạn theo dõi nhịp
            luyện tập, tỷ lệ đạt và chất lượng điểm theo thời gian.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Pass rate</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{passRate}%</p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Điểm cao nhất</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{bestScore}</p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Điểm trung bình</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{averageScore}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-950">Phổ điểm quiz</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Phân bố score giúp bạn nhìn nhanh chất lượng attempts thay vì chỉ đọc từng bài riêng
            lẻ.
          </p>

          <div className="mt-5 space-y-4">
            {scoreBands.map((band, index) => {
              const width = Math.max(
                attempts.length > 0 ? Math.round((band.count / attempts.length) * 100) : 0,
                band.count > 0 ? 12 : 0,
              );
              const tones = ["bg-slate-300", "bg-slate-500", "bg-slate-700", "bg-slate-900"];

              return (
                <div key={band.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-slate-700">{band.label}</span>
                    <span className="text-slate-500">{band.count} attempt</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${tones[index]}`} style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Tổng lượt luyện tập",
            value: attempts.length.toString(),
            note: "Tổng số quiz attempts đã được chấm điểm.",
          },
          {
            label: "Lượt đạt",
            value: passedAttemptCount.toString(),
            note: "Số attempts có điểm bằng hoặc vượt passing score.",
          },
          {
            label: "Điểm trung bình",
            value: attempts.length > 0 ? `${averageScore}` : "0",
            note: "Điểm trung bình của toàn bộ quiz attempts đã lưu.",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
            <p className="mt-3 text-sm leading-6 text-slate-500">{item.note}</p>
          </article>
        ))}
      </section>

      {attempts.length > 0 ? (
        <section className="grid gap-4">
          {attempts.map((attempt) => (
            <article
              key={attempt.id}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm text-slate-500">{attempt.quiz.course.title}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">{attempt.quiz.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>Nộp lúc: {formatDateTime(attempt.submittedAt)}</span>
                    <span>Passing score: {attempt.quiz.passingScore}</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    Điểm gần nhất: {attempt.score} / 100 {attempt.passed ? "(Đạt)" : "(Chưa đạt)"}.
                  </p>
                </div>

                <div className="w-full max-w-sm rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">Trạng thái</p>
                  <p
                    className={`mt-2 text-2xl font-semibold ${
                      attempt.passed ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {attempt.passed ? "Đạt" : "Chưa đạt"}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.14em] text-slate-500">
                      <span>Score</span>
                      <span>{attempt.score}/100</span>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="absolute inset-y-0 z-10 w-px bg-slate-900/40"
                        style={{ left: `${attempt.quiz.passingScore}%` }}
                      />
                      <div
                        className={`h-full rounded-full ${
                          attempt.passed ? "bg-emerald-600" : "bg-amber-500"
                        }`}
                        style={{ width: `${attempt.score}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                      <span>Mốc đạt: {attempt.quiz.passingScore}</span>
                      <span>{attempt.passed ? "Vượt mốc" : "Chưa chạm mốc"}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      {
                        label: "Passing score",
                        value: attempt.quiz.passingScore,
                        tone: "bg-slate-400",
                      },
                      {
                        label: "Lần này",
                        value: attempt.score,
                        tone: attempt.passed ? "bg-emerald-600" : "bg-amber-500",
                      },
                    ].map((item) => (
                      <div
                        key={`${attempt.id}-${item.label}`}
                        className="rounded-[1rem] border border-slate-200 bg-white px-3 py-3"
                      >
                        <div className="flex h-16 items-end justify-center">
                          <div
                            className={`w-8 rounded-full ${item.tone}`}
                            style={{ height: `${Math.max(Math.min(item.value, 100), 12)}%` }}
                          />
                        </div>
                        <p className="mt-2 text-center text-xs font-medium text-slate-700">
                          {item.value}
                        </p>
                        <p className="mt-1 text-center text-[11px] text-slate-500">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/courses/${attempt.quiz.course.slug}/quizzes/${attempt.quiz.slug}`}
                    className="mt-5 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-4"
                  >
                    Mở lại quiz
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <DashboardEmptyState
          eyebrow="Chưa có lịch sử quiz"
          title="Bạn chưa nộp quiz nào"
          description="Hãy vào một course và làm quiz đầu tiên để hệ thống bắt đầu dựng thống kê theo score, pass rate và lịch sử luyện tập."
          actionHref="/courses"
          actionLabel="Xem khóa học"
          hint="Song song với quiz, bạn cũng có thể vào practice hub để luyện simulator scenario theo tình huống ads thực tế."
        />
      )}
    </div>
  );
}
