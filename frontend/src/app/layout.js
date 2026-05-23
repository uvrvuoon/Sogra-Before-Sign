import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 💡 탭 제목을 우리 서비스 이름으로 변경했습니다!
export const metadata = {
  title: "집계약 안심금고 🔒",
  description: "AI 기반 전월세 계약 점검 서비스",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ko" // 한국어 설정으로 변경
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}