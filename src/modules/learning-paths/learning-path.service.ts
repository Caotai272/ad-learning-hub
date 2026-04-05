import { notFound } from "next/navigation";

import {
  findPublishedLearningPathBySlug,
  findPublishedLearningPaths,
} from "@/modules/learning-paths/learning-path.repository";

export async function listPublishedLearningPaths() {
  const paths = await findPublishedLearningPaths();

  return paths.map((path) => ({
    ...path,
    courseCount: path.courses.length,
    lessonCount: path.courses.reduce(
      (total, relation) => total + relation.course.lessons.length,
      0,
    ),
    quizCount: path.courses.reduce(
      (total, relation) => total + relation.course.quizzes.length,
      0,
    ),
  }));
}

export async function getPublishedLearningPathBySlug(slug: string) {
  const path = await findPublishedLearningPathBySlug(slug);

  if (!path) {
    notFound();
  }

  return {
    ...path,
    courseCount: path.courses.length,
    lessonCount: path.courses.reduce(
      (total, relation) => total + relation.course.lessons.length,
      0,
    ),
    quizCount: path.courses.reduce(
      (total, relation) => total + relation.course.quizzes.length,
      0,
    ),
  };
}
