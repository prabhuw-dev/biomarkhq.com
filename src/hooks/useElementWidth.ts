import { useCallback, useRef, useSyncExternalStore } from 'react'

/**
 * Tracks an element's width in CSS pixels. The width is read straight from the
 * element as soon as it mounts, so the first paint already uses the real size,
 * then kept current with a ResizeObserver (and window resizes as a backstop).
 */
export function useElementWidth<T extends Element>(fallback: number) {
  const ref = useRef<T>(null)

  const subscribe = useCallback((onChange: () => void) => {
    const el = ref.current
    const observer = el ? new ResizeObserver(onChange) : null
    if (el) observer?.observe(el)
    window.addEventListener('resize', onChange)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', onChange)
    }
  }, [])

  const getWidth = useCallback(
    () => (ref.current ? Math.round(ref.current.getBoundingClientRect().width) : fallback),
    [fallback],
  )

  const width = useSyncExternalStore(subscribe, getWidth, () => fallback)
  return [ref, width] as const
}
