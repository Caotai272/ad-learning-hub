import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { enrollStudentToCourse } from "@/modules/student-learning/student-learning.service";

type RouteContext = {
  params: Promise<{
    courseId: string;
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
          message: "Bạn cần đăng nhập để kích hoạt quyền học course này.",
        },
      },
      { status: 401 },
    );
  }

  try {
    const { courseId } = await params;
    const result = await enrollStudentToCourse(session.user.id, courseId);

    return NextResponse.json({
      data: result,
      meta: {},
      error: null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể kích hoạt course lúc này.";

    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "COURSE_ENROLL_FAILED",
          message,
        },
      },
      { status: 400 },
    );
  }
}
