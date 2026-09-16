'use client'

import { useEffect, useId, useRef } from 'react'
import * as P from './schemaFlowPaths'

type SchemaFlowProps = {
  className?: string
}

// Canvas — mirrors public/svg/diagram3.svg
const VB = { x: -67, y: -33.5, w: 804, h: 402 }
const GRID_STEP = 16.75
const LOGO_SRC = '/svg/diagram3-logo.png'

type Vec = [number, number]

type Arrow = {
  d: string
  from: Vec
  to: Vec
  gradient: { x1: number; y1: number; x2: number; y2: number; stops: [string, string] }
}

const ARROWS: Arrow[] = [
  {
    d: P.arrowDesignerToStandard,
    from: [134, 200.5],
    to: [268, 134.5],
    gradient: { x1: 268.221, y1: 134.949, x2: 134.221, y2: 200.949, stops: ['#B9C1F1', '#507CC0'] },
  },
  {
    d: P.arrowStandardToConsumer,
    from: [402, 134.5],
    to: [536, 200.5],
    gradient: { x1: 535.779, y1: 200.949, x2: 401.779, y2: 134.949, stops: ['#B9C1F1', '#507CC0'] },
  },
  {
    d: P.arrowConsumerToStandard,
    from: [536, 267.5],
    to: [402, 200.5],
    gradient: { x1: 402.224, y1: 200.053, x2: 536.224, y2: 267.053, stops: ['#50C059', '#CFF1B9'] },
  },
  {
    d: P.arrowStandardToDesigner,
    from: [268, 200.5],
    to: [134, 267.5],
    gradient: { x1: 133.776, y1: 267.053, x2: 267.776, y2: 200.053, stops: ['#50C059', '#CFF1B9'] },
  },
]

type Box = {
  key: string
  // shadow / blur region (foreignObject + filter bounds)
  fo: { x: number; y: number; w: number; h: number }
  // card
  rect: { x: number; y: number; w: number; h: number }
  // parallax amplitude in user units (x, y)
  drift: Vec
}

const BOXES: Box[] = [
  {
    key: 'designer',
    fo: { x: 12.503, y: 163.7, w: 135.6, h: 135.6 },
    rect: { x: 35.303, y: 186.5, w: 90, h: 90 },
    drift: [4, 3],
  },
  {
    key: 'standard',
    fo: { x: 251.495, y: 71.7, w: 166.305, h: 164.895 },
    rect: { x: 274.295, y: 94.5, w: 120.705, h: 119.295 },
    drift: [7, 5],
  },
  {
    key: 'consumer',
    fo: { x: 522.503, y: 163.7, w: 135.6, h: 135.6 },
    rect: { x: 545.303, y: 186.5, w: 90, h: 90 },
    drift: [4, 3],
  },
]

const gridX: number[] = []
const gridY: number[] = []
for (let k = -10; k < 60; k++) {
  const x = 0.25 + GRID_STEP * k
  if (x > VB.x && x < VB.x + VB.w) gridX.push(x)
  const y = -0.25 + GRID_STEP * k
  if (y > VB.y && y < VB.y + VB.h) gridY.push(y)
}

// Flow overlay stops a bit before the arrow head so dashes don't run over it.
const HEAD_GAP = 9
function shaftEnd([fx, fy]: Vec, [tx, ty]: Vec): Vec {
  const dx = tx - fx
  const dy = ty - fy
  const len = Math.hypot(dx, dy)
  return [tx - (dx / len) * HEAD_GAP, ty - (dy / len) * HEAD_GAP]
}

const clamp = (v: number) => Math.max(-1, Math.min(1, v))

