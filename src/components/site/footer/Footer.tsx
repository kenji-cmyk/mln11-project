"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const finalFrame = "/footer/footer_final.jpg";

export function Footer() {
  const artRef = useRef<HTMLDivElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const started = useRef(false);
  const finished = useRef(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const art = artRef.current;
    if (!art) return;
    let active = true;

    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || preference.matches || started.current) return;
      started.current = true;
      observer.disconnect();
      try { await stillRef.current?.decode(); } catch { /* The still remains as the fallback. */ }
      if (active && !preference.matches) setPlayVideo(true);
    }, { threshold: 0.25 });

    const onPreferenceChange = () => {
      if (preference.matches) {
        finished.current = true;
        videoRef.current?.pause();
        setVisible(false);
        setPlayVideo(false);
      }
    };

    observer.observe(art);
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      active = false;
      observer.disconnect();
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <footer className="story-footer" aria-labelledby="footer-heading">
      <div ref={artRef} className="story-footer-art" aria-hidden="true">
        <Image ref={stillRef} src={finalFrame} alt="" width={736} height={1308} unoptimized className="story-footer-media" />
        {playVideo && <video
          ref={videoRef}
          className={`story-footer-media story-footer-video ${visible ? "is-playing" : ""}`}
          muted playsInline controls={false} preload="auto"
          poster={finalFrame} tabIndex={-1} disablePictureInPicture
          onPlaying={() => setVisible(true)}
          onEnded={() => { finished.current = true; setVisible(false); }}
          onError={() => { finished.current = true; setVisible(false); }}
          onCanPlay={() => { if (!finished.current) void videoRef.current?.play().catch(() => setVisible(false)); }}
        ><source src="/footer/footer_motion.mp4" type="video/mp4" /></video>}
      </div>

      <div className="story-footer-content">
        <p className="eyebrow">MLN111 <span aria-hidden="true">/</span> Ôn tập</p>
        <h2 id="footer-heading">Những khái niệm<br /><em>đáng được<br />nhớ lại.</em></h2>
        <Link className="story-footer-quiz" href="/on-tap" prefetch={false}>Ôn lại 5 câu hỏi <span aria-hidden="true">↗</span></Link>
      </div>

      <div className="story-footer-bottom">
        <span>MLN111 <span aria-hidden="true">—</span> Nhóm thuyết trình 7</span>
        <p>Nguồn: Giáo trình Triết học Mác - Lênin (2019), tr. 212–223.</p>
        <a href="#dau-trang">Về đầu trang <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
