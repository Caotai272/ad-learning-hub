import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { pricingPlanActivationSchema } from "@/modules/student-learning/student-learning.schema";
import { activatePricingPlanForStudent } from "@/modules/student-learning/student-learning.service";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "UNAUTHORIZED",
          message: "Bạn cần đăng nhập để kích hoạt gói học.",
        },
      },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const payload = pricingPlanActivationSchema.safeParse(body);

    if (!payload.success) {
      return NextResponse.json(
        {
          data: null,
          meta: {},
          error: {
            code: "VALIDATION_ERROR",
            message: payload.error.issues[0]?.message ?? "Dữ liệu kích hoạt gói không hợp lệ.",
          },
        },
        { status: 400 },
      );
    }

    const result = await activatePricingPlanForStudent(session.user.id, payload.data.planCode);

    return NextResponse.json({
      data: result,
      meta: {},
      error: null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể kích hoạt gói học lúc này.";

    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "PLAN_ACTIVATION_FAILED",
          message,
        },
      },
      { status: 400 },
    );
  }
}
