import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getStudentDashboardOverview } from "@/modules/student-learning/student-learning.service";

export default async function DashboardOverviewPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const overview = await getStudentDashboardOverview(session.user.id);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Khóa học đang học", value: overview.activeCourseCount.toString() },
          { label: "Lesson đã hoàn thành", value: overview.completedLessonCount.toString() },
          { label: "Quiz đã nộp", value: overview.completedQuizCount.toString() },
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

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Tiếp tục học</h2>
          {overview.continueLearning ? (
            <>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Bạn đang ở mức {overview.continueLearning.progressPercent}% của khóa học{" "}
                <span className="font-semibold text-slate-900">
                  {overview.continueLearning.courseTitle}
                </span>
                .
              </p>
              {overview.continueLearning.nextAction ? (
                <Link
                  href={overview.continueLearning.nextAction.href}
                  className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {overview.continueLearning.nextAction.type === "lesson"
                    ? `Học tiếp: ${overview.continueLearning.nextAction.title}`
                    : `Làm quiz: ${overview.continueLearning.nextAction.title}`}
                </Link>
              ) : (
                <p className="mt-5 text-sm font-medium text-emerald-700">
                  Bạn đã hoàn thành toàn bộ các bước học hiện có.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Bạn chưa có tiến độ học nào được lưu. Hãy vào một course và bắt đầu lesson đầu
                tiên để dashboard tự động tạo lộ trình học của bạn.
              </p>
              <Link
                href="/courses"
                className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Xem danh sách khóa học
              </Link>
            </>
          )}
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Hoạt động gần nhất</h2>
          {overview.latestActivity ? (
            <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-sm text-slate-500">{overview.latestActivity.courseTitle}</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {overview.latestActivity.lessonTitle}
              </p>
              <Link
                href={overview.latestActivity.lessonHref}
                className="mt-4 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-4"
              >
                Mở lại lesson
              </Link>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Chưa có hoạt động học nào được lưu trong tài khoản của bạn.
            </p>
          )}
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-950">Khóa học của bạn</h2>
          <Link
            href="/dashboard/my-courses"
            className="text-sm font-semibold text-slate-900 underline underline-offset-4"
          >
            Xem tất cả
          </Link>
        </div>

        {overview.courses.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overview.courses.slice(0, 3).map((course) => (
              <article
                key={course.enrollmentId}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <p className="text-sm text-slate-500">{course.course.learningPathTitles.join(", ")}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{course.course.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{course.progressPercent}% hoàn thành</p>
                {course.nextAction ? (
                  <Link
                    href={course.nextAction.href}
                    className="mt-4 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-4"
                  >
                    {course.nextAction.type === "lesson" ? "Học tiếp" : "Làm quiz"}
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Khi bạn hoàn thành lesson hoặc nộp quiz đầu tiên, các course đã học sẽ xuất hiện tại
            đây.
          </p>
        )}
      </section>
    </div>
  );
}
