import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicButtonClassName } from "@/components/ui/public-button";
import { formatHours, getLevelLabel, getPlatformLabel } from "@/lib/learning";
import { getPublishedLearningPathBySlug } from "@/modules/learning-paths/learning-path.service";

type LearningPathDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LearningPathDetailPage({
  params,
}: LearningPathDetailPageProps) {
  const { slug } = await params;
  const learningPath = await getPublishedLearningPathBySlug(slug);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>{getPlatformLabel(learningPath.platform)}</span>
            <span>{getLevelLabel(learningPath.level)}</span>
            <span>{formatHours(learningPath.estimatedHours)}</span>
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {learningPath.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            {learningPath.description ?? learningPath.summary}
          </p>
        </section>

        <section className="py-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Khóa học trong lộ trình</h2>
              <p className="mt-2 text-sm text-slate-600">
                Tổng cộng {learningPath.courseCount} khóa học, {learningPath.lessonCount} lesson
                và {learningPath.quizCount} quiz đã publish.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {learningPath.courses.map((relation) => (
              <article
                key={relation.course.id}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {getPlatformLabel(relation.course.platform)}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                      {relation.course.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {relation.course.summary}
                    </p>
                  </div>

                  <div className="grid min-w-48 grid-cols-2 gap-3 text-sm text-slate-600">
                    <div>
                      <dt className="font-semibold text-slate-900">Module</dt>
                      <dd>{relation.course.modules.length}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">Lesson</dt>
                      <dd>{relation.course.lessons.length}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">Quiz</dt>
                      <dd>{relation.course.quizzes.length}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">Ước lượng</dt>
                      <dd>{formatHours(relation.course.estimatedHours)}</dd>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/courses/${relation.course.slug}`}
                  className={`mt-6 ${getPublicButtonClassName()}`}
                >
                  Mở khóa học
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
