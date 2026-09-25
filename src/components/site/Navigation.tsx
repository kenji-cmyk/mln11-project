"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { journeyChapters } from "@/lib/content/journey-content";

export function Navigation() {
  const scrollFrame = useRef<number | null>(null);

  useEffect(() => {
    const stop = () => {
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = null;
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    return () => {
      stop();
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, []);

  const scrollToChapter = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = event.currentTarget.hash;
    const chapter = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!chapter) return;
    event.preventDefault();
    if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = null;

    const start = window.scrollY;
    const end = Math.max(0, chapter.getBoundingClientRect().top + start);
    window.history.pushState(null, "", hash);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: end, behavior: "instant" });
      return;
    }

    // Allow roughly one second per viewport so long jumps keep the model readable.
    const duration = Math.max(900, Math.abs(end - start) / Math.max(window.innerHeight, 1) * 1000);
    const started = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = t * t * (3 - 2 * t);
      window.scrollTo({ top: start + (end - start) * eased, behavior: "instant" });
      scrollFrame.current = t < 1 ? requestAnimationFrame(step) : null;
    };
    scrollFrame.current = requestAnimationFrame(step);
  };

  return (
    <header className="site-header">
      <a className="wordmark" href="#dau-trang" onClick={scrollToChapter} aria-label="MLN111 — về đầu trang">MLN<span>111</span><span className="wordmark-dot" aria-hidden="true" /></a>
      <nav aria-label="Điều hướng chính">
        {journeyChapters.map((chapter) => (
          <a key={chapter.id} href={`#${chapter.id}`} onClick={scrollToChapter}>
            {chapter.id === "hanh-trinh" ? "Lịch sử" : chapter.label}
          </a>
        ))}
        <Link href="/on-tap" prefetch={false}>Ôn tập <span aria-hidden="true">↗</span></Link>
      </nav>
      <span className="header-note">Triết học Mác – Lênin <span> / </span> Nhóm 7</span>
    </header>
  );
}
