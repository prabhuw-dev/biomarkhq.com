/** Measured against the optimal range: below (oxblood), in range (sage), above (ochre). */
export type StatusKind = 'alert' | 'warn' | 'ok'

export const STATUS_COLOR: Record<StatusKind, string> = {
  alert: 'var(--alert)',
  warn: 'var(--warn)',
  ok: 'var(--ok)',
}
