import type { ReactNode } from 'react'
import type { StatusKind } from './status'

type StatusPillProps = {
  kind: StatusKind
  children: ReactNode
}

export function StatusPill({ kind, children }: StatusPillProps) {
  return <span className={`pill pill--${kind}`}>{children}</span>
}
