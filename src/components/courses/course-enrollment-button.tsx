"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type CourseEnrollmentButtonProps = {
  courseId: string;
  isEnrolled: boolean;
};

export function CourseEnrollmentButton({
  courseId,
  isEnrolled,
}: CourseEnrollmentButtonProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEnroll = () => {
    if (isEnrolled) {
      router.push("/dashboard/my-courses");
      return;
    }

    setServerError(null);

    startTransition(async () => {
      const response = await fetch(`/api/v1/student/courses/${courseId}/enroll`, {
        method: "POST",
      });

      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(payload.error?.message ?? "Không thể kích hoạt quyền học lúc này.");
        return;
      }

      router.refresh();
      router.push("/dashboard/my-courses");
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleEnroll}
        disabled={isPending}
        className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending
          ? "Đang kích hoạt..."
          : isEnrolled
            ? "Vào dashboard của tôi"
            : "Kích hoạt quyền học course"}
      </button>
      {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}
    </div>
  );
}
