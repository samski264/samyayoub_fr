'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

/*
 * Marquee — infinite horizontal carousel. Renders two consecutive copies of
 * `images` and translates the track by exactly one copy's length so the loop
 * is seamless. The keyframes are emitted per-instance via an inline <style>
 * block: this avoids any ambiguity around CSS custom properties interpolating
 * inside `transform: translate3d(...)` (which silently fails in some browsers
 * unless the variable is registered with @property).
 *
 * Loading: each tile's image is fetched only when it is about to enter the
 * screen. A plain IntersectionObserver does NOT work here — it does not
 * re-evaluate intersection for an element moved purely by a CSS transform
 * animation, so loading would stop after the first frame. Instead:
 *   - one IntersectionObserver gates on the *static* container (reliable),
 *     starting/stopping the loader when the section enters/leaves the viewport;
 *   - a rAF loop reads the moving track's real position each frame and assigns
 *     `src` to every tile that has scrolled into view (+ a preload margin).
 * Each tile's layout offset is known exactly from its width + gap, so the loop
 * only does cheap arithmetic (one getBoundingClientRect on the track per frame).
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
  /**
   * Reshuffle the image order on the client after mount. The server-rendered
   * order is kept for the first paint (so there is no hydration mismatch), then
   * a fresh random order is applied in `useEffect` — giving a different order on
   * every visit even though the page itself is statically generated.
   */
  shuffleOnMount?: boolean
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
  shuffleOnMount = false,
}: MarqueeProps) {
  // Identity order on the server / first client paint (avoids hydration
  // mismatch); reshuffled after mount when `shuffleOnMount` is set.
  const [order, setOrder] = useState<number[]>(() => images.map((_, i) => i))

  useEffect(() => {
    if (!shuffleOnMount) return
    setOrder((prev) => {
      const a = [...prev]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    })
  }, [shuffleOnMount, images.length])

  const orderedImages = useMemo(
    () => order.map((i) => images[i]),
    [order, images],
  )
  const orderedWidths = useMemo(
    () => order.map((i) => imageWidths?.[i] ?? tileSize),
    [order, imageWidths, tileSize],
  )

  const widths = orderedWidths
  // Total width of one copy of the track (sum of tile widths + gaps between them)
  const copyLength = widths.reduce((sum, w) => sum + w + gap, 0)
  const durationSec = copyLength / pxPerSecond
  const tiles = [...orderedImages, ...orderedImages]
  const tileWidths = [...widths, ...widths]
  // Re-run the loader effect whenever the order changes (refs are re-created).
  const orderKey = order.join(',')
  const animationName = `marquee-${id}`

  const fromX = direction === 'left' ? 0 : -copyLength
  const toX = direction === 'left' ? -copyLength : 0
  const keyframes = `@keyframes ${animationName} {
    from { transform: translate3d(${fromX}px, 0, 0); }
    to   { transform: translate3d(${toX}px, 0, 0); }
  }`

  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const imgsRef = useRef<(HTMLImageElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    // Exact left offset of each tile inside the track (paddingLeft = gap,
    // plus one gap between every pair of tiles — flex `gap` is deterministic).
    const offsets: number[] = []
    let acc = gap
    for (let i = 0; i < tileWidths.length; i++) {
      offsets[i] = acc
      acc += tileWidths[i] + gap
    }

    const MARGIN = 400
    const pending = new Set<number>()
    imgsRef.current.forEach((el, i) => {
      if (el && !el.getAttribute('src')) pending.add(i)
    })

    let raf = 0
    let running = false

    const tick = () => {
      if (pending.size === 0) {
        running = false
        return
      }
      const trackLeft = track.getBoundingClientRect().left
      const vw = window.innerWidth
      for (const i of pending) {
        const left = trackLeft + offsets[i]
        if (left + tileWidths[i] > -MARGIN && left < vw + MARGIN) {
          const el = imgsRef.current[i]
          const ds = el?.dataset.src
          if (el && ds) el.src = ds
          pending.delete(i)
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!running && pending.size > 0) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // Only run the loader while the section is vertically on screen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) start()
          else stop()
        }
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0 },
    )
    io.observe(container)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, copyLength, gap, tiles.length, orderKey])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ height: tileSize, ...style }}
      aria-hidden
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div
        ref={trackRef}
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
            ref={(el) => {
              imgsRef.current[i] = el
            }}
            data-src={src}
            alt={altPrefix ? `${altPrefix} ${(i % images.length) + 1}` : ''}
            className="block flex-none rounded-[4px] object-cover bg-[#f0f0f0]"
            style={{ width: tileWidths[i], height: tileSize }}
            decoding="async"
            draggable={false}
          />
        ))}
      </div>
    </div>
  )
}
