import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ads Learning Hub",
    template: "%s | Ads Learning Hub",
  },
  description:
    "Nền tảng học ads bằng tiếng Việt, kết hợp bài học lý thuyết, quiz và simulator thực hành.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full bg-[var(--color-surface)] text-slate-900">
        {children}
      </body>
    </html>
  );
}
