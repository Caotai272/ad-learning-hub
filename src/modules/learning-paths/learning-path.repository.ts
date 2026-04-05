import { prisma } from "@/server/db";

export function findPublishedLearningPaths() {
  return prisma.learningPath.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      courses: {
        include: {
          course: {
            include: {
              modules: true,
              lessons: true,
              quizzes: true,
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        title: "asc",
      },
    ],
  });
}

export function findPublishedLearningPathBySlug(slug: string) {
  return prisma.learningPath.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      courses: {
        include: {
          course: {
            include: {
              modules: {
                orderBy: {
                  sortOrder: "asc",
                },
              },
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
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}
