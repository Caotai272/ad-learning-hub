import { prisma } from "@/server/db";

export function findLessonProgress(userId: string, lessonId: string) {
  return prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  });
}

export function findPublishedLessonProgressContext(lessonId: string) {
  return prisma.lesson.findFirst({
    where: {
      id: lessonId,
      status: "PUBLISHED",
      course: {
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
    },
  });
}

export function findPublishedQuizAttemptContext(quizId: string) {
  return prisma.quiz.findFirst({
    where: {
      id: quizId,
      status: "PUBLISHED",
      course: {
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

export function countSubmittedQuizAttempts(userId: string, quizId: string) {
  return prisma.quizAttempt.count({
    where: {
      userId,
      quizId,
      status: {
        in: ["SUBMITTED", "GRADED"],
      },
    },
  });
}

export function findLatestGradedQuizAttempt(userId: string, quizId: string) {
  return prisma.quizAttempt.findFirst({
    where: {
      userId,
      quizId,
      status: "GRADED",
    },
    orderBy: {
      submittedAt: "desc",
    },
    include: {
      answers: true,
    },
  });
}

export function listStudentEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: {
      userId,
    },
    orderBy: {
      lastAccessedAt: "desc",
    },
    include: {
      course: {
        include: {
          learningPaths: {
            include: {
              learningPath: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
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
  });
}

export function findCompletedLessonProgressByCourseIds(userId: string, courseIds: string[]) {
  return prisma.lessonProgress.findMany({
    where: {
      userId,
      status: "COMPLETED",
      lesson: {
        courseId: {
          in: courseIds,
        },
      },
    },
    include: {
      lesson: true,
    },
  });
}

export function findCompletedQuizAttemptsByCourseIds(userId: string, courseIds: string[]) {
  return prisma.quizAttempt.findMany({
    where: {
      userId,
      status: "GRADED",
      quiz: {
        courseId: {
          in: courseIds,
        },
      },
    },
    distinct: ["quizId"],
    orderBy: {
      submittedAt: "desc",
    },
    include: {
      quiz: true,
    },
  });
}

export function findLatestLessonProgress(userId: string) {
  return prisma.lessonProgress.findFirst({
    where: {
      userId,
    },
    orderBy: {
      lastViewedAt: "desc",
    },
    include: {
      lesson: {
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
        },
      },
    },
  });
}

export function listRecentQuizAttempts(userId: string) {
  return prisma.quizAttempt.findMany({
    where: {
      userId,
      status: "GRADED",
    },
    orderBy: {
      submittedAt: "desc",
    },
    include: {
      quiz: {
        include: {
          course: true,
        },
      },
    },
  });
}

export function findEnrollmentByUserAndCourseId(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
}

export function findPublishedCourseForEnrollment(courseId: string) {
  return prisma.course.findFirst({
    where: {
      id: courseId,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      level: true,
      platform: true,
    },
  });
}

export function listPublishedCoursesForEnrollment() {
  return prisma.course.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      level: true,
      platform: true,
      summary: true,
    },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
}
