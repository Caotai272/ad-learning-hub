import { ContentStatus, LessonBlockType, QuizQuestionType } from "@prisma/client";

import { getLevelLabel, getPlatformLabel } from "@/lib/learning";
import type {
  AdminCourseFormInput,
  AdminLearningEntityDeleteInput,
  AdminLearningEntityInput,
  AdminLearningPathFormInput,
  AdminLessonFormInput,
  AdminLessonBlockFormInput,
  AdminModuleFormInput,
  AdminQuizFormInput,
  AdminQuizQuestionFormInput,
  AdminLearningEntityReorderInput,
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
export type AdminSortDirection = "UP" | "DOWN";

type AdminDeleteImpactItem = {
  label: string;
  value: number;
  tone: "neutral" | "warning" | "blocked";
};

type AdminDeleteImpact = {
  title: string;
  confirmationText: string;
  canDelete: boolean;
  blockingReason: string | null;
  impactItems: AdminDeleteImpactItem[];
};

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

function moveItemsByDirection<T extends { id: string }>(
  items: T[],
  targetId: string,
  direction: AdminSortDirection,
) {
  const currentIndex = items.findIndex((item) => item.id === targetId);

  if (currentIndex < 0) {
    throw new Error("Không tìm thấy item cần sắp xếp.");
  }

  const nextIndex = direction === "UP" ? currentIndex - 1 : currentIndex + 1;

  if (nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(currentIndex, 1);
  nextItems.splice(nextIndex, 0, movedItem);

  return nextItems;
}

function buildDeleteImpactItem(
  label: string,
  value: number,
  tone: AdminDeleteImpactItem["tone"] = "neutral",
): AdminDeleteImpactItem {
  return {
    label,
    value,
    tone,
  };
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

async function reorderLearningPath(input: AdminLearningEntityReorderInput) {
  return prisma.$transaction(async (tx) => {
    const items = await tx.learningPath.findMany({
      select: {
        id: true,
      },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });

    const nextItems = moveItemsByDirection(items, input.entityId, input.direction);

    await Promise.all(
      nextItems.map((item, index) =>
        tx.learningPath.update({
          where: {
            id: item.id,
          },
          data: {
            sortOrder: index,
          },
        }),
      ),
    );

    return tx.learningPath.findUniqueOrThrow({
      where: {
        id: input.entityId,
      },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });
  });
}

async function reorderCourse(input: AdminLearningEntityReorderInput) {
  return prisma.$transaction(async (tx) => {
    const items = await tx.course.findMany({
      select: {
        id: true,
      },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });

    const nextItems = moveItemsByDirection(items, input.entityId, input.direction);

    await Promise.all(
      nextItems.map((item, index) =>
        tx.course.update({
          where: {
            id: item.id,
          },
          data: {
            sortOrder: index,
          },
        }),
      ),
    );

    return tx.course.findUniqueOrThrow({
      where: {
        id: input.entityId,
      },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });
  });
}

async function reorderModule(input: AdminLearningEntityReorderInput) {
  return prisma.$transaction(async (tx) => {
    const currentModule = await tx.courseModule.findUnique({
      where: {
        id: input.entityId,
      },
      select: {
        id: true,
        courseId: true,
      },
    });

    if (!currentModule) {
      throw new Error("Module không tồn tại.");
    }

    const items = await tx.courseModule.findMany({
      where: {
        courseId: currentModule.courseId,
      },
      select: {
        id: true,
      },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });

    const nextItems = moveItemsByDirection(items, input.entityId, input.direction);

    await Promise.all(
      nextItems.map((item, index) =>
        tx.courseModule.update({
          where: {
            id: item.id,
          },
          data: {
            sortOrder: index,
          },
        }),
      ),
    );

    return tx.courseModule.findUniqueOrThrow({
      where: {
        id: input.entityId,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        course: {
          select: {
            slug: true,
          },
        },
      },
    });
  });
}

async function reorderLesson(input: AdminLearningEntityReorderInput) {
  return prisma.$transaction(async (tx) => {
    const currentLesson = await tx.lesson.findUnique({
      where: {
        id: input.entityId,
      },
      select: {
        id: true,
        courseModuleId: true,
      },
    });

    if (!currentLesson) {
      throw new Error("Lesson không tồn tại.");
    }

    const items = await tx.lesson.findMany({
      where: {
        courseModuleId: currentLesson.courseModuleId,
      },
      select: {
        id: true,
      },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });

    const nextItems = moveItemsByDirection(items, input.entityId, input.direction);

    await Promise.all(
      nextItems.map((item, index) =>
        tx.lesson.update({
          where: {
            id: item.id,
          },
          data: {
            sortOrder: index,
          },
        }),
      ),
    );

    return tx.lesson.findUniqueOrThrow({
      where: {
        id: input.entityId,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        course: {
          select: {
            slug: true,
          },
        },
      },
    });
  });
}

async function reorderQuiz(input: AdminLearningEntityReorderInput) {
  return prisma.$transaction(async (tx) => {
    const currentQuiz = await tx.quiz.findUnique({
      where: {
        id: input.entityId,
      },
      select: {
        id: true,
        courseId: true,
      },
    });

    if (!currentQuiz) {
      throw new Error("Quiz không tồn tại.");
    }

    const items = await tx.quiz.findMany({
      where: {
        courseId: currentQuiz.courseId,
      },
      select: {
        id: true,
      },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });

    const nextItems = moveItemsByDirection(items, input.entityId, input.direction);

    await Promise.all(
      nextItems.map((item, index) =>
        tx.quiz.update({
          where: {
            id: item.id,
          },
          data: {
            sortOrder: index,
          },
        }),
      ),
    );

    return tx.quiz.findUniqueOrThrow({
      where: {
        id: input.entityId,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        course: {
          select: {
            slug: true,
          },
        },
      },
    });
  });
}

export async function reorderAdminLearningEntity(input: AdminLearningEntityReorderInput) {
  switch (input.entityType) {
    case "LEARNING_PATH":
      return reorderLearningPath(input);
    case "COURSE":
      return reorderCourse(input);
    case "MODULE":
      return reorderModule(input);
    case "LESSON":
      return reorderLesson(input);
    case "QUIZ":
      return reorderQuiz(input);
    default:
      throw new Error("Entity type không hợp lệ.");
  }
}

export async function getAdminLearningEntityDeleteImpact(input: {
  entityType: AdminEntityType;
  entityId: string;
}): Promise<AdminDeleteImpact> {
  switch (input.entityType) {
    case "LEARNING_PATH": {
      const learningPath = await prisma.learningPath.findUnique({
        where: {
          id: input.entityId,
        },
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              courses: true,
            },
          },
        },
      });

      if (!learningPath) {
        throw new Error("Learning path không tồn tại.");
      }

      return {
        title: learningPath.title,
        confirmationText: learningPath.title,
        canDelete: true,
        blockingReason: null,
        impactItems: [
          buildDeleteImpactItem(
            "Course liên kết sẽ bị gỡ khỏi learning path",
            learningPath._count.courses,
            learningPath._count.courses > 0 ? "warning" : "neutral",
          ),
        ],
      };
    }

    case "COURSE": {
      const [course, lessonProgressCount, quizAttemptCount] = await Promise.all([
        prisma.course.findUnique({
          where: {
            id: input.entityId,
          },
          select: {
            id: true,
            title: true,
            _count: {
              select: {
                learningPaths: true,
                modules: true,
                lessons: true,
                quizzes: true,
                enrollments: true,
              },
            },
          },
        }),
        prisma.lessonProgress.count({
          where: {
            lesson: {
              courseId: input.entityId,
            },
          },
        }),
        prisma.quizAttempt.count({
          where: {
            quiz: {
              courseId: input.entityId,
            },
          },
        }),
      ]);

      if (!course) {
        throw new Error("Course không tồn tại.");
      }

      const hasLearningData =
        course._count.enrollments > 0 || lessonProgressCount > 0 || quizAttemptCount > 0;

      return {
        title: course.title,
        confirmationText: course.title,
        canDelete: !hasLearningData,
        blockingReason: hasLearningData
          ? "Course này đã có dữ liệu học tập thực tế. Hãy chuyển sang ARCHIVED thay vì xóa để tránh mất enrollment, tiến độ lesson hoặc quiz attempt."
          : null,
        impactItems: [
          buildDeleteImpactItem(
            "Learning path liên kết",
            course._count.learningPaths,
            course._count.learningPaths > 0 ? "warning" : "neutral",
          ),
          buildDeleteImpactItem(
            "Module sẽ bị xóa",
            course._count.modules,
            course._count.modules > 0 ? "warning" : "neutral",
          ),
          buildDeleteImpactItem(
            "Lesson sẽ bị xóa",
            course._count.lessons,
            course._count.lessons > 0 ? "warning" : "neutral",
          ),
          buildDeleteImpactItem(
            "Quiz sẽ bị xóa",
            course._count.quizzes,
            course._count.quizzes > 0 ? "warning" : "neutral",
          ),
          buildDeleteImpactItem(
            "Enrollment hiện có",
            course._count.enrollments,
            course._count.enrollments > 0 ? "blocked" : "neutral",
          ),
          buildDeleteImpactItem(
            "Lesson progress hiện có",
            lessonProgressCount,
            lessonProgressCount > 0 ? "blocked" : "neutral",
          ),
          buildDeleteImpactItem(
            "Quiz attempt hiện có",
            quizAttemptCount,
            quizAttemptCount > 0 ? "blocked" : "neutral",
          ),
        ],
      };
    }

    case "MODULE": {
      const [module, lessonProgressCount] = await Promise.all([
        prisma.courseModule.findUnique({
          where: {
            id: input.entityId,
          },
          select: {
            id: true,
            title: true,
            _count: {
              select: {
                lessons: true,
                quizzes: true,
              },
            },
          },
        }),
        prisma.lessonProgress.count({
          where: {
            lesson: {
              courseModuleId: input.entityId,
            },
          },
        }),
      ]);

      if (!module) {
        throw new Error("Module không tồn tại.");
      }

      return {
        title: module.title,
        confirmationText: module.title,
        canDelete: lessonProgressCount === 0,
        blockingReason:
          lessonProgressCount > 0
            ? "Module này đã có tiến độ học ở các lesson bên trong. Hãy chuyển module sang ARCHIVED hoặc di chuyển lesson trước khi xóa."
            : null,
        impactItems: [
          buildDeleteImpactItem(
            "Lesson sẽ bị xóa",
            module._count.lessons,
            module._count.lessons > 0 ? "warning" : "neutral",
          ),
          buildDeleteImpactItem(
            "Quiz đang gắn module sẽ bị tách module",
            module._count.quizzes,
            module._count.quizzes > 0 ? "warning" : "neutral",
          ),
          buildDeleteImpactItem(
            "Lesson progress hiện có",
            lessonProgressCount,
            lessonProgressCount > 0 ? "blocked" : "neutral",
          ),
        ],
      };
    }

    case "LESSON": {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id: input.entityId,
        },
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              blocks: true,
              quizzes: true,
              progressEntries: true,
            },
          },
        },
      });

      if (!lesson) {
        throw new Error("Lesson không tồn tại.");
      }

      return {
        title: lesson.title,
        confirmationText: lesson.title,
        canDelete: lesson._count.progressEntries === 0,
        blockingReason:
          lesson._count.progressEntries > 0
            ? "Lesson này đã có tiến độ học của học viên. Hãy chuyển sang ARCHIVED thay vì xóa."
            : null,
        impactItems: [
          buildDeleteImpactItem(
            "Lesson block sẽ bị xóa",
            lesson._count.blocks,
            lesson._count.blocks > 0 ? "warning" : "neutral",
          ),
          buildDeleteImpactItem(
            "Quiz liên kết sẽ bị tách lesson",
            lesson._count.quizzes,
            lesson._count.quizzes > 0 ? "warning" : "neutral",
          ),
          buildDeleteImpactItem(
            "Lesson progress hiện có",
            lesson._count.progressEntries,
            lesson._count.progressEntries > 0 ? "blocked" : "neutral",
          ),
        ],
      };
    }

    case "QUIZ": {
      const quiz = await prisma.quiz.findUnique({
        where: {
          id: input.entityId,
        },
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              questions: true,
              attempts: true,
            },
          },
        },
      });

      if (!quiz) {
        throw new Error("Quiz không tồn tại.");
      }

      return {
        title: quiz.title,
        confirmationText: quiz.title,
        canDelete: quiz._count.attempts === 0,
        blockingReason:
          quiz._count.attempts > 0
            ? "Quiz này đã có attempt của học viên. Hãy chuyển sang ARCHIVED thay vì xóa để giữ dữ liệu chấm điểm."
            : null,
        impactItems: [
          buildDeleteImpactItem(
            "Question sẽ bị xóa",
            quiz._count.questions,
            quiz._count.questions > 0 ? "warning" : "neutral",
          ),
          buildDeleteImpactItem(
            "Quiz attempt hiện có",
            quiz._count.attempts,
            quiz._count.attempts > 0 ? "blocked" : "neutral",
          ),
        ],
      };
    }

    default:
      throw new Error("Entity type không hợp lệ.");
  }
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

