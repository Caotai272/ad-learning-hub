import Link from "next/link";

import { auth } from "@/auth";
import { BookmarkToggleButton } from "@/components/common/bookmark-toggle-button";
import {
  getLessonBlockLabel,
  LessonBlockRenderer,
} from "@/components/learning/lesson-block-renderer";
import { LessonCompletionCard } from "@/components/learning/lesson-completion-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicButtonClassName } from "@/components/ui/public-button";
import { formatMinutes } from "@/lib/learning";
import { getBookmarkState } from "@/modules/bookmarks/bookmark.service";
import { listPublishedGlossaryTermsForLesson } from "@/modules/glossary/glossary.service";
import { getPublishedLessonByCourseAndSlug } from "@/modules/lessons/lesson.service";
import {
  getStudentCourseProgressSnapshot,
  getStudentLessonState,
} from "@/modules/student-learning/student-learning.service";

type LessonDetailPageProps = {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
  }>;
};

export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
  const { courseSlug, lessonSlug } = await params;
  const [session, lesson] = await Promise.all([
    auth(),
    getPublishedLessonByCourseAndSlug(courseSlug, lessonSlug),
  ]);

  const [glossaryTerms, bookmarkState, studentState] = await Promise.all([
    listPublishedGlossaryTermsForLesson(lesson.id),
    session?.user?.id
      ? getBookmarkState(session.user.id, {
          lessonId: lesson.id,
        })
      : Promise.resolve({ isBookmarked: false }),
    session?.user?.id
      ? Promise.all([
          getStudentLessonState(session.user.id, lesson.id),
          getStudentCourseProgressSnapshot(session.user.id, lesson.courseId),
        ])
      : Promise.resolve(null),
  ]);

  const lessonProgress = studentState?.[0] ?? {
    isCompleted: false,
    completedAt: null,
  };
  const courseProgress = studentState?.[1] ?? {
    totalLessons: lesson.course.lessons.length,
    completedLessons: 0,
    totalQuizzes: lesson.course.quizzes.length,
    completedQuizzes: 0,
    progressPercent: 0,
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            {lesson.course.title} / {lesson.courseModule.title}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {lesson.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            {lesson.description ?? lesson.summary ?? "Nội dung lesson đang được cập nhật."}
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Thời lượng dự kiến: {formatMinutes(lesson.estimatedMinutes)}
          </p>
        </section>

        <section className="grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            {lesson.blocks.map((block) => (
              <article
                key={block.id}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {getLessonBlockLabel(block.type)}
                </p>
                {block.title ? (
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">{block.title}</h2>
                ) : null}

                <div className="mt-4">
                  <LessonBlockRenderer block={block} />
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            {session?.user?.id ? (
              <>
                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
                  <h2 className="text-xl font-semibold text-slate-950">Lưu lesson</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Bookmark lesson này để mở lại nhanh trong dashboard bookmarks khi cần ôn tập.
                  </p>
                  <div className="mt-5">
                    <BookmarkToggleButton
                      targetType="LESSON"
                      targetId={lesson.id}
                      initialBookmarked={bookmarkState.isBookmarked}
                      activeLabel="Đã lưu lesson"
                      idleLabel="Lưu lesson"
                    />
                  </div>
                </section>

                <LessonCompletionCard
                  lessonId={lesson.id}
                  initialCompleted={lessonProgress.isCompleted}
                  initialProgressPercent={courseProgress.progressPercent}
                  nextLessonHref={
                    lesson.nextLesson
                      ? `/courses/${lesson.course.slug}/lessons/${lesson.nextLesson.slug}`
                      : null
                  }
                  nextLessonTitle={lesson.nextLesson?.title ?? null}
                />
              </>
            ) : (
              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
                <h2 className="text-xl font-semibold text-slate-950">Lưu tiến độ học</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Đăng nhập để đánh dấu hoàn thành lesson, lưu bookmark và theo dõi tiến độ học ngay
                  trong dashboard.
                </p>
                <Link href="/login" className={`mt-5 ${getPublicButtonClassName()}`}>
                  Đăng nhập để tiếp tục
                </Link>
              </section>
            )}

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
              <h2 className="text-xl font-semibold text-slate-950">Thuật ngữ liên quan</h2>
              <div className="mt-5 grid gap-3">
                {glossaryTerms.length > 0 ? (
                  glossaryTerms.map((term) => (
                    <Link
                      key={term.id}
                      href={`/glossary/${term.slug}`}
                      className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm transition hover:border-slate-300"
                    >
                      <p className="font-semibold text-slate-950">{term.term}</p>
                      <p className="mt-2 leading-6 text-slate-600">{term.shortDefinition}</p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-slate-600">
                    Lesson này hiện chưa gắn glossary term nào.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
              <h2 className="text-xl font-semibold text-slate-950">Điều hướng lesson</h2>
              <div className="mt-5 grid gap-3">
                {lesson.previousLesson ? (
                  <Link
                    href={`/courses/${lesson.course.slug}/lessons/${lesson.previousLesson.slug}`}
                    className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm transition hover:border-slate-300"
                  >
                    <p className="text-slate-500">Lesson trước</p>
                    <p className="mt-1 font-semibold text-slate-950">
                      {lesson.previousLesson.title}
                    </p>
                  </Link>
                ) : null}

                {lesson.nextLesson ? (
                  <Link
                    href={`/courses/${lesson.course.slug}/lessons/${lesson.nextLesson.slug}`}
                    className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm transition hover:border-slate-300"
                  >
                    <p className="text-slate-500">Lesson tiếp theo</p>
                    <p className="mt-1 font-semibold text-slate-950">{lesson.nextLesson.title}</p>
                  </Link>
                ) : null}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
              <h2 className="text-xl font-semibold text-slate-950">Quiz liên quan</h2>
              <div className="mt-5 grid gap-3">
                {lesson.quizzes.length > 0 ? (
                  lesson.quizzes.map((quiz) => (
                    <Link
                      key={quiz.id}
                      href={`/courses/${lesson.course.slug}/quizzes/${quiz.slug}`}
                      className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm transition hover:border-slate-300"
                    >
                      <p className="font-semibold text-slate-950">{quiz.title}</p>
                      <p className="mt-2 leading-6 text-slate-600">
                        {quiz.description ?? "Quiz đi kèm lesson này."}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-slate-600">
                    Lesson này chưa có quiz publish.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
