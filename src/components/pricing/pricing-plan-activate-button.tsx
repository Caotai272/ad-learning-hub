"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type PricingPlanActivateButtonProps = {
  planCode: "STARTER" | "GROWTH" | "LIBRARY";
  label: string;
};

export function PricingPlanActivateButton({
  planCode,
  label,
}: PricingPlanActivateButtonProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleActivate = () => {
    setServerError(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/student/pricing/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planCode,
        }),
      });

      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(payload.error?.message ?? "Không thể kích hoạt gói lúc này.");
        return;
      }

      router.push("/dashboard/my-courses");
      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleActivate}
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Đang kích hoạt..." : label}
      </button>
      {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}
    </div>
  );
}