export async function deleteAdminLearningEntity(input: AdminLearningEntityDeleteInput) {
  const impact = await getAdminLearningEntityDeleteImpact({
    entityType: input.entityType,
    entityId: input.entityId,
  });

  if (!impact.canDelete) {
    throw new Error(impact.blockingReason ?? "KhÃ´ng thá»ƒ xÃ³a entity nÃ y lÃºc nÃ y.");
  }

  if (input.confirmationText.trim() !== impact.confirmationText.trim()) {
    throw new Error("TÃªn xÃ¡c nháº­n khÃ´ng khá»›p. HÃ£y nháº­p Ä‘Ãºng tÃªn entity Ä‘á»ƒ xÃ³a.");
  }

  switch (input.entityType) {
    case "LEARNING_PATH":
      return prisma.learningPath.delete({
        where: {
          id: input.entityId,
        },
        select: {
          id: true,
          slug: true,
          title: true,
        },
      });

    case "COURSE":
      return prisma.course.delete({
        where: {
          id: input.entityId,
        },
        select: {
          id: true,
          slug: true,
          title: true,
        },
      });

    case "MODULE":
      return prisma.courseModule.delete({
        where: {
          id: input.entityId,
        },
        select: {
          id: true,
          slug: true,
          title: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      });

    case "LESSON":
      return prisma.lesson.delete({
        where: {
          id: input.entityId,
        },
        select: {
          id: true,
          slug: true,
          title: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      });

    case "QUIZ":
      return prisma.quiz.delete({
        where: {
          id: input.entityId,
        },
        select: {
          id: true,
          slug: true,
          title: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      });

    default:
      throw new Error("Entity type khÃ´ng há»£p lá»‡.");
  }
}

function requireValue(value: string | null, message: string) {
  if (!value?.trim()) {
    throw new Error(message);
  }

  return value.trim();
}

function buildLessonBlockContent(input: AdminLessonBlockFormInput) {
  switch (input.type) {
    case LessonBlockType.TEXT:
      return {
        body: requireValue(input.body, "Block TEXT cần nội dung body."),
      };
    case LessonBlockType.CALLOUT:
      return {
        body: requireValue(input.body, "Block CALLOUT cần nội dung body."),
        tone: input.tone ?? "info",
      };
    case LessonBlockType.CHECKLIST:
      return {
        items: requireValue(input.itemsText, "Block CHECKLIST cần danh sách item.")
          .split(/\r?\n/g)
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const isChecked = line.startsWith("[x]") || line.startsWith("[X]");
            const text = line.replace(/^\[(x|X| )\]\s*/, "").trim();

            return {
              text,
              checked: isChecked,
            };
          }),
      };
    case LessonBlockType.TABLE: {
      const columns = requireValue(input.columnsText, "Block TABLE cần columns.")
        .split(/\r?\n/g)
        .map((line) => line.trim())
        .filter(Boolean);
      const rows = requireValue(input.rowsText, "Block TABLE cần rows.")
        .split(/\r?\n/g)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.split("|").map((item) => item.trim()));

      return {
        columns,
        rows,
      };
    }
    case LessonBlockType.METRIC_CARD:
      return {
        items: requireValue(input.metricItemsText, "Block METRIC_CARD cần danh sách item.")
          .split(/\r?\n/g)
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [label, value, description, trend] = line.split("|").map((item) => item.trim());

            return {
              label,
              value,
              description: description || undefined,
              trend:
                trend === "up" || trend === "down" || trend === "neutral"
                  ? trend
                  : undefined,
            };
          }),
      };
    case LessonBlockType.IMAGE:
      return {
        src: requireValue(input.src, "Block IMAGE cần src."),
        alt: requireValue(input.alt, "Block IMAGE cần alt."),
        caption: input.caption ?? undefined,
      };
    case LessonBlockType.VIDEO:
      return {
        src: requireValue(input.src, "Block VIDEO cần src."),
        poster: input.poster ?? undefined,
        caption: input.caption ?? undefined,
      };
    case LessonBlockType.EMBED:
      return {
        src: requireValue(input.src, "Block EMBED cần src."),
        title: input.title ?? undefined,
        caption: input.caption ?? undefined,
      };
    default:
      throw new Error("Loại lesson block không hợp lệ.");
  }
}

