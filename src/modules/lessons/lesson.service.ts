import { notFound } from "next/navigation";

import { findPublishedLessonByCourseAndSlug } from "@/modules/lessons/lesson.repository";

export async function getPublishedLessonByCourseAndSlug(
  courseSlug: string,
  lessonSlug: string,
) {
  const lesson = await findPublishedLessonByCourseAndSlug(courseSlug, lessonSlug);

  if (!lesson) {
    notFound();
  }

  const lessonIndex = lesson.course.lessons.findIndex((item) => item.id === lesson.id);

  return {
    ...lesson,
    previousLesson: lessonIndex > 0 ? lesson.course.lessons[lessonIndex - 1] : null,
    nextLesson:
      lessonIndex >= 0 && lessonIndex < lesson.course.lessons.length - 1
        ? lesson.course.lessons[lessonIndex + 1]
        : null,
  };
}
