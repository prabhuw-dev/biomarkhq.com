import type { CSSProperties } from 'react'
import { STATUS_COLOR } from './status'
import type { StatusKind } from './status'

type RangeStripProps = {
  /** Start and end of the optimal range along the track, as percentages. */
  optimal: [number, number]
  /** Where this result sits along the track, as a percentage. */
  position: number
  status: StatusKind
}

/**
 * The design system's signature range strip (v1.3): a three-level track —
 * below range, optimal, above range — and a marker coloured by status.
 * Decorative here; the value and status pill beside it carry the meaning.
 */
export function RangeStrip({ optimal, position, status }: RangeStripProps) {
  const style = {
    '--opt-a': `${optimal[0]}%`,
    '--opt-b': `${optimal[1]}%`,
  } as CSSProperties
  return (
    <span className="strip" style={style} aria-hidden="true">
      <span className="strip__track" />
      <span className="strip__marker" style={{ left: `${position}%`, background: STATUS_COLOR[status] }} />
    </span>
  )
}
