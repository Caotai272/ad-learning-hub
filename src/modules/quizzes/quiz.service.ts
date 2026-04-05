import { notFound } from "next/navigation";

import { findPublishedQuizByCourseAndSlug } from "@/modules/quizzes/quiz.repository";

export async function getPublishedQuizByCourseAndSlug(
  courseSlug: string,
  quizSlug: string,
) {
  const quiz = await findPublishedQuizByCourseAndSlug(courseSlug, quizSlug);

  if (!quiz) {
    notFound();
  }

  return {
    ...quiz,
    questionCount: quiz.questions.length,
  };
}
