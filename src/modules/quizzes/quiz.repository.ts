import { prisma } from "@/server/db";

export function findPublishedQuizByCourseAndSlug(courseSlug: string, quizSlug: string) {
  return prisma.quiz.findFirst({
    where: {
      slug: quizSlug,
      status: "PUBLISHED",
      course: {
        slug: courseSlug,
        status: "PUBLISHED",
      },
    },
    include: {
      course: true,
      courseModule: true,
      lesson: true,
      questions: {
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          choices: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
    },
  });
}
