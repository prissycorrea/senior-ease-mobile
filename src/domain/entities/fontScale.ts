export const FONT_SCALE_DEFAULT = 1;
export const FONT_SCALE_MIN = 0.85;
export const FONT_SCALE_MAX = 2;
export const FONT_SCALE_STEP = 0.05;

export function clampFontScale(value: number): number {
  const n = Math.round(value * 100) / 100;
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, n));
}
