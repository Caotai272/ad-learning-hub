import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicButtonClassName } from "@/components/ui/public-button";
import { formatHours, getLevelLabel, getPlatformLabel } from "@/lib/learning";
import { listPublishedCourses } from "@/modules/courses/course.service";

export default async function CoursesPage() {
  const courses = await listPublishedCourses();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <span className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-800">
            Courses
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Danh sách khóa học đang publish
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Các khóa học dưới đây đang được đọc trực tiếp từ bảng `Course`, kèm số module,
            lesson và quiz đã seed ở Phase 2.
          </p>
        </section>

        <section className="grid gap-6 py-10 md:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.id}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]"
            >
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <span>{getPlatformLabel(course.platform)}</span>
                <span>{getLevelLabel(course.level)}</span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold text-slate-950">{course.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{course.summary}</p>

              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-900">Module</dt>
                  <dd className="mt-1">{course.moduleCount}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Lesson</dt>
                  <dd className="mt-1">{course.lessonCount}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Quiz</dt>
                  <dd className="mt-1">{course.quizCount}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Ước lượng</dt>
                  <dd className="mt-1">{formatHours(course.estimatedHours)}</dd>
                </div>
              </dl>

              <Link href={`/courses/${course.slug}`} className={`mt-6 ${getPublicButtonClassName()}`}>
                Xem khóa học
              </Link>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
