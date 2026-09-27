"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./LeafBackground.module.css";

type LeafBackgroundProps = {
  position?: "left" | "right" | "wide";
  intensity?: "low" | "medium";
  phaseSeconds?: number;
  mirror?: boolean;
  portalHost?: HTMLElement | null;
};

const videoSource = "/falling_leaves_overlay.webm";

export function LeafBackground({
  position = "right",
  intensity = "low",
  phaseSeconds = 0,
  mirror = false,
  portalHost,
}: LeafBackgroundProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const video = videoRef.current;
    if (!layer || !video) return;
    const observeTarget = portalHost !== undefined ? anchorRef.current?.closest("section") : layer;
    if (!observeTarget) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let nearViewport = false;
    let sourceAttached = false;
    let phaseApplied = false;
    let waitingForPhase = false;
    let transparencyChecked = false;
    let failed = false;

    const syncPlayback = () => {
      if (!nearViewport || reducedMotion.matches || document.hidden || failed) {
        delete layer.dataset.active;
        video.pause();
        return;
      }
      layer.dataset.active = "true";
      if (!sourceAttached) {
        sourceAttached = true;
        video.src = videoSource;
        video.load();
        return;
      }
      if (transparencyChecked && video.paused) void video.play().catch(() => {});
    };

    const applyPhase = () => {
      if (phaseApplied || !Number.isFinite(video.duration) || video.duration <= 0) return;
      phaseApplied = true;
      try {
        const phase = Math.min(phaseSeconds % video.duration, video.duration - 0.05);
        if (phase > 0.05) {
          waitingForPhase = true;
          video.currentTime = phase;
        }
      } catch { waitingForPhase = false; /* Play from the beginning if seeking is unavailable. */ }
    };

    const checkTransparency = () => {
      if (transparencyChecked || failed || waitingForPhase) return;
      try {
        // A single frame check keeps an opaque WebM fallback from painting black.
        const canvas = document.createElement("canvas");
        canvas.width = 12;
        canvas.height = 8;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("Canvas is unavailable");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparentPixels = 0;
        for (let index = 3; index < pixels.length; index += 4) {
          if (pixels[index] < 160) transparentPixels++;
        }
        if (transparentPixels < 4) throw new Error("Transparent video is unsupported");
        transparencyChecked = true;
        layer.dataset.ready = "true";
        syncPlayback();
      } catch {
        failed = true;
        video.pause();
      }
    };

    const onError = () => {
      failed = true;
      video.pause();
      delete layer.dataset.ready;
      delete layer.dataset.active;
    };

    const onSeeked = () => {
      waitingForPhase = false;
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) checkTransparency();
    };

    const observer = new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting;
      if (portalHost) layer.style.setProperty("--leaf-exposure", String(Math.min(1, entry.intersectionRatio * 1.3)));
      syncPlayback();
    }, { rootMargin: portalHost ? "0px" : "180px 0px", threshold: portalHost ? [0, 0.15, 0.35, 0.55, 0.75] : 0 });

    video.addEventListener("loadedmetadata", applyPhase);
    video.addEventListener("loadeddata", checkTransparency);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    observer.observe(observeTarget);

    return () => {
      observer.disconnect();
      video.pause();
      video.removeEventListener("loadedmetadata", applyPhase);
      video.removeEventListener("loadeddata", checkTransparency);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [phaseSeconds, portalHost]);

  const layer = <div
    ref={layerRef}
    className={[styles.root, styles[position], styles[intensity], mirror ? styles.mirror : "", portalHost ? styles.foreground : ""].join(" ")}
    aria-hidden="true"
  >
    <video
      ref={videoRef}
      className={styles.video}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      controls={false}
      tabIndex={-1}
      aria-hidden="true"
      disablePictureInPicture
    />
  </div>;

  return portalHost === undefined ? layer : <>
    <span ref={anchorRef} className={styles.anchor} aria-hidden="true" />
    {portalHost && createPortal(layer, portalHost)}
  </>;
}
