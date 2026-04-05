import Link from "next/link";

import { auth } from "@/auth";
import { QuizPlayer } from "@/components/learning/quiz-player";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicButtonClassName } from "@/components/ui/public-button";
import { getPublishedQuizByCourseAndSlug } from "@/modules/quizzes/quiz.service";
import { getStudentQuizState } from "@/modules/student-learning/student-learning.service";

type QuizDetailPageProps = {
  params: Promise<{
    courseSlug: string;
    quizSlug: string;
  }>;
};

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { courseSlug, quizSlug } = await params;
  const [session, quiz] = await Promise.all([
    auth(),
    getPublishedQuizByCourseAndSlug(courseSlug, quizSlug),
  ]);

  const attemptState = session?.user?.id
    ? await getStudentQuizState(session.user.id, quiz.id)
    : null;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            {quiz.course.title}
            {quiz.lesson ? ` / ${quiz.lesson.title}` : ""}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {quiz.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            {quiz.description ?? "Quiz này đang được cập nhật mô tả chi tiết."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              {quiz.questionCount} câu hỏi
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              Passing score: {quiz.passingScore}
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              Tối đa: {quiz.maxAttempts ?? "Không giới hạn"} lần
            </span>
          </div>
        </section>

        <section className="py-10">
          <QuizPlayer
            quiz={{
              id: quiz.id,
              courseSlug: quiz.course.slug,
              passingScore: quiz.passingScore,
              questions: quiz.questions.map((question) => ({
                id: question.id,
                prompt: question.prompt,
                type: question.type,
                explanation: question.explanation,
                points: question.points,
                choices: question.choices.map((choice) => ({
                  id: choice.id,
                  label: choice.label,
                  explanation: choice.explanation,
                })),
              })),
            }}
            isAuthenticated={Boolean(session?.user?.id)}
            attemptState={attemptState}
          />
        </section>

        <section className="pb-12">
          <Link href={`/courses/${quiz.course.slug}`} className={getPublicButtonClassName()}>
            Quay lại khóa học
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
