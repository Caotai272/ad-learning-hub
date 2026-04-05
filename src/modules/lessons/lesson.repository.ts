import { prisma } from "@/server/db";

export function findPublishedLessonByCourseAndSlug(courseSlug: string, lessonSlug: string) {
  return prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      status: "PUBLISHED",
      course: {
        slug: courseSlug,
        status: "PUBLISHED",
      },
    },
    include: {
      course: {
        include: {
          lessons: {
            where: {
              status: "PUBLISHED",
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
          quizzes: {
            where: {
              status: "PUBLISHED",
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
      courseModule: true,
      blocks: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      quizzes: {
        where: {
          status: "PUBLISHED",
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}
