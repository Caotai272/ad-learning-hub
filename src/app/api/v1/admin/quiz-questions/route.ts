import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { adminQuizQuestionFormSchema, adminSortDirectionSchema } from "@/modules/admin/admin.schema";
import {
  deleteAdminQuizQuestion,
  reorderAdminQuizQuestion,
  saveAdminQuizQuestion,
} from "@/modules/admin/admin.service";
import { isAdmin } from "@/server/permissions";

const deleteQuizQuestionSchema = z.object({
  questionId: z.string().min(1),
});

const reorderQuizQuestionSchema = z.object({
  questionId: z.string().min(1),
  direction: adminSortDirectionSchema,
});

function revalidateQuizQuestionSurfaces(result: {
  courseSlug: string;
  quizSlug: string;
}) {
  revalidatePath("/admin/learning");
  revalidatePath("/admin/content");
  revalidatePath("/courses");
  revalidatePath(`/courses/${result.courseSlug}`);
  revalidatePath(`/courses/${result.courseSlug}/quizzes/${result.quizSlug}`);
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
  const parsed = adminQuizQuestionFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: parsed.error.issues[0]?.message ?? "Dữ liệu quiz question không hợp lệ.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await saveAdminQuizQuestion(parsed.data);
    revalidateQuizQuestionSurfaces(result);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Không thể lưu quiz question lúc này.",
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
  const parsed = reorderQuizQuestionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: "Yêu cầu sắp xếp quiz question không hợp lệ.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await reorderAdminQuizQuestion(parsed.data);
    revalidateQuizQuestionSurfaces(result);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Không thể sắp xếp quiz question lúc này.",
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
  const parsed = deleteQuizQuestionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: "Yêu cầu xóa quiz question không hợp lệ.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await deleteAdminQuizQuestion(parsed.data.questionId);
    revalidateQuizQuestionSurfaces(result);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Không thể xóa quiz question lúc này.",
        },
      },
      { status: 400 },
    );
  }
}
