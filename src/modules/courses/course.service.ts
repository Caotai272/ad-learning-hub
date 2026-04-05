import { notFound } from "next/navigation";

import {
  findPublishedCourseBySlug,
  findPublishedCourses,
} from "@/modules/courses/course.repository";

export async function listPublishedCourses() {
  const courses = await findPublishedCourses();

  return courses.map((course) => ({
    ...course,
    moduleCount: course.modules.length,
    lessonCount: course.lessons.length,
    quizCount: course.quizzes.length,
  }));
}

export async function getPublishedCourseBySlug(slug: string) {
  const course = await findPublishedCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return {
    ...course,
    moduleCount: course.modules.length,
    lessonCount: course.lessons.length,
    quizCount: course.quizzes.length,
  };
}
