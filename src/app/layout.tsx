import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "중소기업 정책자금 자가진단",
  description:
    "2026년도 중소기업 정책자금 융자계획 공고 기준으로, 우리 회사 조건에 맞는 정책자금(창업기반지원, 신시장진출, 신성장기반, 재도약지원, 긴급경영안정, 밸류체인안정화 등)을 확인하는 자가진단 도구.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-100 text-navy-900">{children}</body>
    </html>
  );
}
