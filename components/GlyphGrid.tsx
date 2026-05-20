'use client'

import { useEffect, useRef } from 'react'
import type P5 from 'p5'

export default function GlyphGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let p5Instance: P5 | null = null
    let cancelled = false

    void (async () => {
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

      const mod = await import('p5')
      if (cancelled || !containerRef.current) return
      const P5Ctor = mod.default

      const glyphs = ['◊', '↔', '+', '→']
      const gridCols = 54
      const gridRows = 18
      const aspectRatio = gridCols / gridRows
      const baseSize = 256
      const maxPixelDensity = 2
      const springStrength = 0.1
      const damping = 0.7
      const noiseScale = 0.075
      const timeScale = 0.02
      const mouseRadiusFactor = 0.16
      const mouseScaleBoost = 0.55
      const mouseOpacityBoost = 90
      const mouseRotationStrength = 0.25

      const sketch = (p: P5) => {
        let glyphBuffers: P5.Graphics[] = []
        let glyphCanvases: HTMLCanvasElement[] = []
        const glyphCount = glyphs.length
        let scales: number[][] = []
        let targetScales: number[][] = []
        let scaleVelocities: number[][] = []
        let opacities: number[][] = []
        let targetOpacities: number[][] = []
        let opacityVelocities: number[][] = []
        let mouseSeen = false
        let smoothMouseX = 0
        let smoothMouseY = 0

        const make2D = (fill: number) =>
          Array.from({ length: gridCols }, () =>
            Array.from({ length: gridRows }, () => fill),
          )

        const canvasSize = () => {
          const host = containerRef.current
          if (!host) return { w: 200, h: 600 }
          const w = host.clientWidth
          const h = host.clientHeight
          if (w / h > aspectRatio) {
            return { w: h * aspectRatio, h }
          }
          return { w, h: w / aspectRatio }
        }

        p.setup = () => {
          const { w, h } = canvasSize()
          p.createCanvas(w, h)
          const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
          p.pixelDensity(Math.min(dpr, maxPixelDensity))
          p.frameRate(60)
          p.smooth()

          const ctx = p.drawingContext as CanvasRenderingContext2D
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'

          scales = make2D(1.0)
          targetScales = make2D(1.0)
          scaleVelocities = make2D(0)
          opacities = make2D(255)
          targetOpacities = make2D(255)
          opacityVelocities = make2D(0)

          glyphBuffers = glyphs.map((g) => {
            const buf = p.createGraphics(baseSize, baseSize)
            buf.clear()
            buf.textFont('Gridular, sans-serif')
            buf.textAlign(p.CENTER, p.CENTER)
            buf.textSize(baseSize * 0.8)
            buf.fill(255)
            buf.noStroke()
            buf.text(g, baseSize / 2, baseSize / 2)
            return buf
          })
          glyphCanvases = glyphBuffers.map(
            (g) => (g as unknown as { canvas: HTMLCanvasElement }).canvas,
          )
        }

        p.windowResized = () => {
          const { w, h } = canvasSize()
          p.resizeCanvas(w, h)
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
          const t3 = p.frameCount * timeScale

          if (mouseSeen) {
            smoothMouseX += (p.mouseX - smoothMouseX) * 0.2
            smoothMouseY += (p.mouseY - smoothMouseY) * 0.2
          }
          const mouseRadius = Math.min(p.width, p.height) * mouseRadiusFactor
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
            const xNoise = x * noiseScale

            for (let y = 0; y < gridRows; y++) {
              const yPos = y * cellHeight + halfCellH

              const noiseValue = p.noise(xNoise, y * noiseScale, t3)

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

              const targetScale = 0.3 + noiseValue * 1.5 + mouseInfluence * mouseScaleBoost
              colT[y] = targetScale
              const scaleDiff = targetScale - col[y]
              const sv = (colSV[y] + scaleDiff * springStrength) * damping
              colSV[y] = sv
              const s = col[y] + sv
              col[y] = s

              let targetOpacity = 50 + noiseValue * 205 + mouseInfluence * mouseOpacityBoost
              if (targetOpacity > 255) targetOpacity = 255
              colOT[y] = targetOpacity
              const opacityDiff = targetOpacity - colO[y]
              const ov = (colOV[y] + opacityDiff * springStrength) * damping
              colOV[y] = ov
              const o = colO[y] + ov
              colO[y] = o

              const drawSize = baseDraw * s
              const half = drawSize * 0.5
              const glyphIndex = (x + y) % glyphCount

              ctx.globalAlpha = o * (1 / 255)

              if (mouseInfluence > 0) {
                const angle = mouseAngle * mouseInfluence * mouseRotationStrength
                const c = Math.cos(angle) * pd
                const sn = Math.sin(angle) * pd
                ctx.setTransform(c, sn, -sn, c, xPos * pd, yPos * pd)
              } else {
                ctx.setTransform(pd, 0, 0, pd, xPos * pd, yPos * pd)
              }

              ctx.drawImage(glyphCanvases[glyphIndex], -half, -half, drawSize, drawSize)
            }
          }

          ctx.setTransform(pd, 0, 0, pd, 0, 0)
          ctx.globalAlpha = 1
        }
      }

      p5Instance = new P5Ctor(sketch, containerRef.current)
    })()

    return () => {
      cancelled = true
      p5Instance?.remove()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex h-screen w-screen items-center justify-center bg-black"
    />
  )
}
