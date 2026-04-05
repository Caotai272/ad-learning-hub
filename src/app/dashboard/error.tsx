"use client";

import { useEffect } from "react";

import { AppErrorState } from "@/components/feedback/app-error-state";

type DashboardErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function DashboardErrorPage({ error, reset }: DashboardErrorPageProps) {
  useEffect(() => {
    console.error("Dashboard error", error);
  }, [error]);

  return (
    <AppErrorState
      title="Dashboard đang gặp lỗi"
      description="Dữ liệu học tập hoặc practice của bạn chưa thể tải ở thời điểm này. Thử lại để lấy dữ liệu mới nhất từ hệ thống."
      onReset={reset}
      homeHref="/dashboard/overview"
      homeLabel="Về dashboard"
    />
  );
}
