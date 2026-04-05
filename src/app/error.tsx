"use client";

import { useEffect } from "react";

import { AppErrorState } from "@/components/feedback/app-error-state";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("App route error", error);
  }, [error]);

  return (
    <AppErrorState
      title="Đã xảy ra lỗi ngoài dự kiến"
      description="Hệ thống vừa gặp sự cố khi tải trang này. Bạn có thể thử lại ngay hoặc quay về các khu vực chính để tiếp tục sử dụng."
      onReset={reset}
    />
  );
}
