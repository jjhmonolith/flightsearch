import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "항공권 검색",
  description: "최저가 왕복 항공권 검색 및 비교",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
