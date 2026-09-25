export class SceneMotion {
  progress = 0;
  opacity = 1;
  yaw = 0;
  pitch = 0;
  roll = 0;
  reduced = false;
  private listeners = new Set<() => void>();

  setPose(progress: number, opacity: number, yaw: number, pitch = 0, roll = 0) {
    if (this.progress === progress && this.opacity === opacity && this.yaw === yaw && this.pitch === pitch && this.roll === roll) return;
    this.progress = progress;
    this.opacity = opacity;
    this.yaw = yaw;
    this.pitch = pitch;
    this.roll = roll;
    this.listeners.forEach((invalidate) => invalidate());
  }

  setReduced(reduced: boolean) {
    if (this.reduced === reduced) return;
    this.reduced = reduced;
    this.listeners.forEach((invalidate) => invalidate());
  }

  subscribe(invalidate: () => void) {
    this.listeners.add(invalidate);
    invalidate();
    return () => { this.listeners.delete(invalidate); };
  }
}

export const MODEL_URL = "/models/small_house.glb";

// Map contiguous reading anchors to the timeline without scroll dead zones.
export function sampleScrollProgress(scroll: number, anchors: readonly number[]) {
  if (anchors.length < 2 || scroll <= anchors[0]) return 0;
  for (let i = 1; i < anchors.length; i++) {
    if (scroll < anchors[i]) {
      return (i - 1 + (scroll - anchors[i - 1]) / (anchors[i] - anchors[i - 1])) / (anchors.length - 1);
    }
  }
  return 1;
}
