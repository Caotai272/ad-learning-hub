"use client";

import { useEffect } from "react";

import { AppErrorState } from "@/components/feedback/app-error-state";

type AdminErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function AdminErrorPage({ error, reset }: AdminErrorPageProps) {
  useEffect(() => {
    console.error("Admin error", error);
  }, [error]);

  return (
    <AppErrorState
      title="Khu admin đang gặp lỗi"
      description="Hệ thống chưa thể tải inventory hoặc dữ liệu vận hành lúc này. Thử lại trước khi tiếp tục publish hoặc chỉnh sửa nội dung."
      onReset={reset}
      homeHref="/admin/dashboard"
      homeLabel="Về admin dashboard"
    />
  );
}
