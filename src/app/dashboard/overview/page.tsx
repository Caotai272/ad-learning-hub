import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { formatDateTime } from "@/lib/format";
import { getStudentDashboardOverview } from "@/modules/student-learning/student-learning.service";

export default async function DashboardOverviewPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const overview = await getStudentDashboardOverview(session.user.id);
  const totalTrackedSteps = overview.courses.reduce(
    (sum, course) => sum + course.totalLessons + course.totalQuizzes,
    0,
  );
  const completedTrackedSteps = overview.courses.reduce(
    (sum, course) => sum + course.completedLessonCount + course.completedQuizCount,
    0,
  );
  const overallProgressPercent =
    totalTrackedSteps > 0 ? Math.round((completedTrackedSteps / totalTrackedSteps) * 100) : 0;
  const completedCourseCount = overview.courses.filter((course) => course.progressPercent === 100).length;
  const progressDistribution = [
    {
      label: "Mới bắt đầu",
      count: overview.courses.filter((course) => course.progressPercent < 25).length,
      color: "bg-slate-300",
    },
    {
      label: "Đang vào nhịp",
      count: overview.courses.filter(
        (course) => course.progressPercent >= 25 && course.progressPercent < 75,
      ).length,
      color: "bg-slate-500",
    },
    {
      label: "Sắp hoàn thành",
      count: overview.courses.filter((course) => course.progressPercent >= 75).length,
      color: "bg-slate-900",
    },
  ];
  const quickActions = [
    {
      href: "/dashboard/my-courses",
      label: "Mở khóa học của tôi",
      text: "Xem toàn bộ course đang học và course đã hoàn thành.",
    },
    {
      href: "/dashboard/my-practice",
      label: "Xem lịch sử luyện tập",
      text: "Kiểm tra quiz attempts gần nhất và kết quả đã lưu.",
    },
    {
      href: "/courses",
      label: "Khám phá thêm course",
      text: "Đi tới danh sách course publish để bắt đầu một luồng học mới.",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Bức tranh học tập
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                Dashboard đang bám theo tiến độ học thực tế của bạn
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Từ lesson đã hoàn thành, quiz đã nộp và course đang theo học, hệ thống dựng ra một
                ảnh chụp nhanh để bạn biết nên tiếp tục ở đâu tiếp theo.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Tổng bước học</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{totalTrackedSteps}</p>
                </div>
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Đã hoàn thành</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{completedTrackedSteps}</p>
                </div>
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Course xong</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{completedCourseCount}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-6">
              <div
                className="relative h-36 w-36 rounded-full"
                style={{
                  background: `conic-gradient(#0f172a 0 ${overallProgressPercent}%, #e2e8f0 ${overallProgressPercent}% 100%)`,
                }}
              >
                <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white">
                  <div className="text-center">
                    <p className="text-3xl font-semibold text-slate-950">{overallProgressPercent}%</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                      Hoàn thành
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm leading-7 text-slate-600">
                Tỷ lệ hoàn thành được tính trên toàn bộ lesson và quiz đã có trong dashboard.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Phân bố tiến độ</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Nhìn nhanh xem các course của bạn đang tập trung ở giai đoạn nào.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {overview.activeCourseCount} course
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {progressDistribution.map((item) => {
              const width =
                overview.activeCourseCount > 0
                  ? Math.max(Math.round((item.count / overview.activeCourseCount) * 100), item.count > 0 ? 14 : 0)
                  : 0;

              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="text-slate-500">{item.count} course</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">Nhịp học gợi ý</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Ưu tiên hoàn tất các course đã vượt 75% để khóa nhanh từng cụm kiến thức trước khi mở
              thêm luồng học mới.
            </p>
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Khóa học đang học",
            value: overview.activeCourseCount.toString(),
            note: "Số course đã có enrollment hoặc progress.",
          },
          {
            label: "Lesson đã hoàn thành",
            value: overview.completedLessonCount.toString(),
            note: "Các lesson đã được lưu hoàn thành trong tài khoản.",
          },
          {
            label: "Quiz đã nộp",
            value: overview.completedQuizCount.toString(),
            note: "Tổng số quiz đã có attempt được chấm điểm.",
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

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Tiếp tục học</h2>
          {overview.continueLearning ? (
            <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Course đang đi gần nhất</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                {overview.continueLearning.courseTitle}
              </h3>
              <div className="mt-5">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-500">Tiến độ hiện tại</span>
                  <span className="font-semibold text-slate-950">
                    {overview.continueLearning.progressPercent}%
                  </span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-950"
                    style={{ width: `${overview.continueLearning.progressPercent}%` }}
                  />
                </div>
              </div>
              {overview.continueLearning.nextAction ? (
                <Link
                  href={overview.continueLearning.nextAction.href}
                  className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {overview.continueLearning.nextAction.type === "lesson"
                    ? `Học tiếp: ${overview.continueLearning.nextAction.title}`
                    : `Làm quiz: ${overview.continueLearning.nextAction.title}`}
                </Link>
              ) : (
                <p className="mt-6 text-sm font-medium text-emerald-700">
                  Bạn đã hoàn thành toàn bộ các bước học hiện có trong course này.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-5">
              <DashboardEmptyState
                eyebrow="Chưa có tiến độ"
                title="Bắt đầu lesson đầu tiên để dashboard hoạt động"
                description="Ngay khi bạn hoàn thành lesson hoặc nộp quiz đầu tiên, khu vực này sẽ gợi ý bước tiếp theo dựa trên hành vi học thật."
                actionHref="/courses"
                actionLabel="Xem danh sách khóa học"
                hint="Bạn không cần tạo enrollment thủ công. Hệ thống sẽ tự ghi nhận course học của bạn khi có phát sinh progress."
              />
            </div>
          )}
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Hoạt động gần nhất</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Điểm chạm gần nhất để bạn quay lại đúng lesson vừa học.
              </p>
            </div>
          </div>
          {overview.latestActivity ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">{overview.latestActivity.courseTitle}</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {overview.latestActivity.lessonTitle}
                </p>
                <div className="mt-4 grid gap-3 text-sm text-slate-600">
                  <div className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Truy cập gần nhất</p>
                    <p className="mt-2 font-semibold text-slate-950">
                      {formatDateTime(overview.latestActivity.lastViewedAt)}
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Hoàn thành</p>
                    <p className="mt-2 font-semibold text-slate-950">
                      {overview.latestActivity.completedAt
                        ? formatDateTime(overview.latestActivity.completedAt)
                        : "Chưa đánh dấu hoàn thành"}
                    </p>
                  </div>
                </div>
                <Link
                  href={overview.latestActivity.lessonHref}
                  className="mt-5 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-4"
                >
                  Mở lại lesson
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-5">
              <p className="text-sm leading-7 text-slate-600">
                Chưa có hoạt động học nào được lưu trong tài khoản của bạn. Khi bạn mở lesson và
                hoàn thành nội dung đầu tiên, nơi này sẽ trở thành mốc quay lại nhanh.
              </p>
            </div>
          )}
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Khóa học của bạn</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Những course dưới đây là nơi dashboard đang ghi nhận progress thật.
            </p>
          </div>
          <Link
            href="/dashboard/my-courses"
            className="text-sm font-semibold text-slate-900 underline underline-offset-4"
          >
            Xem tất cả
          </Link>
        </div>

        {overview.courses.length > 0 ? (
          <div className="mt-5 space-y-5">
            <div className="grid gap-3">
              {overview.courses.slice(0, 5).map((course) => (
                <div
                  key={course.enrollmentId}
                  className="grid gap-2 lg:grid-cols-[200px_1fr_60px] lg:items-center"
                >
                  <p className="text-sm font-medium text-slate-700">{course.course.title}</p>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-slate-950">{course.progressPercent}%</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {overview.courses.slice(0, 3).map((course) => (
                <article
                  key={course.enrollmentId}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm text-slate-500">
                    {course.course.learningPathTitles.join(", ") || "Learning path đang cập nhật"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">{course.course.title}</h3>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-950"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {course.completedLessonCount}/{course.totalLessons} lesson và {course.completedQuizCount}/
                    {course.totalQuizzes} quiz đã hoàn thành.
                  </p>
                  {course.nextAction ? (
                    <Link
                      href={course.nextAction.href}
                      className="mt-4 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-4"
                    >
                      {course.nextAction.type === "lesson" ? "Học tiếp" : "Làm quiz"}
                    </Link>
                  ) : (
                    <p className="mt-4 text-sm font-medium text-emerald-700">Đã hoàn thành.</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <DashboardEmptyState
              eyebrow="Danh sách trống"
              title="Chưa có course nào hiện lên trong dashboard"
              description="Course sẽ xuất hiện ở đây ngay khi tài khoản của bạn có lesson progress hoặc quiz attempt đầu tiên."
              actionHref="/courses"
              actionLabel="Đi tới thư viện course"
            />
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Lối tắt hữu ích</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <p className="text-sm font-semibold text-slate-950">{action.label}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{action.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
