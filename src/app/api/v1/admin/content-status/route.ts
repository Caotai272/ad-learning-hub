import { ContentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import {
  type AdminEntityType,
  updateAdminContentStatus,
} from "@/modules/admin/admin.service";
import { isAdmin } from "@/server/permissions";

const updateContentStatusSchema = z.object({
  entityType: z.enum(["LEARNING_PATH", "COURSE", "MODULE", "LESSON", "QUIZ"]),
  entityId: z.string().min(1),
  status: z.nativeEnum(ContentStatus),
});

function revalidateAdminSurfaces(entityType: AdminEntityType, result: unknown) {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/content");
  revalidatePath("/admin/learning");
  revalidatePath("/courses");
  revalidatePath("/learning-paths");

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

export async function POST(request: Request) {
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

  const body = await request.json();
  const parsed = updateContentStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: "Dữ liệu cập nhật trạng thái không hợp lệ.",
        },
      },
      {
        status: 400,
      },
    );
  }

  try {
    const result = await updateAdminContentStatus(parsed.data);

    revalidateAdminSurfaces(parsed.data.entityType, result);

    return NextResponse.json({
      data: {
        id: result.id,
        title: result.title,
        status: result.status,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          message: "Không thể cập nhật trạng thái nội dung lúc này.",
        },
      },
      {
        status: 500,
      },
    );
  }
}
