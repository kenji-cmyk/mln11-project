"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const finalFrame = "/hero/hero_final_v2.webp";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);
  const played = useRef(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [visible, setVisible] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = true;
    const prepare = async () => {
      if (preference.matches || played.current) return;
      // The final image is decoded before the video is even mounted.
      try { await stillRef.current?.decode(); } catch { return; }
      if (active && !preference.matches && !played.current) {
        played.current = true;
        setPlayVideo(true);
      }
    };
    const onPreferenceChange = () => {
      if (preference.matches) {
        videoRef.current?.pause();
        setVisible(false);
        setFinished(true);
      }
    };
    void prepare();
    preference.addEventListener("change", onPreferenceChange);
    return () => { active = false; preference.removeEventListener("change", onPreferenceChange); };
  }, []);

  return (
    <section id="dau-trang" className="hero" aria-labelledby="hero-heading">
      <div className="hero-art" aria-hidden="true">
        <Image ref={stillRef} src={finalFrame} alt="" width={1080} height={1920} preload unoptimized className="hero-media hero-still" />
        {playVideo && <video
          ref={videoRef}
          className={`hero-media hero-video ${visible && !finished ? "is-playing" : ""}`}
          autoPlay muted playsInline loop={false} controls={false} preload="auto"
          poster={finalFrame} tabIndex={-1} disablePictureInPicture
          onPlaying={() => setVisible(true)}
          onEnded={() => { setFinished(true); setVisible(false); }}
          onError={() => { setFinished(true); setVisible(false); }}
          onCanPlay={() => { if (!finished) void videoRef.current?.play().catch(() => setVisible(false)); }}
        ><source src="/hero/hero_motion_layered_v2.mp4" type="video/mp4" /></video>}
      </div>
      <div className="hero-content">
        <p className="eyebrow hero-eyebrow">Chương III <span aria-hidden="true">/</span> Chủ nghĩa duy vật lịch sử</p>
        <h1 id="hero-heading">Nhà nước<span className="title-period">.</span></h1>
        <p className="hero-subtitle">Nguồn gốc. Bản chất.<br />Sự vận động trong lịch sử.</p>
        <div className="hero-source"><span className="short-rule" aria-hidden="true" /><span>Theo Giáo trình Triết học Mác - Lênin<br />2019 · Trang 212–223</span></div>
      </div>
      <div className="hero-bottom">
        <span className="hero-edition">MLN111 <span>—</span> Nhà nước và cách mạng xã hội</span>
        <a className="scroll-link" href="#noi-dung"><span>Cuộn để đọc tiếp</span><span className="down-arrow" aria-hidden="true">↓</span></a>
        <span className="folio">Nguồn gốc · Quyền lực · Lịch sử</span>
      </div>
    </section>
  );
}
