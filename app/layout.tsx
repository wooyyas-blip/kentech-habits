import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "켄텍 해비츠 — 하루 한 칸씩",
  description:
    "켄텍 학생을 위한 가벼운 습관 트래커. 로그인 없이, 매일 체크하고 streak를 쌓아요.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-screen">
        <Navbar />
        <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-6">{children}</main>
      </body>
    </html>
  );
}