function parseQuizChoices(input: AdminQuizQuestionFormInput) {
  const lines = requireValue(
    input.choicesText,
    "Question cần choicesText hoặc danh sách đáp án phù hợp.",
  )
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean);

  if (input.type === QuizQuestionType.SHORT_TEXT) {
    return lines.map((line, index) => ({
      label: line,
      value: line,
      explanation: null,
      isCorrect: true,
      sortOrder: index,
    }));
  }

  return lines.map((line, index) => {
    const [label, correctText, valueText, explanationText] = line
      .split("|")
      .map((item) => item.trim());

    return {
      label,
      value: valueText || null,
      explanation: explanationText || null,
      isCorrect:
        correctText?.toLowerCase() === "true" ||
        correctText?.toLowerCase() === "1" ||
        correctText?.toLowerCase() === "yes",
      sortOrder: index,
    };
  });
}

export async function saveAdminLessonBlock(input: AdminLessonBlockFormInput) {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: input.lessonId,
    },
    select: {
      id: true,
      slug: true,
      course: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new Error("Lesson không tồn tại.");
  }

  const content = buildLessonBlockContent(input);

  const block = input.id
    ? await prisma.lessonBlock.update({
        where: {
          id: input.id,
        },
        data: {
          lessonId: input.lessonId,
          type: input.type,
          title: input.title,
          sortOrder: input.sortOrder,
          content,
        },
        select: {
          id: true,
          lessonId: true,
          type: true,
          title: true,
        },
      })
    : await prisma.lessonBlock.create({
        data: {
          lessonId: input.lessonId,
          type: input.type,
          title: input.title,
          sortOrder: input.sortOrder,
          content,
        },
        select: {
          id: true,
          lessonId: true,
          type: true,
          title: true,
        },
      });

  return {
    ...block,
    lessonSlug: lesson.slug,
    courseSlug: lesson.course.slug,
  };
}

