'use client'

import Link from 'next/link'
import {
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react'

type ButtonProps = {
  children: ReactNode
  href?: string
  className?: string
}

const BASE_CLASSES =
  'group relative inline-flex h-[34px] w-[154px] cursor-pointer items-center justify-center overflow-hidden rounded-[10px] border-[0.5px] border-[#afafaf] bg-gradient-to-r from-[#ececec] to-[#e0e0e0] font-normal text-[12px] leading-none tracking-[-0.6px] text-black'

const ENTER_DELAY_MS = 80
const TRANSITION_MS = 220

type Point = { x: number; y: number }
type Phase = 'pop' | 'settled' | 'leaving'
type State = { origin: Point; phase: Phase } | null

function Inner({
  children,
  state,
}: {
  children: ReactNode
  state: State
}) {
  const animateOrigin = state !== null && state.phase !== 'pop'
  const x = state?.origin.x ?? 0
  const y = state?.origin.y ?? 0
  const opacity = state && state.phase !== 'leaving' ? 1 : 0

  const style: CSSProperties = {
    ['--rx' as string]: `${x}px`,
    ['--ry' as string]: `${y}px`,
    background:
      'radial-gradient(circle at var(--rx) var(--ry), #507cc0 0%, #8aa6cf 35%, #cad9dc 65%, rgba(202, 217, 220, 0) 100%)',
    mixBlendMode: 'multiply',
    opacity,
    transition: animateOrigin
      ? `--rx ${TRANSITION_MS}ms ease-out, --ry ${TRANSITION_MS}ms ease-out, opacity ${TRANSITION_MS}ms ease-out`
      : `opacity ${TRANSITION_MS}ms ease-out`,
  }

  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={style}
      />
      <span className="relative">{children}</span>
    </>
  )
}

function useHoverEffect() {
  const [state, setState] = useState<State>(null)
  const mouseRef = useRef<Point>({ x: 0, y: 0 })
  const sizeRef = useRef<{ width: number; height: number }>({
    width: 154,
    height: 34,
  })
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)

  const trackPointer = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    sizeRef.current = { width: rect.width, height: rect.height }
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const clearTimers = () => {
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current)
      enterTimerRef.current = null
    }
    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current)
      cleanupTimerRef.current = null
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const onMouseEnter = (e: MouseEvent<HTMLElement>) => {
    clearTimers()
    trackPointer(e)
    enterTimerRef.current = setTimeout(() => {
      setState({ origin: { ...mouseRef.current }, phase: 'pop' })
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const center = {
          x: sizeRef.current.width / 2,
          y: sizeRef.current.height / 2,
        }
        setState((prev) =>
          prev && prev.phase === 'pop'
            ? { origin: center, phase: 'settled' }
            : prev,
        )
      })
    }, ENTER_DELAY_MS)
  }

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    trackPointer(e)
  }

  const onMouseLeave = (e: MouseEvent<HTMLElement>) => {
    clearTimers()
    trackPointer(e)
    const exit = { ...mouseRef.current }

    setState((prev) => (prev ? { origin: exit, phase: 'leaving' } : null))

    cleanupTimerRef.current = setTimeout(() => {
      setState(null)
    }, TRANSITION_MS)
  }

  return { state, onMouseEnter, onMouseMove, onMouseLeave }
}

export default function Button({ children, href, className = '' }: ButtonProps) {
  const classes = `${BASE_CLASSES} ${className}`.trim()
  const { state, onMouseEnter, onMouseMove, onMouseLeave } = useHoverEffect()
  const handlers = { onMouseEnter, onMouseMove, onMouseLeave }

  if (!href) {
    return (
      <button type="button" className={classes} {...handlers}>
        <Inner state={state}>{children}</Inner>
      </button>
    )
  }

  const isExternal = /^https?:\/\//.test(href)
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...handlers}
      >
        <Inner state={state}>{children}</Inner>
      </a>
    )
  }

  return (
    <Link href={href} className={classes} {...handlers}>
      <Inner state={state}>{children}</Inner>
    </Link>
  )
}
