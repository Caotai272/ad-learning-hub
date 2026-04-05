import { notFound } from "next/navigation";

import { practiceScenarios } from "@/modules/practice/practice.data";
import type { PracticeSubmissionInput } from "@/modules/practice/practice.schema";
import type {
  AdminPracticeOverview,
  PracticeScenario,
  PracticeScenarioAttempt,
  PracticeScenarioPerformance,
  StudentPracticeOverview,
} from "@/modules/practice/practice.types";
import { prisma } from "@/server/db";

function mapPracticeAttempt(
  attempt: {
    id: string;
    scenarioSlug: string;
    scenarioTitle: string;
    score: number;
    passed: boolean;
    submittedAt: Date;
    answers: Array<{
      questionId: string;
      selectedOptionId: string | null;
      isCorrect: boolean;
    }>;
  },
): PracticeScenarioAttempt {
  return {
    id: attempt.id,
    scenarioSlug: attempt.scenarioSlug,
    scenarioTitle: attempt.scenarioTitle,
    score: attempt.score,
    passed: attempt.passed,
    submittedAt: attempt.submittedAt.toISOString(),
    answers: attempt.answers.map((answer) => ({
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOptionId,
      isCorrect: answer.isCorrect,
    })),
  };
}

function buildScenarioPerformance(
  scenario: PracticeScenario,
  attempts: PracticeScenarioAttempt[],
): PracticeScenarioPerformance {
  const passedCount = attempts.filter((attempt) => attempt.passed).length;
  const averageScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)
      : 0;

  return {
    scenarioSlug: scenario.slug,
    scenarioTitle: scenario.title,
    platform: scenario.platform,
    difficulty: scenario.difficulty,
    attemptCount: attempts.length,
    passedCount,
    passRate: attempts.length > 0 ? Math.round((passedCount / attempts.length) * 100) : 0,
    averageScore,
    bestScore: attempts.length > 0 ? Math.max(...attempts.map((attempt) => attempt.score)) : 0,
    lastSubmittedAt: attempts[0]?.submittedAt ?? null,
  };
}

function buildPracticeScoreRows(
  scenario: PracticeScenario,
  input: PracticeSubmissionInput,
) {
  const answersByQuestionId = new Map(
    input.answers.map((answer) => [answer.questionId, answer.selectedOptionId]),
  );

  const answerRows = scenario.questions.map((question) => {
    const selectedOptionId = answersByQuestionId.get(question.id) ?? null;

    if (!selectedOptionId) {
      throw new Error("Bạn cần trả lời đầy đủ tất cả câu hỏi trước khi nộp.");
    }

    const selectedOption = question.options.find((option) => option.id === selectedOptionId);

    if (!selectedOption) {
      throw new Error("Có đáp án không hợp lệ trong bài practice vừa nộp.");
    }

    return {
      questionId: question.id,
      selectedOptionId,
      isCorrect: selectedOption.isCorrect,
    };
  });

  const correctCount = answerRows.filter((answer) => answer.isCorrect).length;
  const score =
    scenario.questions.length > 0
      ? Math.round((correctCount / scenario.questions.length) * 100)
      : 0;

  return {
    answerRows,
    score,
    passed: score >= scenario.passingScore,
  };
}

export function listPracticeScenarios() {
  return practiceScenarios;
}

export function getPracticeScenarioBySlug(slug: string) {
  const scenario = practiceScenarios.find((item) => item.slug === slug);

  if (!scenario) {
    notFound();
  }

  return scenario;
}

