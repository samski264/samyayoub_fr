import type { CSSProperties } from 'react'

/*
 * Marquee — infinite horizontal carousel. Renders two consecutive copies of
 * `images` and translates the track by exactly one copy's length so the loop
 * is seamless. The keyframes are emitted per-instance via an inline <style>
 * block: this avoids any ambiguity around CSS custom properties interpolating
 * inside `transform: translate3d(...)` (which silently fails in some browsers
 * unless the variable is registered with @property). Everything stays a
 * server component — pure CSS, zero runtime JS.
 *
 * `tileSize` is the fixed height of each tile (px). `gap` is the spacing
 * between tiles (px). `offsetX` shifts the row horizontally, used by the
 * Thalys grid to brick-stagger the second row.
 *
 * `imageWidths` is an optional per-image display width array. When provided,
 * portrait images (ratio < 1) are shown at their natural aspect ratio
 * (width < tileSize) at the same height. Square and landscape images default
 * to tileSize width with object-cover cropping.
 *
 * `pxPerSecond` controls speed independent of tile count — the longer the
 * list, the longer the loop, but visual speed stays constant.
 */

type MarqueeProps = {
  /** Stable identifier, used to name the per-instance @keyframes rule. */
  id: string
  images: string[]
  /** Optional per-image display widths (px). Parallel to `images`. */
  imageWidths?: number[]
  tileSize: number
  gap: number
  pxPerSecond?: number
  direction?: 'left' | 'right'
  offsetX?: number
  altPrefix?: string
  className?: string
  style?: CSSProperties
}

export default function Marquee({
  id,
  images,
  imageWidths,
  tileSize,
  gap,
  pxPerSecond = 60,
  direction = 'left',
  offsetX = 0,
  altPrefix = '',
  className = '',
  style,
}: MarqueeProps) {
  const widths = images.map((_, i) => imageWidths?.[i] ?? tileSize)
  // Total width of one copy of the track (sum of tile widths + gaps between them)
  const copyLength = widths.reduce((sum, w) => sum + w + gap, 0)
  const durationSec = copyLength / pxPerSecond
  const tiles = [...images, ...images]
  const tileWidths = [...widths, ...widths]
  const animationName = `marquee-${id}`

  const fromX = direction === 'left' ? 0 : -copyLength
  const toX = direction === 'left' ? -copyLength : 0
  const keyframes = `@keyframes ${animationName} {
    from { transform: translate3d(${fromX}px, 0, 0); }
    to   { transform: translate3d(${toX}px, 0, 0); }
  }`

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ height: tileSize, ...style }}
      aria-hidden
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div
        className="flex"
        style={{
          marginLeft: offsetX,
          gap: `${gap}px`,
          paddingLeft: `${gap}px`,
          width: 'max-content',
          animation: `${animationName} ${durationSec}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {tiles.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${src}-${i}`}
            src={src}
            alt={altPrefix ? `${altPrefix} ${(i % images.length) + 1}` : ''}
            className="block flex-none rounded-[4px] object-cover"
            style={{ width: tileWidths[i], height: tileSize }}
            loading="lazy"
            draggable={false}
          />
        ))}
      </div>
    </div>
  )
}
