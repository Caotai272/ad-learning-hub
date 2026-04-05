import { ContentStatus } from "@prisma/client";

import { getLevelLabel, getPlatformLabel } from "@/lib/learning";
import {
  countAdminOperationalMetrics,
  countUsersByRole,
  listAdminCourses,
  listAdminLearningPaths,
  listAdminLessons,
  listAdminModules,
  listAdminQuizzes,
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
