import type { ChartLevel } from './chartText'

/**
 * Level names shown above a chart that is too narrow to label its bands
 * inside the plot. Same text size and colours as the in-chart labels.
 */
export function ChartLevelLegend({ levels }: { levels: ChartLevel[] }) {
  return (
    <div className="level-legend" aria-hidden="true">
      {levels.map((l) => (
        <span key={l.name} className="level-legend__item" style={{ color: l.edge }}>
          <span className="level-legend__edge" style={{ background: l.edge }} />
          {l.name}
        </span>
      ))}
    </div>
  )
}
