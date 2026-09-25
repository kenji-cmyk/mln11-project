import { CatmullRomCurve3, Vector3 } from "three";

// A restrained camera journey complements the large screen-space movement.
const route = new CatmullRomCurve3([
  new Vector3(0.5, 0.32, 11.5),
  new Vector3(0.8, 0.38, 10.8),
  new Vector3(1.4, 0.22, 10.2),
  new Vector3(2.1, 0.60, 9.8),
  new Vector3(2.85, 0.18, 10.2),
  new Vector3(3.6, 0.32, 10),
  new Vector3(4.05, 0.38, 11.5),
], false, "catmullrom", 0.35);
const point = new Vector3();
export function sampleStory(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const { x: angle, y: elevation, z: radius } = route.getPoint(p, point);
  return {
    camera: [Math.sin(angle) * Math.cos(elevation) * radius, Math.sin(elevation) * radius, Math.cos(angle) * Math.cos(elevation) * radius] as [number, number, number],
    target: [0, -0.08 + Math.sin(p * Math.PI) * 0.22, 0] as [number, number, number],
  };
}
