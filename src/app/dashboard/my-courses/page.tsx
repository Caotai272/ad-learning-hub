import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { formatDate } from "@/lib/format";
import { formatHours, getLevelLabel, getPlatformLabel } from "@/lib/learning";
import { listPublishedCourses } from "@/modules/courses/course.service";
import { listStudentCourseStates } from "@/modules/student-learning/student-learning.service";

export default async function DashboardCoursesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [studentCourses, publishedCourses] = await Promise.all([
    listStudentCourseStates(session.user.id),
    listPublishedCourses(),
  ]);
  const averageProgress =
    studentCourses.length > 0
      ? Math.round(
          studentCourses.reduce((sum, course) => sum + course.progressPercent, 0) /
            studentCourses.length,
        )
      : 0;
  const completedCourseCount = studentCourses.filter((course) => course.progressPercent === 100).length;
  const progressBands = [
    {
      label: "0-24%",
      count: studentCourses.filter((course) => course.progressPercent < 25).length,
    },
    {
      label: "25-49%",
      count: studentCourses.filter(
        (course) => course.progressPercent >= 25 && course.progressPercent < 50,
      ).length,
    },
    {
      label: "50-74%",
      count: studentCourses.filter(
        (course) => course.progressPercent >= 50 && course.progressPercent < 75,
      ).length,
    },
    {
      label: "75-100%",
      count: studentCourses.filter((course) => course.progressPercent >= 75).length,
    },
  ];

  if (studentCourses.length === 0) {
    return (
      <section className="space-y-6">
        <DashboardEmptyState
          eyebrow="Khóa học của tôi"
          title="Bạn chưa có course nào được ghi nhận trong dashboard"
          description="Hãy bắt đầu với một lesson hoặc một quiz. Hệ thống sẽ tự tạo course học của bạn ngay khi phát sinh progress đầu tiên."
          actionHref="/courses"
          actionLabel="Khám phá khóa học"
          hint="Danh sách gợi ý bên dưới lấy trực tiếp từ các course đang publish để bạn vào học ngay."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {publishedCourses.map((course) => (
            <article
              key={course.id}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-950">{course.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{course.summary}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{course.lessonCount} lesson</span>
                <span>{course.quizCount} quiz</span>
                <span>{formatHours(course.estimatedHours)}</span>
              </div>
              <Link
                href={`/courses/${course.slug}`}
                className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Mở khóa học
              </Link>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Khóa học của tôi</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Danh sách dưới đây được lấy trực tiếp từ enrollment, lesson progress và quiz attempts
            của tài khoản hiện tại.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Course đang học</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{studentCourses.length}</p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Course hoàn tất</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{completedCourseCount}</p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Tiến độ trung bình</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{averageProgress}%</p>
            </div>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-950">Phân bố course theo tiến độ</h3>
          <div className="mt-5 space-y-4">
            {progressBands.map((band, index) => {
              const width = Math.max(
                studentCourses.length > 0 ? Math.round((band.count / studentCourses.length) * 100) : 0,
                band.count > 0 ? 12 : 0,
              );
              const tones = ["bg-slate-300", "bg-slate-400", "bg-slate-600", "bg-slate-900"];

              return (
                <div key={band.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-slate-700">{band.label}</span>
                    <span className="text-slate-500">{band.count} course</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${tones[index]}`} style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </div>

      <div className="grid gap-5">
        {studentCourses.map((course) => {
          const lessonProgressPercent =
            course.totalLessons > 0
              ? Math.round((course.completedLessonCount / course.totalLessons) * 100)
              : 0;
          const quizProgressPercent =
            course.totalQuizzes > 0
              ? Math.round((course.completedQuizCount / course.totalQuizzes) * 100)
              : 0;

          return (
            <article
              key={course.enrollmentId}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {course.course.learningPathTitles.join(", ") || "Learning path đang cập nhật"}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                    {course.course.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{course.course.summary}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                      {getPlatformLabel(course.course.platform)}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                      {getLevelLabel(course.course.level)}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                      {course.course.modules.length} module
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Lesson</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {course.completedLessonCount}/{course.totalLessons}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Quiz</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {course.completedQuizCount}/{course.totalQuizzes}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Ước lượng</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {formatHours(course.course.estimatedHours)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-slate-500">Tiến độ lesson</span>
                        <span className="font-semibold text-slate-950">{lessonProgressPercent}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-slate-700"
                          style={{ width: `${lessonProgressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-slate-500">Tiến độ quiz</span>
                        <span className="font-semibold text-slate-950">{quizProgressPercent}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-slate-900"
                          style={{ width: `${quizProgressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>Vào học từ: {formatDate(course.enrolledAt)}</span>
                    <span>Truy cập gần nhất: {formatDate(course.lastAccessedAt)}</span>
                  </div>
                </div>

                <div className="w-full max-w-sm rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">Tiến độ tổng</p>
                    <p className="text-sm font-semibold text-slate-950">{course.progressPercent}%</p>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-950"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>

                  {course.nextAction ? (
                    <Link
                      href={course.nextAction.href}
                      className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      {course.nextAction.type === "lesson"
                        ? `Học tiếp: ${course.nextAction.title}`
                        : `Làm quiz: ${course.nextAction.title}`}
                    </Link>
                  ) : (
                    <p className="mt-5 text-sm font-medium text-emerald-700">
                      Bạn đã hoàn thành khóa học hiện có.
                    </p>
                  )}

                  <Link
                    href={`/courses/${course.course.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-4"
                  >
                    Mở trang course
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
