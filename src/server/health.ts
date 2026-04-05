import { prisma } from "@/server/db";
import { getServerEnvSafe } from "@/lib/env";
import { practiceScenarios } from "@/modules/practice/practice.data";

type LaunchCheck = {
  key: string;
  label: string;
  passed: boolean;
  detail: string;
};

function buildLaunchChecks(input: {
  envReady: boolean;
  databaseReady: boolean;
  adminCount: number;
  learningPathCount: number;
  courseCount: number;
  lessonCount: number;
  quizCount: number;
  scenarioCount: number;
}) {
  const checks: LaunchCheck[] = [
    {
      key: "env",
      label: "Biến môi trường cốt lõi",
      passed: input.envReady,
      detail: input.envReady
        ? "APP_URL, DATABASE_URL, AUTH_SECRET và bộ biến admin đã sẵn sàng."
        : "Thiếu hoặc sai định dạng một số biến môi trường bắt buộc.",
    },
    {
      key: "database",
      label: "Kết nối database",
      passed: input.databaseReady,
      detail: input.databaseReady
        ? "Database phản hồi bình thường."
        : "Không thể kiểm tra database lúc này.",
    },
    {
      key: "admin",
      label: "Tài khoản admin",
      passed: input.adminCount > 0,
      detail:
        input.adminCount > 0
          ? `Đã có ${input.adminCount} tài khoản admin.`
          : "Chưa có tài khoản admin nào trong hệ thống.",
    },
    {
      key: "catalog",
      label: "Dữ liệu launch learning",
      passed:
        input.learningPathCount >= 3 &&
        input.courseCount >= 3 &&
        input.lessonCount >= 3 &&
        input.quizCount >= 1,
      detail: `Learning paths: ${input.learningPathCount}, courses: ${input.courseCount}, lessons: ${input.lessonCount}, quizzes: ${input.quizCount}.`,
    },
    {
      key: "practice",
      label: "Dữ liệu practice launch",
      passed: input.scenarioCount >= 2,
      detail: `Đã có ${input.scenarioCount} scenario practice sẵn sàng.`,
    },
  ];

  return checks;
}

export async function getSystemHealthSnapshot() {
  const envResult = getServerEnvSafe();

  try {
    await prisma.$queryRaw`SELECT 1`;

    const [
      adminCount,
      learningPathCount,
      courseCount,
      lessonCount,
      quizCount,
      practiceAttemptCount,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: "ADMIN",
        },
      }),
      prisma.learningPath.count({
        where: {
          status: "PUBLISHED",
        },
      }),
      prisma.course.count({
        where: {
          status: "PUBLISHED",
        },
      }),
      prisma.lesson.count({
        where: {
          status: "PUBLISHED",
        },
      }),
      prisma.quiz.count({
        where: {
          status: "PUBLISHED",
        },
      }),
      prisma.practiceAttempt.count(),
    ]);

    const checks = buildLaunchChecks({
      envReady: envResult.success,
      databaseReady: true,
      adminCount,
      learningPathCount,
      courseCount,
      lessonCount,
      quizCount,
      scenarioCount: practiceScenarios.length,
    });
    const failedChecks = checks.filter((check) => !check.passed);

    return {
      status: failedChecks.length === 0 ? "ok" : "degraded",
      phase: 8,
      service: "ad-learning-hub",
      env: {
        ready: envResult.success,
        issues: envResult.success ? [] : envResult.error.issues.map((issue) => issue.message),
      },
      database: {
        connected: true,
      },
      launch: {
        ready: failedChecks.length === 0,
        checks,
        failedCheckCount: failedChecks.length,
      },
      inventory: {
        adminCount,
        learningPathCount,
        courseCount,
        lessonCount,
        quizCount,
        practiceScenarioCount: practiceScenarios.length,
        practiceAttemptCount,
      },
    };
  } catch (error) {
    return {
      status: "down",
      phase: 8,
      service: "ad-learning-hub",
      env: {
        ready: envResult.success,
        issues: envResult.success ? [] : envResult.error.issues.map((issue) => issue.message),
      },
      database: {
        connected: false,
      },
      launch: {
        ready: false,
        checks: buildLaunchChecks({
          envReady: envResult.success,
          databaseReady: false,
          adminCount: 0,
          learningPathCount: 0,
          courseCount: 0,
          lessonCount: 0,
          quizCount: 0,
          scenarioCount: practiceScenarios.length,
        }),
        failedCheckCount: 1,
      },
      inventory: {
        adminCount: 0,
        learningPathCount: 0,
        courseCount: 0,
        lessonCount: 0,
        quizCount: 0,
        practiceScenarioCount: practiceScenarios.length,
        practiceAttemptCount: 0,
      },
      error: error instanceof Error ? error.message : "Không thể kết nối database.",
    };
  }
}
