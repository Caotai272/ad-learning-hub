import { notFound } from "next/navigation";
import { Prisma, type QuizQuestionType } from "@prisma/client";

import {
  countSubmittedQuizAttempts,
  findCompletedLessonProgressByCourseIds,
  findCompletedQuizAttemptsByCourseIds,
  findLatestGradedQuizAttempt,
  findLatestLessonProgress,
  findLessonProgress,
  findPublishedLessonProgressContext,
  findPublishedQuizAttemptContext,
  listStudentEnrollments,
} from "@/modules/student-learning/student-learning.repository";
import type { QuizSubmissionInput } from "@/modules/student-learning/student-learning.schema";
import { prisma } from "@/server/db";

type DbClient = Prisma.TransactionClient | typeof prisma;

type CourseProgressSummary = {
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  completedQuizzes: number;
  progressPercent: number;
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function calculateProgressPercent(
  completedLessons: number,
  totalLessons: number,
  completedQuizzes: number,
  totalQuizzes: number,
) {
  const totalSteps = totalLessons + totalQuizzes;

  if (totalSteps === 0) {
    return 0;
  }

  return Math.round(((completedLessons + completedQuizzes) / totalSteps) * 100);
}

async function getCourseProgressSummary(
  db: DbClient,
  userId: string,
  courseId: string,
): Promise<CourseProgressSummary> {
  const [totalLessons, totalQuizzes, completedLessons, completedQuizAttempts] = await Promise.all([
    db.lesson.count({
      where: {
        courseId,
        status: "PUBLISHED",
      },
    }),
    db.quiz.count({
      where: {
        courseId,
        status: "PUBLISHED",
      },
    }),
    db.lessonProgress.count({
      where: {
        userId,
        status: "COMPLETED",
        lesson: {
          courseId,
        },
      },
    }),
    db.quizAttempt.findMany({
      where: {
        userId,
        status: "GRADED",
        quiz: {
          courseId,
        },
      },
      distinct: ["quizId"],
      select: {
        quizId: true,
      },
    }),
  ]);

  const completedQuizzes = completedQuizAttempts.length;

  return {
    totalLessons,
    completedLessons,
    totalQuizzes,
    completedQuizzes,
    progressPercent: calculateProgressPercent(
      completedLessons,
      totalLessons,
      completedQuizzes,
      totalQuizzes,
    ),
  };
}

async function syncEnrollmentStatus(
  db: DbClient,
  userId: string,
  courseId: string,
  summary: CourseProgressSummary,
  touchedAt: Date,
) {
  return db.enrollment.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {
      lastAccessedAt: touchedAt,
      status: summary.progressPercent === 100 ? "COMPLETED" : "ACTIVE",
      completedAt: summary.progressPercent === 100 ? touchedAt : null,
    },
    create: {
      userId,
      courseId,
      lastAccessedAt: touchedAt,
      status: summary.progressPercent === 100 ? "COMPLETED" : "ACTIVE",
      completedAt: summary.progressPercent === 100 ? touchedAt : null,
    },
  });
}