export async function listPracticeAttemptsByUser(
  userId: string,
  options?: {
    scenarioSlug?: string;
    limit?: number;
  },
) {
  const attempts = await prisma.practiceAttempt.findMany({
    where: {
      userId,
      scenarioSlug: options?.scenarioSlug,
    },
    include: {
      answers: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
    take: options?.limit,
  });

  return attempts.map(mapPracticeAttempt);
}

export async function submitPracticeAttempt(
  userId: string,
  scenarioSlug: string,
  input: PracticeSubmissionInput,
) {
  const scenario = getPracticeScenarioBySlug(scenarioSlug);
  const scoredAttempt = buildPracticeScoreRows(scenario, input);

  const attempt = await prisma.practiceAttempt.create({
    data: {
      userId,
      scenarioSlug: scenario.slug,
      scenarioTitle: scenario.title,
      score: scoredAttempt.score,
      passed: scoredAttempt.passed,
      answers: {
        createMany: {
          data: scoredAttempt.answerRows.map((answer) => ({
            questionId: answer.questionId,
            selectedOptionId: answer.selectedOptionId,
            isCorrect: answer.isCorrect,
          })),
        },
      },
    },
    include: {
      answers: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return mapPracticeAttempt(attempt);
}

export async function getStudentPracticeOverview(userId: string): Promise<StudentPracticeOverview> {
  const attempts = await listPracticeAttemptsByUser(userId);

  const attemptsByScenario = new Map<string, PracticeScenarioAttempt[]>();

  for (const attempt of attempts) {
    const scenarioAttempts = attemptsByScenario.get(attempt.scenarioSlug) ?? [];
    scenarioAttempts.push(attempt);
    attemptsByScenario.set(attempt.scenarioSlug, scenarioAttempts);
  }

  const passedCount = attempts.filter((attempt) => attempt.passed).length;
  const scenarios = practiceScenarios.map((scenario) =>
    buildScenarioPerformance(scenario, attemptsByScenario.get(scenario.slug) ?? []),
  );

  return {
    totalAttempts: attempts.length,
    passedCount,
    passRate: attempts.length > 0 ? Math.round((passedCount / attempts.length) * 100) : 0,
    averageScore:
      attempts.length > 0
        ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)
        : 0,
    bestScore: attempts.length > 0 ? Math.max(...attempts.map((attempt) => attempt.score)) : 0,
    activeScenarioCount: scenarios.filter((scenario) => scenario.attemptCount > 0).length,
    attempts: attempts.slice(0, 8),
    scenarios: scenarios.sort((left, right) => {
      if (right.attemptCount !== left.attemptCount) {
        return right.attemptCount - left.attemptCount;
      }

      return left.scenarioTitle.localeCompare(right.scenarioTitle, "vi");
    }),
  };
}

export async function getAdminPracticeOverview(): Promise<AdminPracticeOverview> {
  const attempts = await prisma.practiceAttempt.findMany({
    include: {
      answers: {
        orderBy: {
          createdAt: "asc",
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  const mappedAttempts = attempts.map((attempt) => ({
    ...mapPracticeAttempt(attempt),
    user: {
      id: attempt.user.id,
      name: attempt.user.name ?? attempt.user.email,
      email: attempt.user.email,
    },
  }));
  const attemptsByScenario = new Map<string, PracticeScenarioAttempt[]>();

  for (const attempt of mappedAttempts) {
    const scenarioAttempts = attemptsByScenario.get(attempt.scenarioSlug) ?? [];
    scenarioAttempts.push(attempt);
    attemptsByScenario.set(attempt.scenarioSlug, scenarioAttempts);
  }

  const passedCount = mappedAttempts.filter((attempt) => attempt.passed).length;

  return {
    totalScenarios: practiceScenarios.length,
    totalAttempts: mappedAttempts.length,
    activeStudentCount: new Set(mappedAttempts.map((attempt) => attempt.user.id)).size,
    passRate:
      mappedAttempts.length > 0 ? Math.round((passedCount / mappedAttempts.length) * 100) : 0,
    averageScore:
      mappedAttempts.length > 0
        ? Math.round(
            mappedAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / mappedAttempts.length,
          )
        : 0,
    scenarios: practiceScenarios
      .map((scenario) => ({
        ...buildScenarioPerformance(scenario, attemptsByScenario.get(scenario.slug) ?? []),
        questionCount: scenario.questions.length,
        tags: scenario.tags,
        recommendedFor: scenario.recommendedFor,
      }))
      .sort((left, right) => {
        if (right.attemptCount !== left.attemptCount) {
          return right.attemptCount - left.attemptCount;
        }

        return left.scenarioTitle.localeCompare(right.scenarioTitle, "vi");
      }),
    recentAttempts: mappedAttempts.slice(0, 8),
  };
}
