import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { adminLearningEntitySchema } from "@/modules/admin/admin.schema";
import { saveAdminLearningEntity } from "@/modules/admin/admin.service";
import { isAdmin } from "@/server/permissions";

function revalidateLearningSurfaces() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/content");
  revalidatePath("/admin/learning");
  revalidatePath("/admin/users");
  revalidatePath("/courses");
  revalidatePath("/learning-paths");
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

    revalidateLearningSurfaces();

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
