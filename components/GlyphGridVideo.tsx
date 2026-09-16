'use client'

/*
 * GlyphGridVideo — variant of GlyphGrid where the glyphs are "filled" with a
 * static mosaic of the standard+ product videos (public/video/std).
 *
 * Pipeline, per frame:
 *   1. Render the video mosaic into an offscreen canvas: one row of
 *      full-height 16:9 tiles, alternating between the clips (cover-fit).
 *      The layout never changes; only the videos play.
 *   2. On the visible canvas, draw the white glyphs (with their animated
 *      opacity) on a transparent background — this is the mask.
 *   3. Composite the mosaic over it with `source-in`: only the mosaic pixels
 *      under a glyph survive, weighted by the glyph's opacity. Everything else
 *      stays transparent, so the page background shows through.
 *
 * Result: the same noise/spring/mouse-driven glyph field as GlyphGrid, but
 * every glyph carries the colour of the video playing beneath it.
 */

import { useEffect, useRef } from 'react'
import type P5 from 'p5'

const VIDEO_DIR = '/video/std'
const VIDEOS = ['post_2.mp4']
/** Colour used under the glyphs until a video has decoded its first frame. */
const FALLBACK_COLOR = '#56748b'

const GLYPHS = ['◊', '↔', '+', '→']
const BASE_SIZE = 256
const MAX_PIXEL_DENSITY = 2
/** Glyph pitch in px — small so the videos read through the glyph field. */
const DEFAULT_CELL_SIZE = 6
/** Glyph size relative to the cell (>1 lets neighbours overlap slightly). */
const GLYPH_SIZE_FACTOR = 1.15

const SPRING_STRENGTH = 0.1
const DAMPING = 0.7
const NOISE_SCALE = 0.18
const TIME_SCALE = 0.01

const MOUSE_RADIUS_FACTOR = 1
const MOUSE_SCALE_BOOST = 0.55
const MOUSE_OPACITY_BOOST = 90
const MOUSE_ROTATION_STRENGTH = 0.25

/**
 * Canvas filter applied when compositing the mosaic through the glyph mask.
 * The std clips are mostly neutral/white, so we push saturation + contrast to
 * make the video colours read on the page. Ignored by browsers without
 * `CanvasRenderingContext2D.filter` support.
 */
const MOSAIC_FILTER = 'saturate(1.9) contrast(1.25)'

const GLYPH_COUNT = GLYPHS.length

const make2D = (cols: number, rows: number, fill: number) =>
  Array.from({ length: cols }, () => Array.from({ length: rows }, () => fill))

type GlyphGridVideoProps = {
  className?: string
  cellSize?: number
}

