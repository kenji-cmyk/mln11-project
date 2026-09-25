"use client";

import { Component, Suspense, useEffect, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useProgress } from "@react-three/drei";
import { StoryCamera } from "./StoryCamera";
import { CourseModel } from "./CourseModel";
import { StoryEnvironment } from "./StoryEnvironment";
import { MODEL_URL, type SceneMotion } from "./motion";

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children; }
}

function SceneFallback() {
  return <div className="scene-fallback"><span aria-hidden="true">⌂</span><p>Không thể hiển thị mô hình 3D.<br />Bạn vẫn có thể cuộn để đọc toàn bộ nội dung.</p></div>;
}

function SceneLoading() {
  const { active } = useProgress();
  return active ? <div className="scene-loading" role="status">Đang tải mô hình 3D…</div> : null;
}

export default function CourseScene({ motion }: { motion: SceneMotion }) {
  useEffect(() => { if (MODEL_URL) useGLTF.preload(MODEL_URL); }, []);
  return (
    <SceneBoundary>
      <Canvas
        resize={{ offsetSize: true }}
        frameloop="demand" dpr={[1, 1.5]}
        camera={{ position: [4, 2.4, 7.5], fov: 34 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        fallback={<SceneFallback />}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
      >
        <StoryCamera motion={motion} />
        <Suspense fallback={null}>
          <CourseModel motion={motion} />
          <StoryEnvironment />
        </Suspense>
      </Canvas>
      <SceneLoading />
    </SceneBoundary>
  );
}
