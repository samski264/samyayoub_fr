'use client'

import { useEffect, useRef } from 'react'
import type P5 from 'p5'

const GLYPHS = ['◊', '↔', '+', '→']
const BASE_SIZE = 256
const MAX_PIXEL_DENSITY = 2
const DEFAULT_CELL_SIZE = 18

const SPRING_STRENGTH = 0.1
const DAMPING = 0.7
const NOISE_SCALE = 0.18
const TIME_SCALE = 0.01

const MOUSE_RADIUS_FACTOR = 1
const MOUSE_SCALE_BOOST = 0.55
const MOUSE_OPACITY_BOOST = 90
const MOUSE_ROTATION_STRENGTH = 0.25

const GLYPH_COUNT = GLYPHS.length

const make2D = (cols: number, rows: number, fill: number) =>
  Array.from({ length: cols }, () => Array.from({ length: rows }, () => fill))

type GlyphGridProps = {
  className?: string
  cellSize?: number
}

export default function GlyphGrid({
  className,
  cellSize = DEFAULT_CELL_SIZE,
}: GlyphGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let p5Instance: P5 | null = null
    let resizeObserver: ResizeObserver | null = null
    let resizeFn: (() => void) | null = null
    let cancelled = false

    void (async () => {
      // Kick off the font load and the (heavy) p5 import in parallel so the
      // canvas is ready after max(font, p5) instead of font + p5.
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

        const hostSize = () => {
          const host = containerRef.current
          if (!host) return { w: 600, h: 200 }
          const w = host.clientWidth
          const h = host.clientHeight
          return { w: w || 600, h: h || 200 }
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
          p.background(0)

          const ctx = p.drawingContext as CanvasRenderingContext2D
          const pd = p.pixelDensity()

          const cellWidth = p.width / gridCols
          const cellHeight = p.height / gridRows
          const halfCellW = cellWidth * 0.5
          const halfCellH = cellHeight * 0.5
          const cellMin = Math.min(cellWidth, cellHeight)
          const baseDraw = cellMin * 0.8
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

          ctx.setTransform(pd, 0, 0, pd, 0, 0)
          ctx.globalAlpha = 1
        }
      }

      p5Instance = new P5Ctor(sketch, containerRef.current)

      const host = containerRef.current
      if (host) {
        resizeObserver = new ResizeObserver(() => resizeFn?.())
        resizeObserver.observe(host)
      }

      // The hero canvas is now the top network/main-thread priority no longer:
      // its heavy assets (the Gridular font + the p5 chunk) have finished
      // downloading and the sketch is mounted. Broadcast that so deferred,
      // below-the-fold media (e.g. MarketingVideos) can start fetching without
      // stealing bandwidth from the canvas during initial load. A rAF lets the
      // first frame paint before we hand priority over.
      requestAnimationFrame(() => {
        if (cancelled) return
        ;(window as unknown as { __glyphGridReady?: boolean }).__glyphGridReady =
          true
        window.dispatchEvent(new Event('glyphgrid:ready'))
      })
    })()

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      p5Instance?.remove()
    }
  }, [])

  return <div ref={containerRef} className={className} />
}
