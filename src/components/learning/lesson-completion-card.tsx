"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

type LessonCompletionCardProps = {
  lessonId: string;
  initialCompleted: boolean;
  initialProgressPercent: number;
  nextLessonHref: string | null;
  nextLessonTitle: string | null;
};

export function LessonCompletionCard({
  lessonId,
  initialCompleted,
  initialProgressPercent,
  nextLessonHref,
  nextLessonTitle,
}: LessonCompletionCardProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [progressPercent, setProgressPercent] = useState(initialProgressPercent);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCompleteLesson = () => {
    setServerError(null);

    startTransition(async () => {
      const response = await fetch(`/api/v1/student/lessons/${lessonId}/complete`, {
        method: "POST",
      });

      const payload = (await response.json()) as {
        data: { progressPercent: number } | null;
        error: { message: string } | null;
      };

      if (!response.ok || !payload.data) {
        setServerError(payload.error?.message ?? "Không thể lưu tiến độ lesson.");
        return;
      }

      setIsCompleted(true);
      setProgressPercent(payload.data.progressPercent);
    });
  };

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
      <h2 className="text-xl font-semibold text-slate-950">Tiến độ lesson</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {isCompleted
          ? "Lesson này đã được lưu là hoàn thành trong tiến độ học của bạn."
          : "Khi học xong lesson này, hãy lưu tiến độ để dashboard và khóa học của bạn cập nhật đúng."}
      </p>

      <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
        <p className="text-sm text-slate-500">Tiến độ khóa học hiện tại</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{progressPercent}%</p>
      </div>

      {serverError ? <p className="mt-4 text-sm text-rose-600">{serverError}</p> : null}

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          onClick={handleCompleteLesson}
          disabled={isPending || isCompleted}
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-emerald-700"
        >
          {isCompleted
            ? "Đã hoàn thành lesson"
            : isPending
              ? "Đang lưu tiến độ..."
              : "Đánh dấu hoàn thành"}
        </button>

        {nextLessonHref && nextLessonTitle ? (
          <Link
            href={nextLessonHref}
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:border-slate-400"
          >
            Học tiếp: {nextLessonTitle}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
