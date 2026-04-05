import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { quizSubmissionSchema } from "@/modules/student-learning/student-learning.schema";
import { submitQuizAttempt } from "@/modules/student-learning/student-learning.service";

type RouteContext = {
  params: Promise<{
    quizId: string;
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
          message: "Bạn cần đăng nhập để nộp quiz.",
        },
      },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const payload = quizSubmissionSchema.safeParse(body);

    if (!payload.success) {
      return NextResponse.json(
        {
          data: null,
          meta: {},
          error: {
            code: "VALIDATION_ERROR",
            message: payload.error.issues[0]?.message ?? "Dữ liệu nộp quiz không hợp lệ.",
          },
        },
        { status: 400 },
      );
    }

    const { quizId } = await params;
    const result = await submitQuizAttempt(session.user.id, quizId, payload.data);

    return NextResponse.json({
      data: result,
      meta: {},
      error: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể nộp quiz lúc này.";

    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "QUIZ_SUBMIT_FAILED",
          message,
        },
      },
      { status: 400 },
    );
  }
}
