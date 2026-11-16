/**
 * Chart label sizes in screen pixels. Charts draw with one viewBox unit per
 * CSS pixel, so these are the sizes people actually see. They match the
 * design system's chart labels as rendered on its page.
 */
export const CHART_TEXT = {
  level: 11,
  value: 13.5,
  axis: 12,
  unit: 11.5,
}

/** Tracking on level labels, per the design system. */
export const LEVEL_TRACKING = 1

/** Approximate rendered width of Geist Mono text (0.6em advance per glyph). */
export function monoWidth(text: string, size: number, tracking = 0) {
  return text.length * (size * 0.6 + tracking)
}

/**
 * Room the in-chart level labels need on the left: the 4px edge, a 10px
 * inset, the longest label, then a gap before the first reading.
 */
export function levelGutter(names: string[]) {
  return 14 + Math.max(...names.map((n) => monoWidth(n, CHART_TEXT.level, LEVEL_TRACKING))) + 18
}

export type ChartLevel = { name: string; top: number; bottom: number; fill: string; edge: string }
