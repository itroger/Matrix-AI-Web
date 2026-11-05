import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "streamdown/styles.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Matrix AI Chat",
  description: "基于 Agent 网关的流式 AI 对话前端",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
