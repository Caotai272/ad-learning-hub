import { ContentStatus } from "@prisma/client";

import { getLevelLabel, getPlatformLabel } from "@/lib/learning";
import type {
  AdminCourseFormInput,
  AdminLearningEntityInput,
  AdminLearningPathFormInput,
  AdminLessonFormInput,
  AdminModuleFormInput,
  AdminQuizFormInput,
} from "@/modules/admin/admin.schema";
import {
  countAdminOperationalMetrics,
  countUsersByRole,
  listAdminCourses,
  listAdminLearningPaths,
  listAdminLessons,
  listAdminModules,
  listAdminQuizzes,
  listCoursesWithAnalytics,
  listQuizzesWithAnalytics,
  listUsersWithLearningAnalytics,
} from "@/modules/admin/admin.repository";
import { prisma } from "@/server/db";

export type AdminEntityType = "LEARNING_PATH" | "COURSE" | "MODULE" | "LESSON" | "QUIZ";

type WorkflowItem = {
  entityType: AdminEntityType;
  entityLabel: string;
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  subtitle: string;
  updatedAt: string;
  publishedAt: string | null;
};

function getEntityLabel(entityType: AdminEntityType) {
  switch (entityType) {
    case "LEARNING_PATH":
      return "Learning path";
    case "COURSE":
      return "Course";
    case "MODULE":
      return "Module";
    case "LESSON":
      return "Lesson";
    case "QUIZ":
      return "Quiz";
    default:
      return entityType;
  }
}

