import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { formatHours } from "@/lib/learning";
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

  if (studentCourses.length === 0) {
    return (
      <section className="space-y-6">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Khóa học của tôi</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Bạn chưa có course nào được ghi nhận trong tiến độ học. Hãy bắt đầu với một lesson hoặc
            một quiz, hệ thống sẽ tự tạo course học của bạn.
          </p>
        </div>

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
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Khóa học của tôi</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Danh sách dưới đây được lấy trực tiếp từ enrollment, lesson progress và quiz attempts của
          tài khoản hiện tại.
        </p>
      </div>

      <div className="grid gap-5">
        {studentCourses.map((course) => (
          <article
            key={course.enrollmentId}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-6"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {course.course.learningPathTitles.join(", ") || "Learning path đang cập nhật"}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                  {course.course.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{course.course.summary}</p>

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>{course.completedLessonCount}/{course.totalLessons} lesson</span>
                  <span>{course.completedQuizCount}/{course.totalQuizzes} quiz</span>
                  <span>{formatHours(course.course.estimatedHours)}</span>
                </div>
              </div>

              <div className="w-full max-w-sm rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Tiến độ tổng</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {course.progressPercent}%
                </p>
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
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
