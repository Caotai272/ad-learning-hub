import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicButtonClassName } from "@/components/ui/public-button";
import { formatHours, getLevelLabel, getPlatformLabel } from "@/lib/learning";
import { listPublishedLearningPaths } from "@/modules/learning-paths/learning-path.service";

export default async function LearningPathsPage() {
  const learningPaths = await listPublishedLearningPaths();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <span className="inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-semibold text-cyan-800">
            Learning Paths
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Lộ trình học ads theo nền tảng
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Dữ liệu dưới đây đang đọc trực tiếp từ PostgreSQL qua Prisma. Mỗi lộ trình gom các
            khóa học đã publish theo đúng platform và level.
          </p>
        </section>

        <section className="grid gap-6 py-10 md:grid-cols-3">
          {learningPaths.map((path) => (
            <article
              key={path.id}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]"
            >
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <span>{getPlatformLabel(path.platform)}</span>
                <span>{getLevelLabel(path.level)}</span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold text-slate-950">{path.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{path.summary}</p>

              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-900">Khóa học</dt>
                  <dd className="mt-1">{path.courseCount}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Lesson</dt>
                  <dd className="mt-1">{path.lessonCount}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Quiz</dt>
                  <dd className="mt-1">{path.quizCount}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Ước lượng</dt>
                  <dd className="mt-1">{formatHours(path.estimatedHours)}</dd>
                </div>
              </dl>

              <Link
                href={`/learning-paths/${path.slug}`}
                className={`mt-6 ${getPublicButtonClassName()}`}
              >
                Xem lộ trình
              </Link>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
