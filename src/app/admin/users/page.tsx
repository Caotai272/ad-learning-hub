import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { formatDateTime } from "@/lib/format";
import { getAdminUserAnalytics } from "@/modules/admin/admin.service";

export default async function AdminUsersPage() {
  const analytics = await getAdminUserAnalytics();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Tổng user",
            value: analytics.totalUserCount.toString(),
            note: "Bao gồm cả student và admin đang tồn tại trong hệ thống.",
          },
          {
            label: "Student",
            value: analytics.studentCount.toString(),
            note: "Những tài khoản học viên đang dùng cho learning flow.",
          },
          {
            label: "Admin",
            value: analytics.adminCount.toString(),
            note: "Những tài khoản có quyền truy cập khu vận hành.",
          },
          {
            label: "Active student",
            value: analytics.activeStudentCount.toString(),
            note: "Student đã có enrollment, progress hoặc quiz attempt.",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Top học viên theo nhịp học</h2>
          <div className="mt-5 grid gap-3">
            {analytics.topStudents.map((student, index) => (
              <div
                key={student.id}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      #{index + 1}
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-950">{student.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{student.email}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Tạo lúc: {formatDateTime(student.createdAt)}
                    </p>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-600">
                    <p>Enrollment: {student.enrollmentCount}</p>
                    <p>Course hoàn thành: {student.completedEnrollmentCount}</p>
                    <p>Lesson hoàn thành: {student.completedLessonCount}</p>
                    <p>Quiz attempts: {student.quizAttemptCount}</p>
                    <p>Điểm TB: {student.averageScore}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Top course theo sử dụng</h2>
          <div className="mt-5 grid gap-3">
            {analytics.topCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base font-semibold text-slate-950">{course.title}</p>
                      <AdminStatusBadge status={course.status} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{course.slug}</p>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-600">
                    <p>Enrollment: {course.enrollmentCount}</p>
                    <p>Course hoàn thành: {course.completedEnrollmentCount}</p>
                    <p>Lesson completions: {course.lessonCompletionCount}</p>
                    <p>Quiz attempts: {course.quizAttemptCount}</p>
                    <p>Pass rate: {course.passRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Hiệu suất quiz</h2>
        <div className="mt-5 grid gap-3 xl:grid-cols-2">
          {analytics.topQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-base font-semibold text-slate-950">{quiz.title}</p>
                    <AdminStatusBadge status={quiz.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{quiz.courseTitle}</p>
                </div>

                <div className="grid gap-2 text-sm text-slate-600">
                  <p>Attempts: {quiz.attemptCount}</p>
                  <p>Điểm TB: {quiz.averageScore}</p>
                  <p>Pass rate: {quiz.passRate}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
