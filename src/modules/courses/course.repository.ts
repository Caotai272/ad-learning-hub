import { prisma } from "@/server/db";

export function findPublishedCourses() {
  return prisma.course.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      modules: {
        where: {
          status: "PUBLISHED",
        },
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
      learningPaths: {
        include: {
          learningPath: true,
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

export function findPublishedCourseBySlug(slug: string) {
  return prisma.course.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      modules: {
        where: {
          status: "PUBLISHED",
        },
        orderBy: {
          sortOrder: "asc",
        },
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
      learningPaths: {
        include: {
          learningPath: true,
        },
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
  });
}