export default function SchemaFlowAnimated({ className }: SchemaFlowProps) {
  const uid = useId().replace(/:/g, '')
  const svgRef = useRef<SVGSVGElement>(null)

  // Boxes gently follow the pointer (parallax). Uses CSS vars so no re-render.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let target: Vec = [0, 0]

    const apply = () => {
      raf = 0
      svg.style.setProperty('--sf-mx', target[0].toFixed(3))
      svg.style.setProperty('--sf-my', target[1].toFixed(3))
    }
    const onMove = (e: MouseEvent) => {
      const r = svg.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      target = [clamp((e.clientX - cx) / (r.width / 2)), clamp((e.clientY - cy) / (r.height / 2))]
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onLeave = () => {
      target = [0, 0]
      if (!raf) raf = requestAnimationFrame(apply)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const id = (s: string) => `sf-${uid}-${s}`

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
        width={VB.w}
        height={VB.h}
        fill="none"
        role="img"
        aria-label="Flow diagram: Designer uploads CAD to standard+, standard+ delivers Object to Consumer, Consumer pays standard+, standard+ sends Royalties to Designer."
        className="mx-auto block h-auto w-full max-w-[1080px] select-none"
        style={{ ['--sf-mx' as string]: 0, ['--sf-my' as string]: 0 }}
      >
        <defs>
          {BOXES.map((b, i) => (
            <filter
              key={b.key}
              id={id(`shadow-${i}`)}
              x={b.fo.x}
              y={b.fo.y}
              width={b.fo.w}
              height={b.fo.h}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feMorphology radius="8" operator="dilate" in="SourceAlpha" result="shadow" />
              <feOffset />
              <feGaussianBlur stdDeviation="7.4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="shadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="shadow" result="shape" />
            </filter>
          ))}
          {BOXES.map((b, i) => (
            <clipPath key={b.key} id={id(`clip-${i}`)} transform={`translate(${-b.fo.x} ${-b.fo.y})`}>
              <rect x={b.rect.x} y={b.rect.y} width={b.rect.w} height={b.rect.h} rx="10" />
            </clipPath>
          ))}
          {ARROWS.map((a, i) => (
            <linearGradient
              key={i}
              id={id(`arrow-${i}`)}
              x1={a.gradient.x1}
              y1={a.gradient.y1}
              x2={a.gradient.x2}
              y2={a.gradient.y2}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={a.gradient.stops[0]} />
              <stop offset="1" stopColor={a.gradient.stops[1]} />
            </linearGradient>
          ))}
        </defs>

        {/* Grid */}
        <g stroke="#EDEDED" strokeWidth="0.5">
          {gridX.map((x) => (
            <line key={`x${x}`} x1={x} y1={VB.y} x2={x} y2={VB.y + VB.h} />
          ))}
          {gridY.map((y) => (
            <line key={`y${y}`} x1={VB.x} y1={y} x2={VB.x + VB.w} y2={y} />
          ))}
        </g>

        {/* Arrows + flow */}
        {ARROWS.map((a, i) => {
          const end = shaftEnd(a.from, a.to)
          return (
            <g key={i}>
              <path d={a.d} fill={`url(#${id(`arrow-${i}`)})`} />
              <line
                x1={a.from[0]}
                y1={a.from[1]}
                x2={end[0]}
                y2={end[1]}
                stroke="#FFFFFF"
                strokeOpacity="0.6"
                strokeWidth="0.9"
                strokeLinecap="round"
                strokeDasharray="4 20"
                className="animate-[schema-flow-dash_1.8s_linear_infinite] motion-reduce:animate-none"
                style={{ animationDelay: `${i * -0.45}s` }}
              />
            </g>
          )
        })}

        {/* Boxes (parallax) */}
        {BOXES.map((b, i) => (
          <g
            key={b.key}
            style={{
              transform: `translate(calc(var(--sf-mx) * ${b.drift[0]}px), calc(var(--sf-my) * ${b.drift[1]}px))`,
              transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)',
              willChange: 'transform',
            }}
          >
            <foreignObject x={b.fo.x} y={b.fo.y} width={b.fo.w} height={b.fo.h}>
              <div
                style={{
                  backdropFilter: 'blur(2.75px)',
                  WebkitBackdropFilter: 'blur(2.75px)',
                  clipPath: `url(#${id(`clip-${i}`)})`,
                  height: '100%',
                  width: '100%',
                }}
              />
            </foreignObject>
            <g filter={`url(#${id(`shadow-${i}`)})`}>
              <rect x={b.rect.x} y={b.rect.y} width={b.rect.w} height={b.rect.h} rx="10" fill="#FAFAFA" />
            </g>
            {b.key === 'designer' && <path d={P.labelDesigner} fill="black" />}
            {b.key === 'consumer' && <path d={P.labelConsumer} fill="black" />}
            {b.key === 'standard' && (
              <image
                href={LOGO_SRC}
                x="297"
                y="144.5"
                width="76"
                height="21"
                preserveAspectRatio="none"
              />
            )}
          </g>
        ))}

        {/* Arrow labels */}
        <path d={P.labelCad} fill="black" />
        <path d={P.labelObject} fill="black" />
        <path d={P.labelPays} fill="black" />
        <path d={P.labelRoyalties} fill="black" />
      </svg>
    </div>
  )
}
