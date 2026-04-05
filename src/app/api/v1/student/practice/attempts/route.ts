import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { listPracticeAttemptsByUser } from "@/modules/practice/practice.service";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "UNAUTHORIZED",
          message: "Bạn cần đăng nhập để xem lịch sử practice.",
        },
      },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const scenarioSlug = searchParams.get("scenarioSlug")?.trim() || undefined;
  const rawLimit = Number(searchParams.get("limit") ?? "10");
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.trunc(rawLimit), 1), 50) : 10;

  try {
    const attempts = await listPracticeAttemptsByUser(session.user.id, {
      scenarioSlug,
      limit,
    });

    return NextResponse.json({
      data: attempts,
      meta: {
        count: attempts.length,
      },
      error: null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể tải lịch sử practice lúc này.";

    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "PRACTICE_HISTORY_FAILED",
          message,
        },
      },
      { status: 400 },
    );
  }
}
