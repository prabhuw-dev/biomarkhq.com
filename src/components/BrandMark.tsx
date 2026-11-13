/**
 * The BiomarkHQ dot-grid mark (design system v1.1, same artwork as
 * public/favicon.svg): six columns of six dots that grow and warm from
 * sand to terracotta. Purely decorative; pair it with the name.
 */
const COLUMNS: { fill: string; radii: number[] }[] = [
  { fill: '#EDD2C1', radii: [2, 3.5, 1.5, 3, 2.5, 2] },
  { fill: '#E2B6A2', radii: [3, 4.5, 2.5, 4, 3, 3.5] },
  { fill: '#D5987E', radii: [4.5, 5, 4, 5.5, 4.5, 5] },
  { fill: '#C9795B', radii: [5.5, 6, 5.5, 6, 5.5, 6] },
  { fill: '#BD5A38', radii: [6, 6, 6, 6, 6, 6] },
  { fill: '#A94A2A', radii: [6, 6, 6, 6, 6, 6] },
]

export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      {COLUMNS.map((col, x) => (
        <g key={col.fill} fill={col.fill}>
          {col.radii.map((r, y) => (
            <circle key={y} cx={10 + x * 20} cy={10 + y * 20} r={r} />
          ))}
        </g>
      ))}
    </svg>
  )
}

/** Mark plus the lowercase mono wordmark, "biomark" in ink and "hq" in terracotta. */
export function BrandLockup() {
  return (
    <span className="lockup">
      <BrandMark />
      <span className="wordmark" aria-hidden="true">
        biomark<b>hq</b>
      </span>
      <span className="sr-only">BiomarkHQ</span>
    </span>
  )
}
