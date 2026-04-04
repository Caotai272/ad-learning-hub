import { NextResponse } from "next/server";

import { registerSchema } from "@/modules/auth/auth.schema";
import { registerUser } from "@/modules/auth/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = registerSchema.safeParse(body);

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

    const user = await registerUser(payload.data);

    return NextResponse.json(
      {
        data: user,
        meta: {},
        error: null,
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể tạo tài khoản lúc này.";

    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "REGISTER_FAILED",
          message,
        },
      },
      { status: 400 },
    );
  }
}
