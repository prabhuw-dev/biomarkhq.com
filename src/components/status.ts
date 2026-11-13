export type StatusKind = 'alert' | 'warn' | 'ok'

export const STATUS_COLOR: Record<StatusKind, string> = {
  alert: 'var(--alert)',
  warn: 'var(--warn)',
  ok: 'var(--ink)',
}
