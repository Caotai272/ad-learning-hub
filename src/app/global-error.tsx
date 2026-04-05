"use client";

import { useEffect } from "react";

import { AppErrorState } from "@/components/feedback/app-error-state";

type GlobalErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    console.error("Global app error", error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="min-h-screen bg-[var(--color-surface)] text-slate-900">
        <AppErrorState
          title="Hệ thống tạm thời chưa phản hồi ổn định"
          description="Có lỗi ở tầng ứng dụng tổng thể. Hãy thử tải lại phiên làm việc hoặc quay lại sau ít phút nếu sự cố vẫn tiếp diễn."
          onReset={reset}
        />
      </body>
    </html>
  );
}
