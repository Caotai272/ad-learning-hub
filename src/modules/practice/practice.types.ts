import type { DifficultyLevel, Platform } from "@prisma/client";

export type PracticeScenarioOption = {
  id: string;
  label: string;
  explanation: string;
  isCorrect: boolean;
};

export type PracticeScenarioQuestion = {
  id: string;
  prompt: string;
  description?: string;
  options: PracticeScenarioOption[];
};

export type PracticeScenarioMetric = {
  label: string;
  value: string;
  note: string;
};

export type PracticeScenario = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  platform: Platform;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  passingScore: number;
  tags: string[];
  recommendedFor: string;
  objective: string;
  context: string;
  constraints: string[];
  metrics: PracticeScenarioMetric[];
  questions: PracticeScenarioQuestion[];
  reviewChecklist: string[];
};

export type PracticeScenarioAttemptAnswer = {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
};

export type PracticeScenarioAttempt = {
  id: string;
  scenarioSlug: string;
  scenarioTitle: string;
  score: number;
  passed: boolean;
  submittedAt: string;
  answers: PracticeScenarioAttemptAnswer[];
};

export type PracticeScenarioPerformance = {
  scenarioSlug: string;
  scenarioTitle: string;
  platform: Platform;
  difficulty: DifficultyLevel;
  attemptCount: number;
  passedCount: number;
  passRate: number;
  averageScore: number;
  bestScore: number;
  lastSubmittedAt: string | null;
};

export type StudentPracticeOverview = {
  totalAttempts: number;
  passedCount: number;
  passRate: number;
  averageScore: number;
  bestScore: number;
  activeScenarioCount: number;
  attempts: PracticeScenarioAttempt[];
  scenarios: PracticeScenarioPerformance[];
};

export type AdminPracticeOverview = {
  totalScenarios: number;
  totalAttempts: number;
  activeStudentCount: number;
  passRate: number;
  averageScore: number;
  scenarios: Array<
    PracticeScenarioPerformance & {
      questionCount: number;
      tags: string[];
      recommendedFor: string;
    }
  >;
  recentAttempts: Array<
    PracticeScenarioAttempt & {
      user: {
        id: string;
        name: string;
        email: string;
      };
    }
  >;
};
