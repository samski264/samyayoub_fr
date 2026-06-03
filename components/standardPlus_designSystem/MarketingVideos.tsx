'use client'

/*
 * MarketingVideos — Figma node 203:2994 / 94:62.
 * Row of 6 vertical marketing clips (mk1 → mk6) scrolling endlessly.
 *
 * Loading model: downloads start once the whole page has mounted and rendered
 * (we wait for the main thread to go idle, after first paint), so the hero
 * GlyphGrid <canvas> and the above-the-fold content keep network + main-thread
 * priority while everything mounts/paints, then the clips begin fetching —
 * without waiting for the user to scroll down. Each clip is fetched ONCE into a
 * Blob object URL. Every on-screen tile reuses that same in-memory URL, so a
 * clip is downloaded a single time over the network no matter how many
 * instances are rendered. (Two <video> elements never share a decode pipeline —
 * that is inherent to HTML media — but the *download* happens once.)
 *
 * Scroll model: a single track is moved with `transform: translateX` driven by
 * an unbounded `offset` accumulator taken modulo one set width. Because the
 * offset is just a number, the scroll is truly infinite in both directions —
 * auto-scroll, drag and inertia never hit an edge. The number of copies is
 * computed to always cover the viewport, so no gap or visible seam appears.
 * Same mechanism on desktop and mobile; mobile adds touch drag + momentum.
 */

import { useEffect, useRef, useState } from 'react'

const VIDEOS = ['mk1', 'mk2', 'mk3', 'mk6', 'mk5', 'mk4'] as const

const TILE_W = 250
const TILE_H = 445
const GAP = 119
const PX_PER_SECOND = 70

const MOBILE_TILE_W = 200
const MOBILE_TILE_H = Math.round(MOBILE_TILE_W * (TILE_H / TILE_W))
const MOBILE_GAP = 16
const MOBILE_PX_PER_SECOND = 40

