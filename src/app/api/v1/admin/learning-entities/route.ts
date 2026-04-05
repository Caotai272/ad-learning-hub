import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  adminEntityTypeSchema,
  adminLearningEntityDeleteSchema,
  adminLearningEntityReorderSchema,
  adminLearningEntitySchema,
} from "@/modules/admin/admin.schema";
import {
  deleteAdminLearningEntity,
  getAdminLearningEntityDeleteImpact,
  reorderAdminLearningEntity,
  saveAdminLearningEntity,
  type AdminEntityType,
} from "@/modules/admin/admin.service";
import { isAdmin } from "@/server/permissions";

function revalidateLearningSurfaces(entityType?: AdminEntityType, result?: unknown) {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/content");
  revalidatePath("/admin/learning");
  revalidatePath("/admin/users");
  revalidatePath("/courses");
  revalidatePath("/learning-paths");

  if (!entityType || !result) {
    return;
  }

  if (entityType === "LEARNING_PATH") {
    const item = result as { slug: string };
    revalidatePath(`/learning-paths/${item.slug}`);
    return;
  }

  if (entityType === "COURSE") {
    const item = result as { slug: string };
    revalidatePath(`/courses/${item.slug}`);
    return;
  }

  if (entityType === "MODULE") {
    const item = result as { course: { slug: string } };
    revalidatePath(`/courses/${item.course.slug}`);
    return;
  }

  if (entityType === "LESSON") {
    const item = result as { slug: string; course: { slug: string } };
    revalidatePath(`/courses/${item.course.slug}`);
    revalidatePath(`/courses/${item.course.slug}/lessons/${item.slug}`);
    return;
  }

  const item = result as { slug: string; course: { slug: string } };
  revalidatePath(`/courses/${item.course.slug}`);
  revalidatePath(`/courses/${item.course.slug}/quizzes/${item.slug}`);
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

export async function GET(request: Request) {
  const unauthorizedResponse = await requireAdminSession();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const url = new URL(request.url);
  const parsed = adminEntityTypeSchema.safeParse(url.searchParams.get("entityType"));
  const entityId = url.searchParams.get("entityId");

  if (!parsed.success || !entityId?.trim()) {
    return NextResponse.json(
      {
        error: {
          message: "Yêu cầu tải tác động xóa không hợp lệ.",
        },
      },
      {
        status: 400,
      },
    );
  }

  try {
    const result = await getAdminLearningEntityDeleteImpact({
      entityType: parsed.data,
      entityId: entityId.trim(),
    });

    return NextResponse.json({
      data: result,
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Không thể tải tác động xóa lúc này.",
        },
      },
      {
        status: 400,
      },
    );
  }
}

export async function POST(request: Request) {
  const unauthorizedResponse = await requireAdminSession();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const body = await request.json();
  const parsed = adminLearningEntitySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: parsed.error.issues[0]?.message ?? "Dữ liệu form không hợp lệ.",
        },
      },
      {
        status: 400,
      },
    );
  }

  try {
    const result = await saveAdminLearningEntity(parsed.data);

    revalidateLearningSurfaces(parsed.data.entityType, result);

    return NextResponse.json({
      data: result,
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Không thể lưu dữ liệu learning lúc này.",
        },
      },
      {
        status: 400,
      },
    );
  }
}

export async function PATCH(request: Request) {
  const unauthorizedResponse = await requireAdminSession();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const body = await request.json();
  const parsed = adminLearningEntityReorderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: parsed.error.issues[0]?.message ?? "Yêu cầu sắp xếp không hợp lệ.",
        },
      },
      {
        status: 400,
      },
    );
  }

  try {
    const result = await reorderAdminLearningEntity(parsed.data);
    revalidateLearningSurfaces(parsed.data.entityType, result);

    return NextResponse.json({
      data: result,
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Không thể cập nhật thứ tự lúc này.",
        },
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE(request: Request) {
  const unauthorizedResponse = await requireAdminSession();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const body = await request.json();
  const parsed = adminLearningEntityDeleteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: parsed.error.issues[0]?.message ?? "Yêu cầu xóa không hợp lệ.",
        },
      },
      {
        status: 400,
      },
    );
  }

  try {
    const result = await deleteAdminLearningEntity(parsed.data);
    revalidateLearningSurfaces(parsed.data.entityType, result);

    return NextResponse.json({
      data: result,
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Không thể xóa entity lúc này.",
        },
      },
      {
        status: 400,
      },
    );
  }
}