function scoreQuestion(
  question: {
    id: string;
    type: QuizQuestionType;
    points: number;
    choices: Array<{
      id: string;
      label: string;
      value: string | null;
      isCorrect: boolean;
    }>;
  },
  submittedAnswer:
    | {
        questionId: string;
        selectedChoiceIds: string[];
        answerText?: string;
      }
    | undefined,
) {
  const validChoiceIds = new Set(question.choices.map((choice) => choice.id));
  const selectedChoiceIds = Array.from(
    new Set((submittedAnswer?.selectedChoiceIds ?? []).filter((choiceId) => validChoiceIds.has(choiceId))),
  );
  const correctChoices = question.choices.filter((choice) => choice.isCorrect);
  const correctChoiceIds = correctChoices.map((choice) => choice.id).sort();
  const answerText = submittedAnswer?.answerText?.trim() || null;

  if (question.type === "SHORT_TEXT") {
    const expectedAnswers = correctChoices
      .map((choice) => choice.value ?? choice.label)
      .map(normalizeText);
    const isCorrect =
      Boolean(answerText) && expectedAnswers.includes(normalizeText(answerText ?? ""));

    return {
      questionId: question.id,
      isCorrect,
      pointsAwarded: isCorrect ? question.points : 0,
      quizChoiceId: null,
      selectedChoiceIds: selectedChoiceIds.length > 0 ? selectedChoiceIds : null,
      answerText,
    };
  }

  if (question.type === "MULTIPLE_CHOICE") {
    const sortedSelectedChoiceIds = [...selectedChoiceIds].sort();
    const isCorrect =
      sortedSelectedChoiceIds.length === correctChoiceIds.length &&
      sortedSelectedChoiceIds.every((choiceId, index) => choiceId === correctChoiceIds[index]);

    return {
      questionId: question.id,
      isCorrect,
      pointsAwarded: isCorrect ? question.points : 0,
      quizChoiceId: sortedSelectedChoiceIds[0] ?? null,
      selectedChoiceIds: sortedSelectedChoiceIds.length > 0 ? sortedSelectedChoiceIds : null,
      answerText,
    };
  }

  const selectedChoiceId = selectedChoiceIds[0] ?? null;
  const isCorrect = correctChoiceIds.includes(selectedChoiceId ?? "");

  return {
    questionId: question.id,
    isCorrect,
    pointsAwarded: isCorrect ? question.points : 0,
    quizChoiceId: selectedChoiceId,
    selectedChoiceIds: selectedChoiceId ? [selectedChoiceId] : null,
    answerText,
  };
}

function mapAttemptResult(
  latestAttempt: {
    id: string;
    score: number | null;
    submittedAt: Date | null;
    answers: Array<{
      questionId: string;
      isCorrect: boolean | null;
      pointsAwarded: number | null;
      quizChoiceId: string | null;
      selectedChoiceIds: Prisma.JsonValue | null;
      answerText: string | null;
    }>;
  } | null,
  passingScore: number,
) {
  if (!latestAttempt) {
    return null;
  }

  return {
    id: latestAttempt.id,
    score: latestAttempt.score ?? 0,
    passed: (latestAttempt.score ?? 0) >= passingScore,
    submittedAt: latestAttempt.submittedAt?.toISOString() ?? null,
    answers: latestAttempt.answers.map((answer) => ({
      questionId: answer.questionId,
      isCorrect: Boolean(answer.isCorrect),
      pointsAwarded: answer.pointsAwarded ?? 0,
      selectedChoiceIds: Array.isArray(answer.selectedChoiceIds)
        ? answer.selectedChoiceIds.filter((item): item is string => typeof item === "string")
        : answer.quizChoiceId
          ? [answer.quizChoiceId]
          : [],
      answerText: answer.answerText,
    })),
  };
}

function getNextCourseAction(course: {
  slug: string;
  lessons: Array<{ id: string; slug: string; title: string }>;
  quizzes: Array<{ id: string; slug: string; title: string }>;
}, completedLessonIds: Set<string>, completedQuizIds: Set<string>) {
  const nextLesson = course.lessons.find((lesson) => !completedLessonIds.has(lesson.id)) ?? null;

  if (nextLesson) {
    return {
      type: "lesson" as const,
      title: nextLesson.title,
      href: `/courses/${course.slug}/lessons/${nextLesson.slug}`,
    };
  }

  const nextQuiz = course.quizzes.find((quiz) => !completedQuizIds.has(quiz.id)) ?? null;

  if (nextQuiz) {
    return {
      type: "quiz" as const,
      title: nextQuiz.title,
      href: `/courses/${course.slug}/quizzes/${nextQuiz.slug}`,
    };
  }

  return null;
}

export async function getStudentLessonState(userId: string, lessonId: string) {
  const progress = await findLessonProgress(userId, lessonId);

  return {
    isCompleted: progress?.status === "COMPLETED",
    completedAt: progress?.completedAt?.toISOString() ?? null,
  };
}

export async function getStudentCourseProgressSnapshot(userId: string, courseId: string) {
  return getCourseProgressSummary(prisma, userId, courseId);
}

