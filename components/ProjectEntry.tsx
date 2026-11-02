'use client'

import Link from 'next/link'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'

export type Project = {
  label: string
  description: string
  href?: string
  /** Still or short clip shown in the hover window. */
  image?: string
}

const PREVIEW_W = 340

type Point = { x: number; y: number; left: number; right: number }

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

function placePreview(el: HTMLElement, point: Point) {
  const pad = 16
  /** Clear space between the project hover frame and the image or video. */
  const gap = 24
  const w = PREVIEW_W
  const h = el.offsetHeight || 210
  const mid = (point.left + point.right) / 2
  // Left of the row stays on the left. Never shove it back to the right
  // when the gutter is narrower than the preview.
  const openLeft = point.x < mid
  const x = openLeft ? point.left - gap - w : point.right + gap

  let y = point.y - h * 0.45
  y = Math.min(Math.max(pad, y), window.innerHeight - h - pad)
  el.style.transform = `translate3d(${x}px, ${y}px, 0)`
}

function isVideo(src: string) {
  return /\.(mp4|webm)(\?|$)/i.test(src)
}

/** Cover art whose wordmark sits on the bottom edge; crop it out of the window. */
function hidesBakedInType(src: string) {
  return src.includes('/std/cover')
}

function ProjectHoverPreview({
  image,
  active,
  point,
}: {
  image: string
  active: boolean
  point: RefObject<Point>
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [present, setPresent] = useState(false)
  const [ready, setReady] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (active) {
      setEntered(false)
      setPresent(true)
      return
    }
    setEntered(false)
    const t = window.setTimeout(() => setPresent(false), 220)
    return () => window.clearTimeout(t)
  }, [active])

  useEffect(() => {
    if (!present || !active || !ready) return
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
  }, [present, active, ready])

  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el || !present || !active) return
    placePreview(el, point.current)
  }, [present, active, point])

  useEffect(() => {
    const el = frameRef.current
    if (!el || !present || !active) return

    const cursor = { ...point.current }
    const onMove = (e: globalThis.MouseEvent) => {
      cursor.x = e.clientX
      cursor.y = e.clientY
      placePreview(el, cursor)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [present, active, point])

  if (!mounted || !present) return null

  return createPortal(
    <div
      ref={frameRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[70]"
      style={{ width: PREVIEW_W }}
    >
      <div
        className="overflow-hidden rounded-[14px]"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.96)',
          transition: 'opacity 200ms ease, transform 200ms ease',
        }}
      >
      <div className="relative h-[210px] w-full overflow-hidden bg-[#f0f0f0]">
        {isVideo(image) ? (
          <video
            src={image}
            muted
            autoPlay
            loop
            playsInline
            onLoadedData={() => setReady(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={image}
            alt=""
            onLoad={() => setReady(true)}
            onError={() => setReady(true)}
            className={
              hidesBakedInType(image)
                ? 'h-full w-full origin-top scale-[1.28] object-cover'
                : 'h-full w-full object-cover'
            }
          />
        )}
      </div>
      </div>
    </div>,
    document.body,
  )
}

function EntryInner({ label, description }: Pick<Project, 'label' | 'description'>) {
  return (
    <>
      {/*
       * Hover background. On mobile the entry is a stacked column, so the grey
       * box bleeds around the taller content (Figma node 246:4083); on lg+ it
       * keeps the original single-row insets (node 206:xxxx).
       */}
      <span
        aria-hidden
        data-project-frame
        className="pointer-events-none absolute -top-[11px] -bottom-[10px] -left-[15px] -right-[17px] -z-10 origin-center scale-97 rounded-[9px] bg-[#ededed] opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:scale-100 group-hover:opacity-100 lg:bottom-[3px] lg:-right-[18px]"
      />
      <span className="w-full font-normal text-black lg:w-[204px] lg:shrink-0 lg:pr-[52px]">
        {label}
      </span>
      <span className="w-full font-normal text-[#afafaf] underline decoration-from-font [text-underline-position:from-font] group-hover:no-underline lg:flex-1 lg:pr-[49px]">
        {description}
      </span>
      <svg
        aria-hidden
        viewBox="0 0 22 11"
        className="absolute right-0 top-[14px] hidden h-[11px] w-[22px] text-black opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 lg:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      >
        <path d="M0 5.5h21M16 1l5 4.5L16 10" />
      </svg>
    </>
  )
}

function Wrapper({
  href,
  image,
  children,
}: {
  href?: string
  image?: string
  children: ReactNode
}) {
  const fine = useFinePointer()
  const [active, setActive] = useState(false)
  const point = useRef<Point>({ x: 0, y: 0, left: 0, right: 0 })
  const showPreview = Boolean(image) && fine

  const hover = showPreview
    ? {
        onMouseEnter: (e: React.MouseEvent<HTMLLIElement>) => {
          const row = e.currentTarget.getBoundingClientRect()
          const frame = e.currentTarget.querySelector('[data-project-frame]')
          const bounds = frame?.getBoundingClientRect() ?? row
          point.current = {
            x: e.clientX,
            y: e.clientY,
            left: bounds.left,
            right: bounds.right,
          }
          setActive(true)
        },
        onMouseLeave: () => setActive(false),
      }
    : {}

  const row = href ? (
    <li className="group relative isolate lg:min-h-[51px]" {...hover}>
      <Link
        href={href}
        className="relative flex flex-col gap-[5px] cursor-pointer lg:min-h-[51px] lg:flex-row lg:items-start lg:gap-0"
      >
        {children}
      </Link>
      {showPreview && image && (
        <ProjectHoverPreview image={image} active={active} point={point} />
      )}
    </li>
  ) : (
    <li
      className="group relative isolate flex flex-col gap-[5px] cursor-pointer lg:min-h-[51px] lg:flex-row lg:items-start lg:gap-0"
      {...hover}
    >
      {children}
    </li>
  )

  return row
}

export default function ProjectEntry({ label, description, href, image }: Project) {
  return (
    <Wrapper href={href} image={image}>
      <EntryInner label={label} description={description} />
    </Wrapper>
  )
}
