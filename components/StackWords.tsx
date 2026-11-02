'use client'

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'

const TOOLS = [
  {
    id: 'ai',
    label: 'ai',
    title: 'AI',
    stacks: [
      ['Cursor', 'Claude Code', 'Figma MCP'],
      ['Ollama', 'vector embeddings'],
    ],
  },
  {
    id: 'ts',
    label: 'ts',
    title: 'TypeScript',
    stacks: [
      ['Next.js', 'React', 'Node', 'Express'],
      ['Zod', 'MongoDB', 'Stripe'],
    ],
  },
  {
    id: 'figma',
    label: 'figma',
    title: 'Figma',
    stacks: [['Figma', 'Pen.dev', 'Adobe', 'C4D']],
  },
] as const

type ToolId = (typeof TOOLS)[number]['id']

const CARD_W = 280

type Box = { left: number; top: number; right: number; bottom: number }

type Point = { x: number; y: number; text: Box }

function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine
}

function overlaps(x: number, y: number, w: number, h: number, text: Box) {
  return x < text.right && x + w > text.left && y < text.bottom && y + h > text.top
}

function placeCard(el: HTMLElement, point: Point) {
  const pad = 16
  const gap = 12
  const w = el.offsetWidth || CARD_W
  const h = el.offsetHeight || 96
  const text = point.text
  const maxX = Math.max(pad, window.innerWidth - w - pad)
  const maxY = Math.max(pad, window.innerHeight - h - pad)
  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(min, v), max)

  let x = clamp(point.x - w / 2, pad, maxX)
  // Stay under the pointer, and never climb into the hovered word.
  let y = clamp(Math.max(point.y + gap, text.bottom + gap), pad, maxY)

  if (overlaps(x, y, w, h, text)) {
    const right = text.right + gap
    const left = text.left - gap - w
    if (right <= maxX) x = right
    else if (left >= pad) x = left
  }

  el.style.transform = `translate3d(${x}px, ${y}px, 0)`
}

function StackCard({
  tool,
  active,
  point,
}: {
  tool: (typeof TOOLS)[number] | undefined
  active: boolean
  point: RefObject<Point>
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [present, setPresent] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (active && tool) {
      setEntered(false)
      setPresent(true)
      return
    }
    setEntered(false)
    const t = window.setTimeout(() => setPresent(false), 200)
    return () => window.clearTimeout(t)
  }, [active, tool])

  useEffect(() => {
    if (!present || !active) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setEntered(true)
      return
    }
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntered(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [present, active, tool])

  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el || !present || !active) return
    placeCard(el, point.current)
  }, [present, active, tool, point])

  useEffect(() => {
    const el = frameRef.current
    if (!el || !present || !active) return
    const onMove = (e: MouseEvent) => {
      point.current.x = e.clientX
      point.current.y = e.clientY
      placeCard(el, point.current)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [present, active, point])

  if (!mounted || !present || !tool) return null

  return createPortal(
    <div
      ref={frameRef}
      id="stack-tool-card"
      role="tooltip"
      className="pointer-events-none fixed top-0 left-0 z-[70]"
      style={{ width: CARD_W }}
    >
      <div
        className="overflow-hidden rounded-[14px] px-[18px] py-[14px]"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.96)',
          transition: 'opacity 200ms ease, transform 200ms ease',
          background: 'rgba(255,255,255,0.74)',
          backdropFilter: 'url(#stack-glass) blur(4px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(8px) saturate(1.5)',
          boxShadow:
            'inset 1.5px 1.5px 0 rgba(255,255,255,0.55), inset 0 0 0 1px rgba(255,255,255,0.20), inset -1px -1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <svg aria-hidden className="absolute h-0 w-0">
          <defs>
            <filter id="stack-glass" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012"
                numOctaves="2"
                seed="17"
                result="noise"
              />
              <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="softNoise"
                scale="62"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        <ul className="font-normal text-[13px] leading-[1.55] tracking-[-0.26px] text-[#6a6a6a]">
          {tool.stacks.map((row) => (
            <li key={row.join('/')} className="flex items-center">
              {row.map((stack, index) => (
                <span key={stack} className="flex items-center whitespace-nowrap">
                  {index > 0 && (
                    <span aria-hidden className="px-[8px] text-[#b5b5b5]">
                      /
                    </span>
                  )}
                  <span>{stack}</span>
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  )
}

export default function StackWords() {
  const fine = useFinePointer()
  const [activeId, setActiveId] = useState<ToolId | null>(null)
  const point = useRef<Point>({
    x: 0,
    y: 0,
    text: { left: 0, top: 0, right: 0, bottom: 0 },
  })
  const leaveTimer = useRef(0)

  const pin = (el: HTMLElement, clientX: number, clientY: number) => {
    const r = el.getBoundingClientRect()
    point.current = {
      x: clientX,
      y: clientY,
      text: { left: r.left, top: r.top, right: r.right, bottom: r.bottom },
    }
  }

  const open = (id: ToolId, el: HTMLElement, clientX: number, clientY: number) => {
    window.clearTimeout(leaveTimer.current)
    pin(el, clientX, clientY)
    setActiveId(id)
  }

  const close = () => {
    window.clearTimeout(leaveTimer.current)
    leaveTimer.current = window.setTimeout(() => setActiveId(null), 90)
  }

  useEffect(() => () => window.clearTimeout(leaveTimer.current), [])

  const tool = TOOLS.find((item) => item.id === activeId)

  return (
    <span>
      {TOOLS.map((item, index) => (
        <span key={item.id}>
          {index > 0 && <span aria-hidden>, </span>}
          <button
            type="button"
            aria-label={item.title}
            aria-describedby={activeId === item.id ? 'stack-tool-card' : undefined}
            className={`inline cursor-pointer rounded-[6px] border-0 px-[4px] -mx-[4px] font-[inherit] text-[inherit] tracking-[inherit] decoration-from-font [text-underline-position:from-font] transition-[background-color,text-decoration-color] duration-150 ${
              activeId === item.id ? 'bg-[#ededed] underline' : 'bg-transparent no-underline'
            }`}
            onMouseEnter={(e) => {
              if (!fine) return
              open(item.id, e.currentTarget, e.clientX, e.clientY)
            }}
            onMouseLeave={() => {
              if (!fine) return
              close()
            }}
            onFocus={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              open(item.id, e.currentTarget, rect.left + rect.width / 2, rect.top + rect.height / 2)
            }}
            onBlur={close}
            onClick={(e) => {
              if (fine) return
              if (activeId === item.id) {
                setActiveId(null)
                return
              }
              open(item.id, e.currentTarget, e.clientX, e.clientY)
            }}
          >
            {item.label}
          </button>
        </span>
      ))}
      <StackCard tool={tool} active={Boolean(tool)} point={point} />
    </span>
  )
}
