import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { bookmarkToggleSchema } from "@/modules/bookmarks/bookmark.schema";
import { toggleBookmark } from "@/modules/bookmarks/bookmark.service";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "UNAUTHORIZED",
          message: "Bạn cần đăng nhập để lưu bookmark.",
        },
      },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const payload = bookmarkToggleSchema.safeParse(body);

    if (!payload.success) {
      return NextResponse.json(
        {
          data: null,
          meta: {},
          error: {
            code: "VALIDATION_ERROR",
            message: payload.error.issues[0]?.message ?? "Dữ liệu bookmark không hợp lệ.",
          },
        },
        { status: 400 },
      );
    }

    const result = await toggleBookmark(session.user.id, payload.data);

    return NextResponse.json({
      data: result,
      meta: {},
      error: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể cập nhật bookmark lúc này.";

    return NextResponse.json(
      {
        data: null,
        meta: {},
        error: {
          code: "BOOKMARK_TOGGLE_FAILED",
          message,
        },
      },
      { status: 400 },
    );
  }
}
