import Link from "next/link";

import { auth } from "@/auth";
import { CourseEnrollmentButton } from "@/components/courses/course-enrollment-button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicButtonClassName } from "@/components/ui/public-button";
import { formatHours, formatMinutes, getLevelLabel, getPlatformLabel } from "@/lib/learning";
import { getPublishedCourseBySlug } from "@/modules/courses/course.service";
import { getStudentEnrollmentState } from "@/modules/student-learning/student-learning.service";

type CourseDetailPageProps = {
  params: Promise<{
    courseSlug: string;
  }>;
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseSlug } = await params;
  const [course, session] = await Promise.all([getPublishedCourseBySlug(courseSlug), auth()]);
  const enrollmentState = session?.user?.id
    ? await getStudentEnrollmentState(session.user.id, course.id)
    : {
        isEnrolled: false,
        status: null,
        enrolledAt: null,
        lastAccessedAt: null,
      };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>{getPlatformLabel(course.platform)}</span>
            <span>{getLevelLabel(course.level)}</span>
            <span>{formatHours(course.estimatedHours)}</span>
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            {course.description ?? course.summary}
          </p>
        </section>

        <section className="grid gap-8 py-10 md:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            {course.modules.map((module, index) => (
              <article
                key={module.id}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Module {index + 1}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">{module.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {module.description ?? module.summary ?? "Đang cập nhật mô tả module."}
                </p>

                <div className="mt-6 grid gap-4">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-5 py-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-950">{lesson.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            {lesson.summary ?? "Lesson này đang chờ bổ sung summary chi tiết."}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 md:items-end">
                          <span className="text-sm text-slate-500">
                            {formatMinutes(lesson.estimatedMinutes)}
                          </span>
                          <Link
                            href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                            className={getPublicButtonClassName({
                              variant: "secondary",
                              size: "sm",
                            })}
                          >
                            Mở lesson
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
              <h2 className="text-xl font-semibold text-slate-950">Tổng quan khóa học</h2>
              <dl className="mt-5 grid gap-4 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-4">
                  <dt>Learning path</dt>
                  <dd className="font-semibold text-slate-900">
                    {course.learningPaths.length > 0
                      ? course.learningPaths.map((item) => item.learningPath.title).join(", ")
                      : "Chưa gắn"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Module</dt>
                  <dd className="font-semibold text-slate-900">{course.moduleCount}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Lesson</dt>
                  <dd className="font-semibold text-slate-900">{course.lessonCount}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Quiz</dt>
                  <dd className="font-semibold text-slate-900">{course.quizCount}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
              <h2 className="text-xl font-semibold text-slate-950">Payment / Enrollment</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Giai đoạn hiện tại đã có self-serve enrollment flow. Khi kích hoạt course, nó sẽ
                xuất hiện ngay trong dashboard học của bạn.
              </p>

              <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Trạng thái</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {enrollmentState.isEnrolled ? "Đã kích hoạt" : "Chưa kích hoạt"}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {enrollmentState.isEnrolled
                    ? "Course này đã được đưa vào dashboard. Bạn có thể học ngay hoặc quay lại theo dõi tiến độ sau."
                    : "Kích hoạt course này để hệ thống bắt đầu theo dõi lesson progress, quiz attempts và tổng tiến độ."}
                </p>
              </div>

              <div className="mt-5">
                {session?.user?.id ? (
                  <CourseEnrollmentButton
                    courseId={course.id}
                    isEnrolled={enrollmentState.isEnrolled}
                  />
                ) : (
                  <Link
                    href="/login"
                    className={getPublicButtonClassName({ fullWidth: true })}
                  >
                    Đăng nhập để kích hoạt course
                  </Link>
                )}
              </div>

              <Link
                href="/pricing"
                className="mt-4 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-4"
              >
                Xem thêm các gói học
              </Link>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
              <h2 className="text-xl font-semibold text-slate-950">Quiz đã publish</h2>
              <div className="mt-5 grid gap-3">
                {course.quizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/courses/${course.slug}/quizzes/${quiz.slug}`}
                    className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm transition hover:border-slate-300"
                  >
                    <p className="font-semibold text-slate-950">{quiz.title}</p>
                    <p className="mt-2 leading-6 text-slate-600">
                      {quiz.description ?? "Quiz nền cho lesson hoặc module này."}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