export default function GlyphGridVideo({
  className,
  cellSize = DEFAULT_CELL_SIZE,
}: GlyphGridVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let p5Instance: P5 | null = null
    let resizeObserver: ResizeObserver | null = null
    let resizeFn: (() => void) | null = null
    let cancelled = false
    let videos: HTMLVideoElement[] = []
    let readyTimeout: ReturnType<typeof setTimeout> | null = null

    const signalReady = () => {
      if (cancelled) return
      const w = window as unknown as { __glyphGridReady?: boolean }
      if (w.__glyphGridReady) return
      w.__glyphGridReady = true
      window.dispatchEvent(new Event('glyphgrid:ready'))
    }

    void (async () => {
      const host = containerRef.current
      if (!host) return

      // ── Hidden <video> sources for the mosaic ──
      videos = VIDEOS.map((name) => {
        const v = document.createElement('video')
        v.src = `${VIDEO_DIR}/${encodeURIComponent(name)}`
        v.muted = true
        v.loop = true
        v.autoplay = true
        v.playsInline = true
        v.preload = 'auto'
        v.setAttribute('aria-hidden', 'true')
        v.style.cssText =
          'position:absolute;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;'
        v.addEventListener('loadeddata', signalReady, { once: true })
        host.appendChild(v)
        void v.play().catch(() => {})
        return v
      })
      // Safety net: don't hold the rest of the page hostage if a video stalls.
      readyTimeout = setTimeout(signalReady, 4000)

      const fontReady = (async () => {
        try {
          const face = new FontFace(
            'Gridular',
            'url(/font/Gridular-Regular.otf) format("opentype")',
          )
          const loaded = await face.load()
          document.fonts.add(loaded)
        } catch (err) {
          console.warn('Gridular font failed to load, falling back', err)
        }
      })()

      const [, mod] = await Promise.all([fontReady, import('p5')])
      if (cancelled || !containerRef.current) return
      const P5Ctor = mod.default

      const sketch = (p: P5) => {
        let glyphCanvases: HTMLCanvasElement[] = []
        let gridCols = 1
        let gridRows = 1
        let scales: number[][] = []
        let targetScales: number[][] = []
        let scaleVelocities: number[][] = []
        let opacities: number[][] = []
        let targetOpacities: number[][] = []
        let opacityVelocities: number[][] = []
        let mouseSeen = false
        let smoothMouseX = 0
        let smoothMouseY = 0

        let mosaicCols = 1
        let mosaicTileW = 1
        let mosaicOffsetX = 0
        // Offscreen buffer holding the mosaic, in device pixels.
        const mosaicCanvas = document.createElement('canvas')
        const mosaicCtx = mosaicCanvas.getContext('2d')

        const sizeMosaicCanvas = (w: number, h: number, pd: number) => {
          mosaicCanvas.width = Math.max(1, Math.round(w * pd))
          mosaicCanvas.height = Math.max(1, Math.round(h * pd))
          if (mosaicCtx) {
            mosaicCtx.imageSmoothingEnabled = true
            mosaicCtx.imageSmoothingQuality = 'high'
          }
        }

        const hostSize = () => {
          const h = containerRef.current
          if (!h) return { w: 600, h: 200 }
          const w = h.clientWidth
          const hh = h.clientHeight
          return { w: w || 600, h: hh || 200 }
        }

        const rebuildGrid = (w: number, h: number) => {
          gridCols = Math.max(1, Math.round(w / cellSize))
          gridRows = Math.max(1, Math.round(h / cellSize))
          scales = make2D(gridCols, gridRows, 1)
          targetScales = make2D(gridCols, gridRows, 1)
          scaleVelocities = make2D(gridCols, gridRows, 0)
          opacities = make2D(gridCols, gridRows, 255)
          targetOpacities = make2D(gridCols, gridRows, 255)
          opacityVelocities = make2D(gridCols, gridRows, 0)
        }

        const rebuildMosaic = (w: number) => {
          // Exactly one tile per clip: the row is split evenly across the
          // banner width, each tile spanning the full height (cover-fit).
          mosaicCols = videos.length
          mosaicTileW = w / mosaicCols
          mosaicOffsetX = 0
        }

        const drawMosaic = (ctx: CanvasRenderingContext2D, pd: number) => {
          ctx.setTransform(pd, 0, 0, pd, 0, 0)
          ctx.globalCompositeOperation = 'source-over'
          ctx.globalAlpha = 1
          const tileW = mosaicTileW
          const tileH = p.height

          for (let i = 0; i < mosaicCols; i++) {
            const dx = mosaicOffsetX + i * tileW
            // One tile per clip, left to right.
            const v = videos[i]
            const vw = v.videoWidth
            const vh = v.videoHeight

            if (v.readyState < 2 || !vw || !vh) {
              ctx.fillStyle = FALLBACK_COLOR
              ctx.fillRect(dx, 0, tileW + 1, tileH + 1)
              continue
            }

            // Cover-fit the whole video into the tile (centre crop).
            const tileAspect = tileW / tileH
            let sw = vw
            let sh = vw / tileAspect
            if (sh > vh) {
              sh = vh
              sw = vh * tileAspect
            }
            const sx = (vw - sw) * 0.5
            const sy = (vh - sh) * 0.5

            ctx.drawImage(v, sx, sy, sw, sh, dx, 0, tileW + 1, tileH + 1)
          }
        }

        p.setup = () => {
          const { w, h } = hostSize()
          p.createCanvas(w, h)
          const dpr =
            typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
          p.pixelDensity(Math.min(dpr, MAX_PIXEL_DENSITY))
          p.frameRate(60)
          p.smooth()

          const ctx = p.drawingContext as CanvasRenderingContext2D
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'

          rebuildGrid(w, h)
          rebuildMosaic(w)
          sizeMosaicCanvas(w, h, p.pixelDensity())

          const buffers = GLYPHS.map((g) => {
            const buf = p.createGraphics(BASE_SIZE, BASE_SIZE)
            buf.clear()
            buf.textFont('Gridular, sans-serif')
            buf.textAlign(p.CENTER, p.CENTER)
            buf.textSize(BASE_SIZE * 0.8)
            buf.fill(255)
            buf.noStroke()
            buf.text(g, BASE_SIZE / 2, BASE_SIZE / 2)
            return buf
          })
          glyphCanvases = buffers.map(
            (g) => (g as unknown as { canvas: HTMLCanvasElement }).canvas,
          )

          resizeFn = () => {
            const { w: nw, h: nh } = hostSize()
            if (nw > 0 && nh > 0) {
              p.resizeCanvas(nw, nh)
              const c = p.drawingContext as CanvasRenderingContext2D
              c.imageSmoothingEnabled = true
              c.imageSmoothingQuality = 'high'
              const targetCols = Math.max(1, Math.round(nw / cellSize))
              const targetRows = Math.max(1, Math.round(nh / cellSize))
              if (targetCols !== gridCols || targetRows !== gridRows) {
                rebuildGrid(nw, nh)
              }
              rebuildMosaic(nw)
              sizeMosaicCanvas(nw, nh, p.pixelDensity())
            }
          }
        }

        p.mouseMoved = () => {
          if (!mouseSeen) {
            smoothMouseX = p.mouseX
            smoothMouseY = p.mouseY
            mouseSeen = true
          }
        }

        p.keyPressed = () => {
          if (p.key === ' ') {
            p.noiseSeed(Math.floor(Math.random() * 10000))
          }
        }

        p.draw = () => {
          const ctx = p.drawingContext as CanvasRenderingContext2D
          const pd = p.pixelDensity()

          // 1. Video mosaic → offscreen buffer.
          if (mosaicCtx) drawMosaic(mosaicCtx, pd)

          // 2. Glyph mask on a transparent canvas (white glyphs, animated alpha).
          ctx.setTransform(pd, 0, 0, pd, 0, 0)
          ctx.globalCompositeOperation = 'source-over'
          ctx.globalAlpha = 1
          p.clear()

          const cellWidth = p.width / gridCols
          const cellHeight = p.height / gridRows
          const halfCellW = cellWidth * 0.5
          const halfCellH = cellHeight * 0.5
          const cellMin = Math.min(cellWidth, cellHeight)
          const baseDraw = cellMin * GLYPH_SIZE_FACTOR
          const t3 = p.frameCount * TIME_SCALE

          if (mouseSeen) {
            smoothMouseX += (p.mouseX - smoothMouseX) * 0.2
            smoothMouseY += (p.mouseY - smoothMouseY) * 0.2
          }

          const mouseRadius =
            Math.min(p.width, p.height) * MOUSE_RADIUS_FACTOR
          const mouseRadiusInv = 1 / mouseRadius
          const mouseRadiusSq = mouseRadius * mouseRadius

          for (let x = 0; x < gridCols; x++) {
            const xPos = x * cellWidth + halfCellW
            const col = scales[x]
            const colT = targetScales[x]
            const colSV = scaleVelocities[x]
            const colO = opacities[x]
            const colOT = targetOpacities[x]
            const colOV = opacityVelocities[x]
            const xNoise = x * NOISE_SCALE

            for (let y = 0; y < gridRows; y++) {
              const yPos = y * cellHeight + halfCellH

              const noiseValue = p.noise(xNoise, y * NOISE_SCALE, t3)

              let mouseInfluence = 0
              let mouseAngle = 0
              if (mouseSeen) {
                const dx = smoothMouseX - xPos
                const dy = smoothMouseY - yPos
                const distSq = dx * dx + dy * dy
                if (distSq < mouseRadiusSq) {
                  const u = 1 - Math.sqrt(distSq) * mouseRadiusInv
                  mouseInfluence = u * u * (3 - 2 * u)
                  mouseAngle = Math.atan2(dy, dx)
                }
              }

              const targetScale =
                0.3 + noiseValue * 1.5 + mouseInfluence * MOUSE_SCALE_BOOST
              colT[y] = targetScale
              const scaleDiff = targetScale - col[y]
              const sv = (colSV[y] + scaleDiff * SPRING_STRENGTH) * DAMPING
              colSV[y] = sv
              const s = col[y] + sv
              col[y] = s

              let targetOpacity =
                50 + noiseValue * 205 + mouseInfluence * MOUSE_OPACITY_BOOST
              if (targetOpacity > 255) targetOpacity = 255
              colOT[y] = targetOpacity
              const opacityDiff = targetOpacity - colO[y]
              const ov =
                (colOV[y] + opacityDiff * SPRING_STRENGTH) * DAMPING
              colOV[y] = ov
              const o = colO[y] + ov
              colO[y] = o

              const drawSize = baseDraw * s
              const half = drawSize * 0.5
              const glyphIndex = (x + y) % GLYPH_COUNT

              ctx.globalAlpha = o * (1 / 255)

              if (mouseInfluence > 0) {
                const angle =
                  mouseAngle * mouseInfluence * MOUSE_ROTATION_STRENGTH
                const c = Math.cos(angle) * pd
                const sn = Math.sin(angle) * pd
                ctx.setTransform(c, sn, -sn, c, xPos * pd, yPos * pd)
              } else {
                ctx.setTransform(pd, 0, 0, pd, xPos * pd, yPos * pd)
              }

              ctx.drawImage(
                glyphCanvases[glyphIndex],
                -half,
                -half,
                drawSize,
                drawSize,
              )
            }
          }

          // 3. Composite the mosaic through the glyph mask in a single draw:
          // `source-in` keeps the mosaic only where glyphs exist, scaled by
          // the glyph alpha. Everything outside the glyphs stays transparent.
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          ctx.globalAlpha = 1
          ctx.globalCompositeOperation = 'source-in'
          ctx.filter = MOSAIC_FILTER
          ctx.drawImage(mosaicCanvas, 0, 0)

          // Restore defaults for the next frame / p5 internals.
          ctx.filter = 'none'
          ctx.setTransform(pd, 0, 0, pd, 0, 0)
          ctx.globalCompositeOperation = 'source-over'
        }
      }

      p5Instance = new P5Ctor(sketch, containerRef.current)

      if (containerRef.current) {
        resizeObserver = new ResizeObserver(() => resizeFn?.())
        resizeObserver.observe(containerRef.current)
      }
    })()

    return () => {
      cancelled = true
      if (readyTimeout) clearTimeout(readyTimeout)
      resizeObserver?.disconnect()
      p5Instance?.remove()
      videos.forEach((v) => {
        v.pause()
        v.removeAttribute('src')
        v.load()
        v.remove()
      })
      videos = []
    }
  }, [cellSize])

  return (
    <>
      {/* Preload the glyph font early (React hoists this into <head>). */}
      <link
        rel="preload"
        href="/font/Gridular-Regular.otf"
        as="font"
        type="font/otf"
        crossOrigin="anonymous"
      />
      <div ref={containerRef} className={`relative ${className ?? ''}`} />
    </>
  )
}