export async function markLessonCompleted(userId: string, lessonId: string) {
  const lesson = await findPublishedLessonProgressContext(lessonId);

  if (!lesson) {
    throw new Error("Lesson không tồn tại hoặc chưa publish.");
  }

  return prisma.$transaction(async (tx) => {
    const touchedAt = new Date();

    await tx.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lesson.id,
        },
      },
      update: {
        status: "COMPLETED",
        lastViewedAt: touchedAt,
        completedAt: touchedAt,
      },
      create: {
        userId,
        lessonId: lesson.id,
        status: "COMPLETED",
        lastViewedAt: touchedAt,
        completedAt: touchedAt,
      },
    });

    const summary = await getCourseProgressSummary(tx, userId, lesson.courseId);
    await syncEnrollmentStatus(tx, userId, lesson.courseId, summary, touchedAt);

    return {
      lessonId: lesson.id,
      completedAt: touchedAt.toISOString(),
      ...summary,
    };
  });
}

export async function getStudentQuizState(userId: string, quizId: string) {
  const quiz = await findPublishedQuizAttemptContext(quizId);

  if (!quiz) {
    notFound();
  }

  const [attemptCount, latestAttempt] = await Promise.all([
    countSubmittedQuizAttempts(userId, quizId),
    findLatestGradedQuizAttempt(userId, quizId),
  ]);

  const remainingAttempts =
    quiz.maxAttempts === null ? null : Math.max(quiz.maxAttempts - attemptCount, 0);

  return {
    attemptCount,
    remainingAttempts,
    canAttempt: remainingAttempts === null || remainingAttempts > 0,
    latestAttempt: mapAttemptResult(latestAttempt, quiz.passingScore),
  };
}

export async function submitQuizAttempt(userId: string, quizId: string, input: QuizSubmissionInput) {
  const quiz = await findPublishedQuizAttemptContext(quizId);

  if (!quiz) {
    throw new Error("Quiz không tồn tại hoặc chưa publish.");
  }

  const attemptCount = await countSubmittedQuizAttempts(userId, quizId);

  if (quiz.maxAttempts !== null && attemptCount >= quiz.maxAttempts) {
    throw new Error("Bạn đã dùng hết số lần làm quiz cho phép.");
  }

  const answersByQuestionId = new Map(
    input.answers.map((answer) => [
      answer.questionId,
      {
        questionId: answer.questionId,
        selectedChoiceIds: answer.selectedChoiceIds,
        answerText: answer.answerText,
      },
    ]),
  );

  const gradedAnswers = quiz.questions.map((question) =>
    scoreQuestion(question, answersByQuestionId.get(question.id)),
  );

  const totalPoints = quiz.questions.reduce((sum, question) => sum + question.points, 0);
  const earnedPoints = gradedAnswers.reduce((sum, answer) => sum + answer.pointsAwarded, 0);
  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const touchedAt = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const attempt = await tx.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId,
        status: "GRADED",
        score,
        startedAt: touchedAt,
        submittedAt: touchedAt,
        gradedAt: touchedAt,
      },
      select: {
        id: true,
      },
    });

    await tx.quizAnswer.createMany({
      data: gradedAnswers.map((answer) => ({
        attemptId: attempt.id,
        questionId: answer.questionId,
        quizChoiceId: answer.quizChoiceId,
        selectedChoiceIds: answer.selectedChoiceIds ?? Prisma.JsonNull,
        answerText: answer.answerText,
        isCorrect: answer.isCorrect,
        pointsAwarded: answer.pointsAwarded,
      })),
    });

    const summary = await getCourseProgressSummary(tx, userId, quiz.courseId);
    await syncEnrollmentStatus(tx, userId, quiz.courseId, summary, touchedAt);

    return {
      attemptId: attempt.id,
      summary,
    };
  });

  return {
    id: result.attemptId,
    score,
    passed: score >= quiz.passingScore,
    submittedAt: touchedAt.toISOString(),
    answers: gradedAnswers.map((answer) => ({
      questionId: answer.questionId,
      isCorrect: answer.isCorrect,
      pointsAwarded: answer.pointsAwarded,
      selectedChoiceIds: answer.selectedChoiceIds ?? [],
      answerText: answer.answerText,
    })),
    attemptCount: attemptCount + 1,
    remainingAttempts:
      quiz.maxAttempts === null ? null : Math.max(quiz.maxAttempts - (attemptCount + 1), 0),
    canAttempt: quiz.maxAttempts === null ? true : attemptCount + 1 < quiz.maxAttempts,
    progress: result.summary,
  };
}