function sortWorkflowItems(items: WorkflowItem[]) {
  return [...items].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

function mapLearningPathWorkflowItem(
  path: Awaited<ReturnType<typeof listAdminLearningPaths>>[number],
): WorkflowItem {
  return {
    entityType: "LEARNING_PATH",
    entityLabel: getEntityLabel("LEARNING_PATH"),
    id: path.id,
    title: path.title,
    slug: path.slug,
    status: path.status,
    subtitle: `${getPlatformLabel(path.platform)} · ${getLevelLabel(path.level)} · ${path.courses.length} course`,
    updatedAt: path.updatedAt.toISOString(),
    publishedAt: path.publishedAt?.toISOString() ?? null,
  };
}

function mapCourseWorkflowItem(
  course: Awaited<ReturnType<typeof listAdminCourses>>[number],
): WorkflowItem {
  return {
    entityType: "COURSE",
    entityLabel: getEntityLabel("COURSE"),
    id: course.id,
    title: course.title,
    slug: course.slug,
    status: course.status,
    subtitle: `${getPlatformLabel(course.platform)} · ${course._count.modules} module · ${course._count.lessons} lesson · ${course._count.quizzes} quiz`,
    updatedAt: course.updatedAt.toISOString(),
    publishedAt: course.publishedAt?.toISOString() ?? null,
  };
}

function mapModuleWorkflowItem(
  module: Awaited<ReturnType<typeof listAdminModules>>[number],
): WorkflowItem {
  return {
    entityType: "MODULE",
    entityLabel: getEntityLabel("MODULE"),
    id: module.id,
    title: module.title,
    slug: module.slug,
    status: module.status,
    subtitle: `${module.course.title} · ${module._count.lessons} lesson · ${module._count.quizzes} quiz`,
    updatedAt: module.updatedAt.toISOString(),
    publishedAt: module.publishedAt?.toISOString() ?? null,
  };
}

function mapLessonWorkflowItem(
  lesson: Awaited<ReturnType<typeof listAdminLessons>>[number],
): WorkflowItem {
  return {
    entityType: "LESSON",
    entityLabel: getEntityLabel("LESSON"),
    id: lesson.id,
    title: lesson.title,
    slug: lesson.slug,
    status: lesson.status,
    subtitle: `${lesson.course.title} / ${lesson.courseModule.title} · ${lesson._count.blocks} block · ${lesson._count.quizzes} quiz`,
    updatedAt: lesson.updatedAt.toISOString(),
    publishedAt: lesson.publishedAt?.toISOString() ?? null,
  };
}

function mapQuizWorkflowItem(
  quiz: Awaited<ReturnType<typeof listAdminQuizzes>>[number],
): WorkflowItem {
  const context = quiz.lesson?.title ?? quiz.courseModule?.title ?? quiz.course.title;

  return {
    entityType: "QUIZ",
    entityLabel: getEntityLabel("QUIZ"),
    id: quiz.id,
    title: quiz.title,
    slug: quiz.slug,
    status: quiz.status,
    subtitle: `${quiz.course.title} / ${context} · ${quiz._count.questions} câu hỏi · ${quiz._count.attempts} attempt`,
    updatedAt: quiz.updatedAt.toISOString(),
    publishedAt: quiz.publishedAt?.toISOString() ?? null,
  };
}

export async function getAdminDashboardOverview() {
  const [
    [studentCount, adminCount],
    [enrollmentCount, quizAttemptCount, completedLessonProgressCount],
    learningPaths,
    courses,
    modules,
    lessons,
    quizzes,
  ] = await Promise.all([
    countUsersByRole(),
    countAdminOperationalMetrics(),
    listAdminLearningPaths(),
    listAdminCourses(),
    listAdminModules(),
    listAdminLessons(),
    listAdminQuizzes(),
  ]);

  const workflowItems = sortWorkflowItems([
    ...learningPaths.map(mapLearningPathWorkflowItem),
    ...courses.map(mapCourseWorkflowItem),
    ...modules.map(mapModuleWorkflowItem),
    ...lessons.map(mapLessonWorkflowItem),
    ...quizzes.map(mapQuizWorkflowItem),
  ]);

  const totalContentCount = workflowItems.length;
  const publishedContentCount = workflowItems.filter((item) => item.status === "PUBLISHED").length;
  const draftContentCount = workflowItems.filter((item) => item.status === "DRAFT").length;
  const archivedContentCount = workflowItems.filter((item) => item.status === "ARCHIVED").length;

  return {
    studentCount,
    adminCount,
    enrollmentCount,
    quizAttemptCount,
    completedLessonProgressCount,
    totalContentCount,
    publishedContentCount,
    draftContentCount,
    archivedContentCount,
    inventory: [
      {
        entityType: "LEARNING_PATH" as const,
        label: getEntityLabel("LEARNING_PATH"),
        count: learningPaths.length,
        publishedCount: learningPaths.filter((item) => item.status === "PUBLISHED").length,
      },
      {
        entityType: "COURSE" as const,
        label: getEntityLabel("COURSE"),
        count: courses.length,
        publishedCount: courses.filter((item) => item.status === "PUBLISHED").length,
      },
      {
        entityType: "MODULE" as const,
        label: getEntityLabel("MODULE"),
        count: modules.length,
        publishedCount: modules.filter((item) => item.status === "PUBLISHED").length,
      },
      {
        entityType: "LESSON" as const,
        label: getEntityLabel("LESSON"),
        count: lessons.length,
        publishedCount: lessons.filter((item) => item.status === "PUBLISHED").length,
      },
      {
        entityType: "QUIZ" as const,
        label: getEntityLabel("QUIZ"),
        count: quizzes.length,
        publishedCount: quizzes.filter((item) => item.status === "PUBLISHED").length,
      },
    ],
    recentlyUpdated: workflowItems.slice(0, 8),
    recentlyPublished: workflowItems
      .filter((item) => item.publishedAt)
      .sort(
        (left, right) =>
          new Date(right.publishedAt ?? 0).getTime() -
          new Date(left.publishedAt ?? 0).getTime(),
      )
      .slice(0, 8),
  };
}

export async function getAdminContentWorkflow() {
  const [learningPaths, courses, modules, lessons, quizzes] = await Promise.all([
    listAdminLearningPaths(),
    listAdminCourses(),
    listAdminModules(),
    listAdminLessons(),
    listAdminQuizzes(),
  ]);

  const items = sortWorkflowItems([
    ...learningPaths.map(mapLearningPathWorkflowItem),
    ...courses.map(mapCourseWorkflowItem),
    ...modules.map(mapModuleWorkflowItem),
    ...lessons.map(mapLessonWorkflowItem),
    ...quizzes.map(mapQuizWorkflowItem),
  ]);

  return {
    totalCount: items.length,
    draftCount: items.filter((item) => item.status === "DRAFT").length,
    publishedCount: items.filter((item) => item.status === "PUBLISHED").length,
    archivedCount: items.filter((item) => item.status === "ARCHIVED").length,
    items,
    draftQueue: items.filter((item) => item.status === "DRAFT"),
    publishedQueue: items.filter((item) => item.status === "PUBLISHED"),
    archivedQueue: items.filter((item) => item.status === "ARCHIVED"),
  };
}

export async function getAdminLearningInventory() {
  const [learningPaths, courses, modules, lessons, quizzes] = await Promise.all([
    listAdminLearningPaths(),
    listAdminCourses(),
    listAdminModules(),
    listAdminLessons(),
    listAdminQuizzes(),
  ]);

  return {
    learningPaths,
    courses,
    modules,
    lessons,
    quizzes,
    formOptions: {
      learningPaths: learningPaths.map((item) => ({
        id: item.id,
        title: item.title,
      })),
      courses: courses.map((item) => ({
        id: item.id,
        title: item.title,
        platform: item.platform,
        level: item.level,
      })),
      modules: modules.map((item) => ({
        id: item.id,
        title: item.title,
        courseId: item.courseId,
      })),
      lessons: lessons.map((item) => ({
        id: item.id,
        title: item.title,
        courseId: item.courseId,
        courseModuleId: item.courseModuleId,
      })),
    },
  };
}

function getStatusUpdateData(status: ContentStatus) {
  if (status === "PUBLISHED") {
    return {
      status,
      publishedAt: new Date(),
    };
  }

  if (status === "DRAFT") {
    return {
      status,
      publishedAt: null,
    };
  }

  return {
    status,
  };
}

export async function updateAdminContentStatus(input: {
  entityType: AdminEntityType;
  entityId: string;
  status: ContentStatus;
}) {
  const data = getStatusUpdateData(input.status);

  switch (input.entityType) {
    case "LEARNING_PATH":
      return prisma.learningPath.update({
        where: {
          id: input.entityId,
        },
        data,
        select: {
          id: true,
          slug: true,
          title: true,
          status: true,
        },
      });

    case "COURSE":
      return prisma.course.update({
        where: {
          id: input.entityId,
        },
        data,
        select: {
          id: true,
          slug: true,
          title: true,
          status: true,
        },
      });

    case "MODULE":
      return prisma.courseModule.update({
        where: {
          id: input.entityId,
        },
        data,
        select: {
          id: true,
          slug: true,
          title: true,
          status: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      });

    case "LESSON":
      return prisma.lesson.update({
        where: {
          id: input.entityId,
        },
        data,
        select: {
          id: true,
          slug: true,
          title: true,
          status: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      });

    case "QUIZ":
      return prisma.quiz.update({
        where: {
          id: input.entityId,
        },
        data,
        select: {
          id: true,
          slug: true,
          title: true,
          status: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      });

    default:
      throw new Error("Entity type không hợp lệ.");
  }
}

async function saveLearningPath(values: AdminLearningPathFormInput) {
  return prisma.$transaction(async (tx) => {
    const learningPath = values.id
      ? await tx.learningPath.update({
          where: {
            id: values.id,
          },
          data: {
            title: values.title,
            slug: values.slug,
            summary: values.summary,
            description: values.description,
            platform: values.platform,
            level: values.level,
            sortOrder: values.sortOrder,
            estimatedHours: values.estimatedHours,
          },
          select: {
            id: true,
            title: true,
            slug: true,
          },
        })
      : await tx.learningPath.create({
          data: {
            title: values.title,
            slug: values.slug,
            summary: values.summary,
            description: values.description,
            platform: values.platform,
            level: values.level,
            sortOrder: values.sortOrder,
            estimatedHours: values.estimatedHours,
          },
          select: {
            id: true,
            title: true,
            slug: true,
          },
        });

    await tx.learningPathCourse.deleteMany({
      where: {
        learningPathId: learningPath.id,
      },
    });

    if (values.courseIds.length > 0) {
      await tx.learningPathCourse.createMany({
        data: values.courseIds.map((courseId, index) => ({
          learningPathId: learningPath.id,
          courseId,
          sortOrder: index,
        })),
      });
    }

    return learningPath;
  });
}

async function saveCourse(values: AdminCourseFormInput) {
  return prisma.$transaction(async (tx) => {
    const course = values.id
      ? await tx.course.update({
          where: {
            id: values.id,
          },
          data: {
            title: values.title,
            slug: values.slug,
            summary: values.summary,
            description: values.description,
            platform: values.platform,
            level: values.level,
            sortOrder: values.sortOrder,
            estimatedHours: values.estimatedHours,
            thumbnailUrl: values.thumbnailUrl,
          },
          select: {
            id: true,
            title: true,
            slug: true,
          },
        })
      : await tx.course.create({
          data: {
            title: values.title,
            slug: values.slug,
            summary: values.summary,
            description: values.description,
            platform: values.platform,
            level: values.level,
            sortOrder: values.sortOrder,
            estimatedHours: values.estimatedHours,
            thumbnailUrl: values.thumbnailUrl,
          },
          select: {
            id: true,
            title: true,
            slug: true,
          },
        });

    await tx.learningPathCourse.deleteMany({
      where: {
        courseId: course.id,
      },
    });

    if (values.learningPathIds.length > 0) {
      await tx.learningPathCourse.createMany({
        data: values.learningPathIds.map((learningPathId, index) => ({
          learningPathId,
          courseId: course.id,
          sortOrder: index,
        })),
      });
    }

    return course;
  });
}

async function saveModule(values: AdminModuleFormInput) {
  const course = await prisma.course.findUnique({
    where: {
      id: values.courseId,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw new Error("Course được chọn không tồn tại.");
  }

  return values.id
    ? prisma.courseModule.update({
        where: {
          id: values.id,
        },
        data: {
          courseId: values.courseId,
          title: values.title,
          slug: values.slug,
          summary: values.summary,
          description: values.description,
          sortOrder: values.sortOrder,
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      })
    : prisma.courseModule.create({
        data: {
          courseId: values.courseId,
          title: values.title,
          slug: values.slug,
          summary: values.summary,
          description: values.description,
          sortOrder: values.sortOrder,
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      });
}

async function saveLesson(values: AdminLessonFormInput) {
  const courseModuleRecord = await prisma.courseModule.findUnique({
    where: {
      id: values.courseModuleId,
    },
    select: {
      id: true,
      courseId: true,
    },
  });

  if (!courseModuleRecord) {
    throw new Error("Module được chọn không tồn tại.");
  }

  if (courseModuleRecord.courseId !== values.courseId) {
    throw new Error("Module không thuộc course đã chọn.");
  }

  return values.id
    ? prisma.lesson.update({
        where: {
          id: values.id,
        },
        data: {
          courseId: values.courseId,
          courseModuleId: values.courseModuleId,
          title: values.title,
          slug: values.slug,
          summary: values.summary,
          description: values.description,
          sortOrder: values.sortOrder,
          estimatedMinutes: values.estimatedMinutes,
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      })
    : prisma.lesson.create({
        data: {
          courseId: values.courseId,
          courseModuleId: values.courseModuleId,
          title: values.title,
          slug: values.slug,
          summary: values.summary,
          description: values.description,
          sortOrder: values.sortOrder,
          estimatedMinutes: values.estimatedMinutes,
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      });
}

async function saveQuiz(values: AdminQuizFormInput) {
  const course = await prisma.course.findUnique({
    where: {
      id: values.courseId,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw new Error("Course được chọn không tồn tại.");
  }

  if (values.courseModuleId) {
    const courseModuleRecord = await prisma.courseModule.findUnique({
      where: {
        id: values.courseModuleId,
      },
      select: {
        id: true,
        courseId: true,
      },
    });

    if (!courseModuleRecord || courseModuleRecord.courseId !== values.courseId) {
      throw new Error("Module được chọn không thuộc course này.");
    }
  }

  if (values.lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: values.lessonId,
      },
      select: {
        id: true,
        courseId: true,
        courseModuleId: true,
      },
    });

    if (!lesson || lesson.courseId !== values.courseId) {
      throw new Error("Lesson được chọn không thuộc course này.");
    }

    if (values.courseModuleId && lesson.courseModuleId !== values.courseModuleId) {
      throw new Error("Lesson không thuộc module đã chọn.");
    }
  }

  return values.id
    ? prisma.quiz.update({
        where: {
          id: values.id,
        },
        data: {
          courseId: values.courseId,
          courseModuleId: values.courseModuleId,
          lessonId: values.lessonId,
          title: values.title,
          slug: values.slug,
          description: values.description,
          passingScore: values.passingScore,
          timeLimitMinutes: values.timeLimitMinutes,
          maxAttempts: values.maxAttempts,
          sortOrder: values.sortOrder,
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      })
    : prisma.quiz.create({
        data: {
          courseId: values.courseId,
          courseModuleId: values.courseModuleId,
          lessonId: values.lessonId,
          title: values.title,
          slug: values.slug,
          description: values.description,
          passingScore: values.passingScore,
          timeLimitMinutes: values.timeLimitMinutes,
          maxAttempts: values.maxAttempts,
          sortOrder: values.sortOrder,
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      });
}

export async function saveAdminLearningEntity(input: AdminLearningEntityInput) {
  switch (input.entityType) {
    case "LEARNING_PATH":
      return saveLearningPath(input.values);
    case "COURSE":
      return saveCourse(input.values);
    case "MODULE":
      return saveModule(input.values);
    case "LESSON":
      return saveLesson(input.values);
    case "QUIZ":
      return saveQuiz(input.values);
    default:
      throw new Error("Entity type không hợp lệ.");
  }
}

export async function getAdminUserAnalytics() {
  const [users, courses, quizzes, [studentCount, adminCount]] = await Promise.all([
    listUsersWithLearningAnalytics(),
    listCoursesWithAnalytics(),
    listQuizzesWithAnalytics(),
    countUsersByRole(),
  ]);

  const studentUsers = users.filter((user) => user.role === "STUDENT");
  const activeStudentCount = studentUsers.filter(
    (user) =>
      user.enrollments.length > 0 ||
      user.lessonProgress.length > 0 ||
      user.quizAttempts.length > 0,
  ).length;

  const topStudents = studentUsers
    .map((user) => {
      const completedEnrollmentCount = user.enrollments.filter(
        (item) => item.status === "COMPLETED",
      ).length;
      const completedLessonCount = user.lessonProgress.filter(
        (item) => item.status === "COMPLETED",
      ).length;
      const passedAttemptCount = user.quizAttempts.filter(
        (item) => (item.score ?? 0) >= item.quiz.passingScore,
      ).length;
      const averageScore =
        user.quizAttempts.length > 0
          ? Math.round(
              user.quizAttempts.reduce((sum, item) => sum + (item.score ?? 0), 0) /
                user.quizAttempts.length,
            )
          : 0;
      const learningScore =
        completedEnrollmentCount * 100 +
        completedLessonCount * 10 +
        passedAttemptCount * 5 +
        averageScore;

      return {
        id: user.id,
        name: user.name ?? user.email,
        email: user.email,
        enrollmentCount: user.enrollments.length,
        completedEnrollmentCount,
        completedLessonCount,
        quizAttemptCount: user.quizAttempts.length,
        passedAttemptCount,
        averageScore,
        learningScore,
        createdAt: user.createdAt.toISOString(),
      };
    })
    .sort((left, right) => right.learningScore - left.learningScore)
    .slice(0, 10);

  const courseAnalytics = courses
    .map((course) => {
      const completedEnrollmentCount = course.enrollments.filter(
        (item) => item.status === "COMPLETED",
      ).length;
      const lessonCompletionCount = course.lessons.reduce(
        (sum, lesson) => sum + lesson.progressEntries.length,
        0,
      );
      const quizAttemptCount = course.quizzes.reduce(
        (sum, quiz) => sum + quiz.attempts.length,
        0,
      );
      const passedAttemptCount = course.quizzes.reduce(
        (sum, quiz) =>
          sum + quiz.attempts.filter((attempt) => (attempt.score ?? 0) >= quiz.passingScore).length,
        0,
      );

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        status: course.status,
        enrollmentCount: course.enrollments.length,
        completedEnrollmentCount,
        lessonCompletionCount,
        quizAttemptCount,
        passRate: quizAttemptCount > 0 ? Math.round((passedAttemptCount / quizAttemptCount) * 100) : 0,
      };
    })
    .sort((left, right) => right.enrollmentCount - left.enrollmentCount);

  const quizAnalytics = quizzes
    .map((quiz) => {
      const averageScore =
        quiz.attempts.length > 0
          ? Math.round(
              quiz.attempts.reduce((sum, attempt) => sum + (attempt.score ?? 0), 0) /
                quiz.attempts.length,
            )
          : 0;
      const passRate =
        quiz.attempts.length > 0
          ? Math.round(
              (quiz.attempts.filter((attempt) => (attempt.score ?? 0) >= quiz.passingScore).length /
                quiz.attempts.length) *
                100,
            )
          : 0;

      return {
        id: quiz.id,
        title: quiz.title,
        courseTitle: quiz.course.title,
        status: quiz.status,
        attemptCount: quiz.attempts.length,
        averageScore,
        passRate,
      };
    })
    .sort((left, right) => right.attemptCount - left.attemptCount);

  return {
    totalUserCount: users.length,
    studentCount,
    adminCount,
    activeStudentCount,
    topStudents,
    topCourses: courseAnalytics.slice(0, 10),
    topQuizzes: quizAnalytics.slice(0, 10),
  };
}
