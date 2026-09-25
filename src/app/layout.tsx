import type { Metadata } from "next";
import "@fontsource/noto-serif/latin-400.css";
import "@fontsource/noto-serif/vietnamese-400.css";
import "@fontsource/noto-serif/latin-400-italic.css";
import "@fontsource/noto-serif/vietnamese-400-italic.css";
import "@fontsource/be-vietnam-pro/latin-400.css";
import "@fontsource/be-vietnam-pro/vietnamese-400.css";
import "@fontsource/be-vietnam-pro/latin-500.css";
import "@fontsource/be-vietnam-pro/vietnamese-500.css";
import "./globals.css";
import "./story.css";

export const metadata: Metadata = {
  title: "Nhà nước — MLN111 · Nhóm 7",
  description: "Tìm hiểu nguồn gốc, bản chất, đặc trưng, chức năng và sự vận động lịch sử của nhà nước qua chuyên đề MLN111.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#noi-dung">Đến nội dung chính</a>
        {children}
      </body>
    </html>
  );
}
