import { NextResponse } from "next/server";

import { forgotPasswordSchema } from "@/modules/auth/auth.schema";
import { requestPasswordReset } from "@/modules/auth/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = forgotPasswordSchema.safeParse(body);

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

    const result = await requestPasswordReset(payload.data.email);

    return NextResponse.json({
      data: {
        message:
          "Nếu email tồn tại trong hệ thống, chúng tôi đã tạo liên kết đặt lại mật khẩu.",
        resetUrl: process.env.NODE_ENV === "production" ? null : result.resetUrl,
        expiresAt: process.env.NODE_ENV === "production" ? null : result.expiresAt,
      },
      meta: {},
      error: null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể xử lý yêu cầu lúc này.";

    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "FORGOT_PASSWORD_FAILED",
          message,
        },
      },
      { status: 400 },
    );
  }
}
