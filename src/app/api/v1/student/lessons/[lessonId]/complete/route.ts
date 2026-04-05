import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { markLessonCompleted } from "@/modules/student-learning/student-learning.service";

type RouteContext = {
  params: Promise<{
    lessonId: string;
  }>;
};

export async function POST(_request: Request, { params }: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "UNAUTHORIZED",
          message: "Bạn cần đăng nhập để lưu tiến độ lesson.",
        },
      },
      { status: 401 },
    );
  }

  try {
    const { lessonId } = await params;
    const result = await markLessonCompleted(session.user.id, lessonId);

    return NextResponse.json({
      data: result,
      meta: {},
      error: null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể lưu tiến độ lesson lúc này.";

    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "LESSON_PROGRESS_FAILED",
          message,
        },
      },
      { status: 400 },
    );
  }
}
