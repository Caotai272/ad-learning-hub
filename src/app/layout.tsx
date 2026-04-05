import type { Metadata } from "next";

import "./globals.css";

const metadataBase = new URL(process.env.APP_URL ?? "http://localhost:3000");

export const metadata: Metadata = {
  title: {
    default: "Ads Learning Hub",
    template: "%s | Ads Learning Hub",
  },
  description:
    "Nền tảng học ads bằng tiếng Việt, kết hợp bài học lý thuyết, quiz và simulator thực hành cho Facebook Ads, TikTok Ads và Shopee Ads.",
  metadataBase,
  keywords: [
    "học quảng cáo",
    "Facebook Ads",
    "TikTok Ads",
    "Shopee Ads",
    "quiz ads",
    "practice simulator",
    "CTR",
    "CPM",
    "ROAS",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ads Learning Hub",
    description:
      "Học ads bằng tiếng Việt với lesson, quiz và simulator thực hành theo tình huống thực tế.",
    url: metadataBase,
    siteName: "Ads Learning Hub",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ads Learning Hub",
    description:
      "Học ads bằng tiếng Việt với lesson, quiz và simulator thực hành theo tình huống thực tế.",
  },
  category: "education",
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