export async function deleteAdminLessonBlock(blockId: string) {
  const block = await prisma.lessonBlock.findUnique({
    where: {
      id: blockId,
    },
    select: {
      id: true,
      lesson: {
        select: {
          slug: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!block) {
    throw new Error("Lesson block không tồn tại.");
  }

  await prisma.lessonBlock.delete({
    where: {
      id: blockId,
    },
  });

  return {
    id: block.id,
    lessonSlug: block.lesson.slug,
    courseSlug: block.lesson.course.slug,
  };
}

export async function reorderAdminLessonBlock(input: {
  blockId: string;
  direction: AdminSortDirection;
}) {
  return prisma.$transaction(async (tx) => {
    const currentBlock = await tx.lessonBlock.findUnique({
      where: {
        id: input.blockId,
      },
      select: {
        id: true,
        lessonId: true,
      },
    });

    if (!currentBlock) {
      throw new Error("Lesson block khÃ´ng tá»“n táº¡i.");
    }

    const items = await tx.lessonBlock.findMany({
      where: {
        lessonId: currentBlock.lessonId,
      },
      select: {
        id: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    const nextItems = moveItemsByDirection(items, input.blockId, input.direction);

    await Promise.all(
      nextItems.map((item, index) =>
        tx.lessonBlock.update({
          where: {
            id: item.id,
          },
          data: {
            sortOrder: index,
          },
        }),
      ),
    );

    const block = await tx.lessonBlock.findUniqueOrThrow({
      where: {
        id: input.blockId,
      },
      select: {
        id: true,
        lesson: {
          select: {
            slug: true,
            course: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    return {
      id: block.id,
      lessonSlug: block.lesson.slug,
      courseSlug: block.lesson.course.slug,
    };
  });
}

export async function saveAdminQuizQuestion(input: AdminQuizQuestionFormInput) {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: input.quizId,
    },
    select: {
      id: true,
      slug: true,
      course: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz không tồn tại.");
  }

  const choices = parseQuizChoices(input);

  if (input.type !== QuizQuestionType.SHORT_TEXT && choices.length < 2) {
    throw new Error("Question cần ít nhất 2 choices.");
  }

  if (!choices.some((choice) => choice.isCorrect)) {
    throw new Error("Question cần ít nhất một choice đúng.");
  }

  return prisma.$transaction(async (tx) => {
    const question = input.id
      ? await tx.quizQuestion.update({
          where: {
            id: input.id,
          },
          data: {
            quizId: input.quizId,
            type: input.type,
            prompt: input.prompt,
            explanation: input.explanation,
            points: input.points,
            sortOrder: input.sortOrder,
          },
          select: {
            id: true,
            quizId: true,
            prompt: true,
          },
        })
      : await tx.quizQuestion.create({
          data: {
            quizId: input.quizId,
            type: input.type,
            prompt: input.prompt,
            explanation: input.explanation,
            points: input.points,
            sortOrder: input.sortOrder,
          },
          select: {
            id: true,
            quizId: true,
            prompt: true,
          },
        });

    await tx.quizChoice.deleteMany({
      where: {
        questionId: question.id,
      },
    });

    await tx.quizChoice.createMany({
      data: choices.map((choice) => ({
        questionId: question.id,
        label: choice.label,
        value: choice.value,
        explanation: choice.explanation,
        isCorrect: choice.isCorrect,
        sortOrder: choice.sortOrder,
      })),
    });

    return {
      ...question,
      quizSlug: quiz.slug,
      courseSlug: quiz.course.slug,
    };
  });
}

export async function deleteAdminQuizQuestion(questionId: string) {
  const question = await prisma.quizQuestion.findUnique({
    where: {
      id: questionId,
    },
    select: {
      id: true,
      quiz: {
        select: {
          slug: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!question) {
    throw new Error("Quiz question không tồn tại.");
  }

  await prisma.quizQuestion.delete({
    where: {
      id: questionId,
    },
  });

  return {
    id: question.id,
    quizSlug: question.quiz.slug,
    courseSlug: question.quiz.course.slug,
  };
}

export async function reorderAdminQuizQuestion(input: {
  questionId: string;
  direction: AdminSortDirection;
}) {
  return prisma.$transaction(async (tx) => {
    const currentQuestion = await tx.quizQuestion.findUnique({
      where: {
        id: input.questionId,
      },
      select: {
        id: true,
        quizId: true,
      },
    });

    if (!currentQuestion) {
      throw new Error("Quiz question khÃ´ng tá»“n táº¡i.");
    }

    const items = await tx.quizQuestion.findMany({
      where: {
        quizId: currentQuestion.quizId,
      },
      select: {
        id: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    const nextItems = moveItemsByDirection(items, input.questionId, input.direction);

    await Promise.all(
      nextItems.map((item, index) =>
        tx.quizQuestion.update({
          where: {
            id: item.id,
          },
          data: {
            sortOrder: index,
          },
        }),
      ),
    );

    const question = await tx.quizQuestion.findUniqueOrThrow({
      where: {
        id: input.questionId,
      },
      select: {
        id: true,
        quiz: {
          select: {
            slug: true,
            course: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    return {
      id: question.id,
      quizSlug: question.quiz.slug,
      courseSlug: question.quiz.course.slug,
    };
  });
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
