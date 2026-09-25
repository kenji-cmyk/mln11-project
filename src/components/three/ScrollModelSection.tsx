"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Hero } from "@/components/site/hero/Hero";
import { Footer } from "@/components/site/footer/Footer";
import { journeyChapters } from "@/lib/content/journey-content";
import { SceneMotion, sampleScrollProgress } from "./motion";
import { sampleComposition } from "./composition";

const CourseScene = dynamic(() => import("./CourseScene"), {
  ssr: false,
  loading: () => <div className="scene-fallback" role="status">Đang chuẩn bị mô hình 3D…</div>,
});

const READING_TIMING = {
  desktopReadingLine: 0.35,
  mobileReadingLine: 0.52,
  damping: 8,
};

// Layout coordinates exclude the transforms applied to the text during scroll.
function layoutTop(element: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = element;
  while (node) { top += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
  return top;
}

export function ScrollModelSection() {
  const section = useRef<HTMLDivElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const [motion] = useState(() => new SceneMotion());

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const copies = Array.from(root.querySelectorAll<HTMLElement>(".journey-copy"));
    let frame = 0;
    let previous = 0;
    let displayed = motion.progress;
    let target = displayed;
    let velocity = 0;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let anchors: number[] = [];
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const readingLine = innerWidth <= 760 ? READING_TIMING.mobileReadingLine : READING_TIMING.desktopReadingLine;
      // Shared anchors spread movement over whole chapters, without dead zones.
      anchors = [0];
      const minimumGap = Math.min(1, max / (copies.length + 1));
      copies.forEach((copy, i) => {
        anchors.push(Math.min(
          max - (copies.length - i) * minimumGap,
          Math.max(anchors[i] + minimumGap, layoutTop(copy) - innerHeight * readingLine),
        ));
      });
      anchors.push(max);
    };
    const draw = (now: number) => {
      frame = 0;
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 1 / 60;
      previous = now;
      if (media.matches) {
        displayed = target;
        velocity = 0;
        pointer.x = pointer.y = 0;
      } else {
        // Exact critically damped spring: preserve momentum across wheel events,
        // with the same response at different refresh rates.
        const offset = displayed - target;
        const spring = velocity + READING_TIMING.damping * offset;
        const decay = Math.exp(-READING_TIMING.damping * dt);
        displayed = target + (offset + spring * dt) * decay;
        velocity = (velocity - READING_TIMING.damping * spring * dt) * decay;
        if (Math.abs(target - displayed) <= 0.00001 && Math.abs(velocity) <= 0.0001) {
          displayed = target;
          velocity = 0;
        }
        const follow = 1 - Math.exp(-8 * dt);
        pointer.x += (pointer.targetX - pointer.x) * follow;
        pointer.y += (pointer.targetY - pointer.y) * follow;
        if (Math.abs(pointer.targetX - pointer.x) < 0.0001) pointer.x = pointer.targetX;
        if (Math.abs(pointer.targetY - pointer.y) < 0.0001) pointer.y = pointer.targetY;
      }
      const pose = sampleComposition(displayed, innerWidth <= 760, innerWidth / innerHeight);
      if (visual.current) {
        visual.current.style.transform = `translate3d(${pose.x}%, ${pose.y}%, 0) scale(${pose.scale})`;
        visual.current.style.opacity = String(pose.opacity);
      }
      motion.setPose(displayed, pose.opacity, pose.yaw + pointer.x * 0.12, pointer.y * 0.06, -pointer.x * 0.018);
      copies.forEach((copy, i) => {
        const distance = Math.max(-1, Math.min(1, displayed * (anchors.length - 1) - (i + 1)));
        const direction = i % 2 === 0 ? -1 : 1;
        copy.style.transform = media.matches ? "none" : `translate3d(${direction * distance * (innerWidth <= 760 ? 16 : 85)}px, ${distance * -36}px, 0) scale(${1 - Math.abs(distance) * 0.055})`;
        copy.style.opacity = media.matches ? "1" : String(1 - Math.abs(distance) * 0.45);
      });
      if (!media.matches && (displayed !== target || velocity !== 0 || pointer.x !== pointer.targetX || pointer.y !== pointer.targetY)) frame = requestAnimationFrame(draw);
      else previous = 0;
    };
    const update = () => {
      target = sampleScrollProgress(scrollY, anchors);
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const resize = () => { measure(); update(); };
    const resetPointer = () => {
      pointer.targetX = pointer.targetY = 0;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const movePointer = (event: PointerEvent) => {
      if (media.matches || !finePointer.matches || event.pointerType === "touch") return;
      pointer.targetX = Math.max(-1, Math.min(1, event.clientX / innerWidth * 2 - 1));
      pointer.targetY = Math.max(-1, Math.min(1, event.clientY / innerHeight * 2 - 1));
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const preference = () => { motion.setReduced(media.matches); resetPointer(); update(); };
    measure();
    preference();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", movePointer, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.documentElement.addEventListener("pointerleave", resetPointer);
    finePointer.addEventListener("change", resetPointer);
    media.addEventListener("change", preference);
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener("pointerleave", resetPointer);
      finePointer.removeEventListener("change", resetPointer);
      media.removeEventListener("change", preference);
    };
  }, [motion]);

  return (
    <div ref={section} className="model-journey">
      <div className="journey-visual" aria-hidden="true">
        <div ref={visual} className="journey-canvas"><CourseScene motion={motion} /></div>
      </div>
      <div className="journey-reading">
        <Hero />
        <div id="noi-dung" className="journey-chapters">
          {journeyChapters.map((chapter, index) => (
            <section id={chapter.id} className={`journey-stop ${index % 2 ? "journey-stop--right" : ""}`} key={chapter.id} aria-labelledby={`${chapter.id}-title`}>
              <div className="journey-copy">
                <h2 id={`${chapter.id}-title`}>{chapter.title}<br /><em>{chapter.emphasis}</em></h2>
                <p className="journey-description">{chapter.body}</p>
                <p className="journey-takeaway">{chapter.note}</p>
              </div>
            </section>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
}
