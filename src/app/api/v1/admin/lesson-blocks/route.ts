import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { adminSortDirectionSchema, adminLessonBlockFormSchema } from "@/modules/admin/admin.schema";
import {
  deleteAdminLessonBlock,
  reorderAdminLessonBlock,
  saveAdminLessonBlock,
} from "@/modules/admin/admin.service";
import { isAdmin } from "@/server/permissions";

const deleteLessonBlockSchema = z.object({
  blockId: z.string().min(1),
});

const reorderLessonBlockSchema = z.object({
  blockId: z.string().min(1),
  direction: adminSortDirectionSchema,
});

function revalidateLessonBlockSurfaces(result: {
  courseSlug: string;
  lessonSlug: string;
}) {
  revalidatePath("/admin/learning");
  revalidatePath("/admin/content");
  revalidatePath("/courses");
  revalidatePath(`/courses/${result.courseSlug}`);
  revalidatePath(`/courses/${result.courseSlug}/lessons/${result.lessonSlug}`);
}

async function requireAdminSession() {
  const session = await auth();

  if (!session?.user || !isAdmin(session.user.role)) {
    return NextResponse.json(
      {
        error: {
          message: "Bạn không có quyền thực hiện thao tác này.",
        },
      },
      {
        status: 403,
      },
    );
  }

  return null;
}

export async function POST(request: Request) {
  const unauthorizedResponse = await requireAdminSession();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const body = await request.json();
  const parsed = adminLessonBlockFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: parsed.error.issues[0]?.message ?? "Dữ liệu lesson block không hợp lệ.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await saveAdminLessonBlock(parsed.data);
    revalidateLessonBlockSurfaces(result);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Không thể lưu lesson block lúc này.",
        },
      },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  const unauthorizedResponse = await requireAdminSession();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const body = await request.json();
  const parsed = reorderLessonBlockSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: "Yêu cầu sắp xếp lesson block không hợp lệ.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await reorderAdminLessonBlock(parsed.data);
    revalidateLessonBlockSurfaces(result);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Không thể sắp xếp lesson block lúc này.",
        },
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const unauthorizedResponse = await requireAdminSession();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const body = await request.json();
  const parsed = deleteLessonBlockSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: "Yêu cầu xóa lesson block không hợp lệ.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await deleteAdminLessonBlock(parsed.data.blockId);
    revalidateLessonBlockSurfaces(result);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Không thể xóa lesson block lúc này.",
        },
      },
      { status: 400 },
    );
  }
}
