import { NextResponse } from "next/server";

import { resetPasswordSchema } from "@/modules/auth/auth.schema";
import { resetPassword } from "@/modules/auth/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = resetPasswordSchema.safeParse(body);

    if (!payload.success) {
      return NextResponse.json(
        {
          data: null,
          meta: {},
          error: {
            code: "VALIDATION_ERROR",
            message: payload.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
          },
        },
        { status: 400 },
      );
    }

    const result = await resetPassword(payload.data);

    return NextResponse.json({
      data: result,
      meta: {},
      error: null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể đặt lại mật khẩu lúc này.";

    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "RESET_PASSWORD_FAILED",
          message,
        },
      },
      { status: 400 },
    );
  }
}
