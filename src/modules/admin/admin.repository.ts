import { prisma } from "@/server/db";

export function countUsersByRole() {
  return Promise.all([
    prisma.user.count({
      where: {
        role: "STUDENT",
      },
    }),
    prisma.user.count({
      where: {
        role: "ADMIN",
      },
    }),
  ]);
}

export function countAdminOperationalMetrics() {
  return Promise.all([
    prisma.enrollment.count(),
    prisma.quizAttempt.count(),
    prisma.lessonProgress.count({
      where: {
        status: "COMPLETED",
      },
    }),
  ]);
}

export function listAdminLearningPaths() {
  return prisma.learningPath.findMany({
    include: {
      courses: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
}

export function listAdminCourses() {
  return prisma.course.findMany({
    include: {
      learningPaths: {
        include: {
          learningPath: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
      _count: {
        select: {
          modules: true,
          lessons: true,
          quizzes: true,
          enrollments: true,
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
}

export function listAdminModules() {
  return prisma.courseModule.findMany({
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
        },
      },
      _count: {
        select: {
          lessons: true,
          quizzes: true,
        },
      },
    },
    orderBy: [{ courseId: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
}

export function listAdminLessons() {
  return prisma.lesson.findMany({
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
        },
      },
      courseModule: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
        },
      },
      _count: {
        select: {
          blocks: true,
          quizzes: true,
          progressEntries: true,
        },
      },
    },
    orderBy: [{ courseId: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
}

export function listAdminQuizzes() {
  return prisma.quiz.findMany({
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
        },
      },
      courseModule: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
        },
      },
      lesson: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
        },
      },
      _count: {
        select: {
          questions: true,
          attempts: true,
        },
      },
    },
    orderBy: [{ courseId: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
}

export function listUsersWithLearningAnalytics() {
  return prisma.user.findMany({
    include: {
      enrollments: {
        select: {
          id: true,
          status: true,
          courseId: true,
        },
      },
      lessonProgress: {
        select: {
          id: true,
          status: true,
        },
      },
      quizAttempts: {
        where: {
          status: "GRADED",
        },
        select: {
          id: true,
          score: true,
          quiz: {
            select: {
              passingScore: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function listCoursesWithAnalytics() {
  return prisma.course.findMany({
    include: {
      enrollments: {
        select: {
          id: true,
          status: true,
          userId: true,
        },
      },
      lessons: {
        select: {
          id: true,
          progressEntries: {
            where: {
              status: "COMPLETED",
            },
            select: {
              id: true,
            },
          },
        },
      },
      quizzes: {
        select: {
          id: true,
          passingScore: true,
          attempts: {
            where: {
              status: "GRADED",
            },
            select: {
              id: true,
              score: true,
            },
          },
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
}

export function listQuizzesWithAnalytics() {
  return prisma.quiz.findMany({
    include: {
      course: {
        select: {
          title: true,
          slug: true,
        },
      },
      attempts: {
        where: {
          status: "GRADED",
        },
        select: {
          id: true,
          score: true,
          userId: true,
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
}
