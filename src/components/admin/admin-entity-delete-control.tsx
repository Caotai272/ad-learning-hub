"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import type { AdminEntityType } from "@/modules/admin/admin.service";

import { AdminButton } from "@/components/admin/admin-button";
import { cn } from "@/lib/utils";

type DeleteImpactItem = {
  label: string;
  value: number;
  tone: "neutral" | "warning" | "blocked";
};

type DeleteImpact = {
  title: string;
  confirmationText: string;
  canDelete: boolean;
  blockingReason: string | null;
  impactItems: DeleteImpactItem[];
};

type AdminEntityDeleteControlProps = {
  entityType: AdminEntityType;
  entityId: string;
  entityTitle: string;
};

function getImpactItemClassName(tone: DeleteImpactItem["tone"]) {
  if (tone === "blocked") {
    return "border-rose-200 bg-rose-50 text-rose-900";
  }

  if (tone === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function AdminEntityDeleteControl({
  entityType,
  entityId,
  entityTitle,
}: AdminEntityDeleteControlProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [impact, setImpact] = useState<DeleteImpact | null>(null);
  const [impactError, setImpactError] = useState<string | null>(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoadingImpact, setIsLoadingImpact] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isOpen || impact || impactError || isLoadingImpact) {
      return;
    }

    let isCancelled = false;

    const loadImpact = async () => {
      setImpactError(null);
      setIsLoadingImpact(true);

      const searchParams = new URLSearchParams({
        entityType,
        entityId,
      });

      const response = await fetch(`/api/v1/admin/learning-entities?${searchParams.toString()}`);
      const payload = (await response.json()) as {
        data?: DeleteImpact;
        error?: { message?: string };
      };

      if (isCancelled) {
        return;
      }

      if (!response.ok || !payload.data) {
        setImpactError(payload.error?.message ?? "Không thể tải thông tin xóa.");
        setIsLoadingImpact(false);
        return;
      }

      setImpact(payload.data);
      setIsLoadingImpact(false);
    };

    void loadImpact();

    return () => {
      isCancelled = true;
    };
  }, [entityId, entityType, impact, impactError, isLoadingImpact, isOpen]);

  const handleDelete = () => {
    if (!impact) {
      return;
    }

    setServerError(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/admin/learning-entities", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityType,
          entityId,
          confirmationText,
        }),
      });

      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(payload.error?.message ?? "Không thể xóa nội dung lúc này.");
        return;
      }

      setIsOpen(false);
      setImpact(null);
      setConfirmationText("");
      router.refresh();
    });
  };

  const isConfirmationMatched = impact
    ? confirmationText.trim() === impact.confirmationText.trim()
    : false;

  return (
    <div className="space-y-3 rounded-[1.25rem] border border-rose-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">Vùng xóa an toàn</p>
          <p className="mt-1 text-xs leading-6 text-slate-500">
            Xóa chỉ nên dùng khi bạn chắc chắn không cần giữ lại cấu trúc hoặc dữ liệu học tập liên quan.
          </p>
        </div>

        <AdminButton
          size="sm"
          variant="dangerSoft"
          onClick={() => {
            setIsOpen((current) => !current);
            setServerError(null);
            setImpactError(null);
          }}
        >
          {isOpen ? "Ẩn vùng xóa" : "Mở vùng xóa"}
        </AdminButton>
      </div>

      {isOpen ? (
        <div className="space-y-4 rounded-[1.25rem] border border-rose-200 bg-rose-50/60 p-4">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Bạn đang chuẩn bị xóa: <span className="font-semibold">{entityTitle}</span>
            </p>
            <p className="mt-1 text-xs leading-6 text-slate-600">
              Hệ thống sẽ phân tích tác động trước khi cho phép xóa.
            </p>
          </div>

          {isLoadingImpact ? (
            <p className="text-sm text-slate-600">Đang tải tác động xóa...</p>
          ) : null}

          {impactError ? <p className="text-sm text-rose-600">{impactError}</p> : null}

          {impact ? (
            <div className="space-y-4">
              <div className="grid gap-2 md:grid-cols-2">
                {impact.impactItems.map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      "rounded-[1rem] border px-4 py-3 text-sm",
                      getImpactItemClassName(item.tone),
                    )}
                  >
                    <p className="font-medium">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>

              {impact.blockingReason ? (
                <div className="rounded-[1rem] border border-rose-200 bg-white px-4 py-4 text-sm leading-7 text-rose-800">
                  {impact.blockingReason}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Nhập chính xác tên để xác nhận xóa
                    </span>
                    <input
                      value={confirmationText}
                      onChange={(event) => setConfirmationText(event.target.value)}
                      placeholder={impact.confirmationText}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                    />
                  </label>
                  <p className="text-xs text-slate-500">
                    Cần nhập đúng: <span className="font-semibold text-slate-700">{impact.confirmationText}</span>
                  </p>
                </div>
              )}

              {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}

              <div className="flex flex-wrap gap-3">
                <AdminButton
                  variant="danger"
                  disabled={isPending || !impact.canDelete || !isConfirmationMatched}
                  onClick={handleDelete}
                >
                  {isPending ? "Đang xóa..." : "Xóa vĩnh viễn"}
                </AdminButton>
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setIsOpen(false);
                    setConfirmationText("");
                    setServerError(null);
                  }}
                >
                  Hủy
                </AdminButton>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
