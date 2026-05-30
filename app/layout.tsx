import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://onul.vercel.app"),
  title: "오늘의 한 판 — 데일리 추리 게임",
  description: "매일 새로운 추리 퍼즐. 힌트를 모아 정답을 맞혀보세요!",
  openGraph: {
    title: "오늘의 한 판 — 하루 한 판, 한국어 추리 게임",
    description:
      "5단계 힌트로 추리하고 결과를 친구와 공유하세요. 오늘의 퍼즐에 도전!",
    url: "https://onul.vercel.app",
    siteName: "오늘의 한 판",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "오늘의 한 판 — 하루 한 판, 한국어 추리 게임",
    description:
      "5단계 힌트로 추리하고 결과를 친구와 공유하세요. 오늘의 퍼즐에 도전!",
  },
  // AdSense 사이트 소유권 확인용 메타 태그 (게시자 ID 설정 시에만 렌더)
  ...(process.env.NEXT_PUBLIC_ADSENSE_CLIENT
    ? {
        other: {
          "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
        },
      }
    : {}),
};

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {children}
        {adsenseClient && (
          <Script
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          />
        )}
      </body>
    </html>
  );
}
