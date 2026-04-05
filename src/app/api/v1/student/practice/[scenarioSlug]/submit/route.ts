import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { practiceSubmissionSchema } from "@/modules/practice/practice.schema";
import { submitPracticeAttempt } from "@/modules/practice/practice.service";

type RouteContext = {
  params: Promise<{
    scenarioSlug: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "UNAUTHORIZED",
          message: "Bạn cần đăng nhập để nộp practice simulator.",
        },
      },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const payload = practiceSubmissionSchema.safeParse(body);

    if (!payload.success) {
      return NextResponse.json(
        {
          data: null,
          meta: {},
          error: {
            code: "VALIDATION_ERROR",
            message:
              payload.error.issues[0]?.message ?? "Dữ liệu nộp practice không hợp lệ.",
          },
        },
        { status: 400 },
      );
    }

    const { scenarioSlug } = await params;
    const result = await submitPracticeAttempt(session.user.id, scenarioSlug, payload.data);

    return NextResponse.json({
      data: result,
      meta: {},
      error: null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể nộp practice simulator lúc này.";

    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "PRACTICE_SUBMIT_FAILED",
          message,
        },
      },
      { status: 400 },
    );
  }
}