export default function MarketingVideos() {
  const trackRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)

  // The hero GlyphGrid <canvas> at the top of the page is priority #1: it must
  // win the initial network + main-thread budget. So we hold off every video
  // download until the canvas signals it is ready (its heavy assets — the
  // Gridular font + the p5 chunk — have finished downloading and the sketch is
  // mounted/painted). Only then do the clips start fetching.
  const [ready, setReady] = useState(false)

  // null until measured on the client. Defaults to desktop to match SSR output
  // and avoid a hydration mismatch.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  const desktop = isDesktop ?? true

  // How many times the 6-clip set is repeated in the DOM. Recomputed to always
  // cover the viewport (so the modulo wrap never exposes empty space).
  const [repeat, setRepeat] = useState(2)

  // One Blob object URL per unique clip — every tile reuses it, so each file
  // hits the network exactly once.
  const [sources, setSources] = useState<Record<string, string>>({})

  // ── Layout + copy-count (recomputed on resize) ──
  useEffect(() => {
    const compute = () => {
      const d = window.matchMedia('(min-width: 1024px)').matches
      setIsDesktop(d)
      const tile = d ? TILE_W : MOBILE_TILE_W
      const gap = d ? GAP : MOBILE_GAP
      const oneSet = VIDEOS.length * (tile + gap)
      // +1 set of headroom so the wrap is always covered, min 2 for a loop.
      setRepeat(Math.max(2, Math.ceil(window.innerWidth / oneSet) + 1))
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  // ── Start downloads only once the hero canvas has finished loading ──
  useEffect(() => {
    // If the canvas already signalled before this row mounted, go immediately.
    if ((window as unknown as { __glyphGridReady?: boolean }).__glyphGridReady) {
      setReady(true)
      return
    }

    const onReady = () => setReady(true)
    window.addEventListener('glyphgrid:ready', onReady, { once: true })

    // Safety net: if the canvas never reports ready (font/p5 failed, or the
    // hero isn't present), don't block the videos forever.
    const timeout = setTimeout(() => setReady(true), 8000)

    return () => {
      window.removeEventListener('glyphgrid:ready', onReady)
      clearTimeout(timeout)
    }
  }, [])

  // ── Download each clip once → Blob object URL ──
  useEffect(() => {
    if (!ready) return

    let cancelled = false
    const created: string[] = []

    VIDEOS.forEach((name) => {
      fetch(`/video/${name}.mp4`)
        .then((r) => r.blob())
        .then((blob) => {
          if (cancelled) return
          const url = URL.createObjectURL(blob)
          created.push(url)
          setSources((prev) => ({ ...prev, [name]: url }))
        })
        .catch(() => {
          // Network/decode fallback: stream directly from the static path.
          if (cancelled) return
          setSources((prev) => ({ ...prev, [name]: `/video/${name}.mp4` }))
        })
    })

    return () => {
      cancelled = true
      created.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [ready])

  // ── Infinite transform-driven scroll (auto + drag + inertia) ──
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const tile = desktop ? TILE_W : MOBILE_TILE_W
    const gap = desktop ? GAP : MOBILE_GAP
    const speed = desktop ? PX_PER_SECOND : MOBILE_PX_PER_SECOND
    // One period of the row: every tile owns `tile + gap` (the gap between the
    // last tile of a copy and the first of the next keeps the pattern uniform).
    const setWidth = VIDEOS.length * (tile + gap)

    let offset = 0
    let last: number | null = null
    let raf = 0

    // Drag / inertia state
    let down = false
    let dragging = false
    let decided = false
    let startX = 0
    let startY = 0
    let lastX = 0
    let lastMoveT = 0
    let velocity = 0 // px per frame, used for momentum after release
    let autoPaused = false
    let resumeTimer: ReturnType<typeof setTimeout> | null = null

    const apply = () => {
      let m = offset % setWidth
      if (m < 0) m += setWidth
      track.style.transform = `translate3d(${-m}px, 0, 0)`
    }
    apply()

    const frame = (time: number) => {
      if (last === null) last = time
      const dt = time - last
      last = time

      if (!dragging) {
        if (Math.abs(velocity) > 0.05) {
          // Momentum glide after a flick.
          offset -= velocity
          velocity *= 0.92
        } else if (!autoPaused) {
          offset += (speed * dt) / 1000
        }
      }
      apply()
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const onDown = (e: PointerEvent) => {
      down = true
      dragging = false
      decided = false
      startX = lastX = e.clientX
      startY = e.clientY
      velocity = 0
      if (resumeTimer) clearTimeout(resumeTimer)
    }

    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dxTot = e.clientX - startX
      const dyTot = e.clientY - startY

      if (!decided) {
        if (Math.abs(dxTot) < 6 && Math.abs(dyTot) < 6) return
        decided = true
        if (Math.abs(dxTot) > Math.abs(dyTot)) {
          dragging = true
          autoPaused = true
          try {
            track.setPointerCapture(e.pointerId)
          } catch {}
        } else {
          // Vertical intent → let the page scroll, abort this gesture.
          down = false
          return
        }
      }

      if (!dragging) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      offset -= dx
      velocity = dx
      lastMoveT = performance.now()
      e.preventDefault()
    }

    const endGesture = () => {
      if (!down) return
      down = false
      if (!dragging) return
      dragging = false
      // Drop stale velocity if the finger paused before lifting.
      if (performance.now() - lastMoveT > 120) velocity = 0
      if (resumeTimer) clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => {
        autoPaused = false
      }, 1500)
    }

    track.addEventListener('pointerdown', onDown)
    track.addEventListener('pointermove', onMove)
    track.addEventListener('pointerup', endGesture)
    track.addEventListener('pointercancel', endGesture)

    return () => {
      cancelAnimationFrame(raf)
      if (resumeTimer) clearTimeout(resumeTimer)
      track.removeEventListener('pointerdown', onDown)
      track.removeEventListener('pointermove', onMove)
      track.removeEventListener('pointerup', endGesture)
      track.removeEventListener('pointercancel', endGesture)
    }
  }, [desktop, repeat])

  const css = `
    .mv-outer {
      position: relative;
      width: 100vw;
      left: 50%;
      transform: translateX(-50%);
      padding-top: 100px;
      padding-bottom: 150px;
      overflow: hidden;
    }
    .mv-track {
      display: flex;
      align-items: center;
      width: max-content;
      will-change: transform;
      touch-action: pan-y;
      user-select: none;
      cursor: grab;
    }
    .mv-track:active {
      cursor: grabbing;
    }
    .mv-track--desktop {
      gap: ${GAP}px;
      padding-left: ${GAP}px;
    }
    .mv-track--mobile {
      gap: ${MOBILE_GAP}px;
      padding-left: ${MOBILE_GAP}px;
    }
  `

  // Flat list of tiles: `repeat` copies of the 6 clips. All copies of a clip
  // share the same Blob URL, so this never adds network downloads.
  const tiles = Array.from({ length: repeat }).flatMap((_, copy) =>
    VIDEOS.map((name, i) => ({ name, key: `${copy}-${name}-${i}` })),
  )

  return (
    <div className="mv-outer" ref={outerRef}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div
        ref={trackRef}
        className={`mv-track ${desktop ? 'mv-track--desktop' : 'mv-track--mobile'}`}
        aria-label="Marketing videos"
        aria-hidden
      >
        {tiles.map(({ name, key }) => (
          <video
            key={key}
            src={sources[name]}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
            draggable={false}
            className="block object-cover rounded-[10px] bg-[#f0f0f0] flex-none pointer-events-none"
            style={{
              width: desktop ? TILE_W : MOBILE_TILE_W,
              height: desktop ? TILE_H : MOBILE_TILE_H,
            }}
          />
        ))}
      </div>
    </div>
  )
}
