import Link from "next/link";

export function Navigation() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#dau-trang" aria-label="MLN111 — về đầu trang">MLN<span>111</span><span className="wordmark-dot" aria-hidden="true" /></a>
      <nav aria-label="Điều hướng chính">
        <a href="#nguon-goc">Nguồn gốc</a>
        <a href="#ban-chat">Bản chất</a>
        <a href="#hanh-trinh">Lịch sử</a>
        <Link href="/on-tap" prefetch={false}>Ôn tập <span aria-hidden="true">↗</span></Link>
      </nav>
      <span className="header-note">Triết học Mác – Lênin <span> / </span> Nhóm 7</span>
    </header>
  );
}
