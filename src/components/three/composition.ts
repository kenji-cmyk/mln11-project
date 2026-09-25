// One pose per reading stage: hero, five chapters, then footer.
// ScrollModelSection measures contiguous reading anchors from the text layout.
export type ModelPose = { x: number; y: number; scale: number; opacity: number; yaw: number };
const pose = (x: number, y: number, scale: number, opacity = 1, yaw = 0): ModelPose => ({ x, y, scale, opacity, yaw });
export const MODEL_SCROLL_STATES = {
  desktop: [
    pose(27, -27, 0.14, 0, -0.46),
    pose(23, 2, 0.92), pose(-23, -5, 1.03), pose(23, -2, 1.13),
    pose(-23, 3, 1.02), pose(22, -5, 1.08),
    pose(48, 49, 0.2, 0, 0.72),
  ],
  mobile: [
    pose(24, -28, 0.2, 0, -0.46),
    pose(6, -20, 1.05), pose(-9, -23, 1.12), pose(8, -17, 1.22),
    pose(-7, -21, 1.10), pose(7, -19, 1.15),
    pose(38, 40, 0.2, 0, 0.72),
  ],
} as const;

const SIDE_BY_SIDE_FIT = { fullSizeAspect: 1.5, minimumScale: 0.62 };

// Preserve motion through non-turning anchors without overshooting any pose.
function tangent(before: number, after: number) {
  return before * after <= 0 ? 0 : 2 * before * after / (before + after);
}

export function sampleComposition(progress: number, compact: boolean, aspect = 16 / 9): ModelPose {
  const frames = compact ? MODEL_SCROLL_STATES.mobile : MODEL_SCROLL_STATES.desktop;
  const position = Math.max(0, Math.min(1, progress)) * (frames.length - 1);
  const index = Math.min(frames.length - 2, Math.floor(position));
  const t = position - index;
  const from = frames[index];
  const to = frames[index + 1];
  const mix = (key: keyof ModelPose) => {
    const a = from[key];
    const b = to[key];
    const slope = b - a;
    const start = index === 0 ? slope : tangent(a - frames[index - 1][key], slope);
    const end = index + 2 === frames.length ? slope : tangent(slope, frames[index + 2][key] - b);
    const squared = t * t;
    const cubed = squared * t;
    return (2 * cubed - 3 * squared + 1) * a + (cubed - 2 * squared + t) * start
      + (-2 * cubed + 3 * squared) * b + (cubed - squared) * end;
  };
  // Keep the model inside its text-free column on portrait tablets.
  const fit = compact ? 1 : Math.min(1, Math.max(SIDE_BY_SIDE_FIT.minimumScale, aspect / SIDE_BY_SIDE_FIT.fullSizeAspect));
  return {
    x: mix("x"), y: mix("y"), scale: mix("scale") * fit,
    opacity: mix("opacity"), yaw: mix("yaw"),
  };
}
