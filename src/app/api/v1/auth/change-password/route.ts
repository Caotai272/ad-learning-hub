import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { changePasswordSchema } from "@/modules/auth/auth.schema";
import { changePassword } from "@/modules/auth/auth.service";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "UNAUTHORIZED",
          message: "Bạn cần đăng nhập để đổi mật khẩu.",
        },
      },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const payload = changePasswordSchema.safeParse(body);

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

    const result = await changePassword(session.user.id, payload.data);

    return NextResponse.json({
      data: result,
      meta: {},
      error: null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể đổi mật khẩu lúc này.";

    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "CHANGE_PASSWORD_FAILED",
          message,
        },
      },
      { status: 400 },
    );
  }
}
