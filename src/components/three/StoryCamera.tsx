"use client";
import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import type { SceneMotion } from "./motion";
import { sampleStory } from "./storyboard";

export function StoryCamera({ motion }: { motion: SceneMotion }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => motion.subscribe(invalidate), [motion, invalidate]);
  useFrame(({ camera, size }) => {
    if (!(camera instanceof PerspectiveCamera)) return;
    const shot = sampleStory(motion.progress);
    const fit = Math.max(1, 1 / camera.aspect);
    camera.position.set(shot.camera[0] * fit, shot.camera[1] * fit, shot.camera[2] * fit);
    camera.lookAt(...shot.target);
    const fov = size.width < 600 ? 43 : 39;
    if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
  });
  return null;
}
