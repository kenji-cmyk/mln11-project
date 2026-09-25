"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Group, Vector3 } from "three";
import { MODEL_URL } from "./motion";
import type { SceneMotion } from "./motion";

export function CourseModel({ motion }: { motion: SceneMotion }) {
  const group = useRef<Group>(null);
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => motion.subscribe(invalidate), [motion, invalidate]);
  useFrame(() => {
    if (group.current) group.current.rotation.set(motion.pitch, motion.yaw, motion.roll);
  });
  const { scene } = useGLTF(MODEL_URL);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(clone);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const scale = 4 / Math.max(size.x, size.y, size.z, 0.001);
    return { scene: clone, scale, position: center.multiplyScalar(-scale) };
  }, [scene]);
  // Rotate the centered model, so pointer movement never makes it orbit its origin.
  return <group ref={group}><group scale={model.scale} position={model.position}><primitive object={model.scene} /></group></group>;
}
