import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "leapday | A Photography Journal",
  description: "Capturing moments through the lens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        style={{
          // 苹果官方标准的字体调用顺序：
          // 优先调用系统原厂 SF Pro，中文调用苹方，最后用无衬线兜底
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: 'antialiased', // 开启苹果级字体平滑优化
          MozOsxFontSmoothing: 'grayscale',
        }}
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