export async function listStudentCourseStates(userId: string) {
  const enrollments = await listStudentEnrollments(userId);

  if (enrollments.length === 0) {
    return [];
  }

  const courseIds = enrollments.map((enrollment) => enrollment.courseId);
  const [completedLessonProgress, completedQuizAttempts] = await Promise.all([
    findCompletedLessonProgressByCourseIds(userId, courseIds),
    findCompletedQuizAttemptsByCourseIds(userId, courseIds),
  ]);

  const completedLessonIdsByCourse = new Map<string, Set<string>>();
  const completedQuizIdsByCourse = new Map<string, Set<string>>();

  for (const progress of completedLessonProgress) {
    const set = completedLessonIdsByCourse.get(progress.lesson.courseId) ?? new Set<string>();
    set.add(progress.lessonId);
    completedLessonIdsByCourse.set(progress.lesson.courseId, set);
  }

  for (const attempt of completedQuizAttempts) {
    const set = completedQuizIdsByCourse.get(attempt.quiz.courseId) ?? new Set<string>();
    set.add(attempt.quizId);
    completedQuizIdsByCourse.set(attempt.quiz.courseId, set);
  }

  return enrollments.map((enrollment) => {
    const completedLessonIds = completedLessonIdsByCourse.get(enrollment.courseId) ?? new Set();
    const completedQuizIds = completedQuizIdsByCourse.get(enrollment.courseId) ?? new Set();
    const completedLessonCount = completedLessonIds.size;
    const completedQuizCount = completedQuizIds.size;
    const totalLessons = enrollment.course.lessons.length;
    const totalQuizzes = enrollment.course.quizzes.length;
    const progressPercent = calculateProgressPercent(
      completedLessonCount,
      totalLessons,
      completedQuizCount,
      totalQuizzes,
    );
    const nextAction = getNextCourseAction(
      enrollment.course,
      completedLessonIds,
      completedQuizIds,
    );

    return {
      enrollmentId: enrollment.id,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt.toISOString(),
      lastAccessedAt: enrollment.lastAccessedAt.toISOString(),
      completedAt: enrollment.completedAt?.toISOString() ?? null,
      progressPercent,
      totalLessons,
      completedLessonCount,
      totalQuizzes,
      completedQuizCount,
      nextAction,
      course: {
        id: enrollment.course.id,
        slug: enrollment.course.slug,
        title: enrollment.course.title,
        summary: enrollment.course.summary,
        description: enrollment.course.description,
        platform: enrollment.course.platform,
        level: enrollment.course.level,
        estimatedHours: enrollment.course.estimatedHours,
        learningPathTitles: enrollment.course.learningPaths.map((item) => item.learningPath.title),
        lessons: enrollment.course.lessons,
        quizzes: enrollment.course.quizzes,
        modules: enrollment.course.modules,
      },
    };
  });
}

export async function getStudentDashboardOverview(userId: string) {
  const [courses, latestProgress] = await Promise.all([
    listStudentCourseStates(userId),
    findLatestLessonProgress(userId),
  ]);

  const completedLessonCount = courses.reduce(
    (sum, course) => sum + course.completedLessonCount,
    0,
  );
  const completedQuizCount = courses.reduce((sum, course) => sum + course.completedQuizCount, 0);
  const continueLearningCourse =
    courses.find((course) => course.nextAction !== null) ?? courses[0] ?? null;

  const latestProgressLesson =
    latestProgress && latestProgress.lesson.course.lessons.length > 0
      ? latestProgress.lesson.course.lessons.find((lesson) => lesson.id === latestProgress.lessonId)
      : null;

  return {
    activeCourseCount: courses.length,
    completedLessonCount,
    completedQuizCount,
    continueLearning: continueLearningCourse
      ? {
          courseTitle: continueLearningCourse.course.title,
          progressPercent: continueLearningCourse.progressPercent,
          nextAction: continueLearningCourse.nextAction,
        }
      : null,
    latestActivity: latestProgress
      ? {
          lessonTitle: latestProgress.lesson.title,
          courseTitle: latestProgress.lesson.course.title,
          completedAt: latestProgress.completedAt?.toISOString() ?? null,
          lastViewedAt: latestProgress.lastViewedAt.toISOString(),
          lessonHref: `/courses/${latestProgress.lesson.course.slug}/lessons/${latestProgress.lesson.slug}`,
          currentLessonSortOrder: latestProgressLesson?.sortOrder ?? latestProgress.lesson.sortOrder,
        }
      : null,
    courses,
  };
}
