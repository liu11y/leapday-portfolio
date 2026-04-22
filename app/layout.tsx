import type { Metadata } from "next";
import "./globals.css";

// 这里的元数据决定了你分享链接到微信/推特时的显示内容
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
          // 极致苹果味：SF Pro 配合苹方，开启子像素平滑优化
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
        className="antialiased bg-[#0a0a0a]"
      >
        {children}
      </body>
    </html>
  );
}
