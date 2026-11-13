type BrandMarkProps = {
  size?: 'md' | 'lg'
}

/** The three-bar BiomarkHQ logo tile. Purely decorative. */
export function BrandMark({ size = 'md' }: BrandMarkProps) {
  return (
    <span className={size === 'lg' ? 'brand-mark brand-mark--lg' : 'brand-mark'} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}
