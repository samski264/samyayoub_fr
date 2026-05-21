'use client'

import Link from 'next/link'
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react'

type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = {
  children: ReactNode
  href?: string
  variant?: ButtonVariant
  className?: string
}

type Point = { x: number; y: number }
type HoverPhase = 'pop' | 'settled' | 'leaving'
type HoverState = { origin: Point; phase: HoverPhase }

const TOKENS = {
  motion: { enterDelayMs: 80, transitionMs: 220 },
  colors: {
    gray100: '#ececec',
    gray200: '#e0e0e0',
    grayBlue: '#d1d7e2',
  },
  textInnerShadow: { blur: 0.3, color: '#000000', offsetX: 0, offsetY: 0 },
} as const

const VARIANT_CONFIG = {
  primary: {
    textClass: 'text-[#6a6a6a]',
    borderClass: '',
    textInnerShadowOnHover: true,
    settledGradient: `linear-gradient(to right, ${TOKENS.colors.gray100}, ${TOKENS.colors.grayBlue})`,
    radialAccent: TOKENS.colors.grayBlue,
  },
  secondary: {
    textClass: 'text-black',
    borderClass: 'shadow-[inset_0_0_0_0.2px_#afafaf]',
    textInnerShadowOnHover: false,
    settledGradient: `linear-gradient(to right, ${TOKENS.colors.gray100}, ${TOKENS.colors.gray200})`,
    radialAccent: TOKENS.colors.gray200,
  },
} as const

const BASE_CLASS =
  'relative inline-flex h-[34px] w-[154px] cursor-pointer items-center justify-center overflow-hidden rounded-[10px] bg-gradient-to-r from-[#ececec] to-[#e0e0e0] font-normal text-[12px] leading-none tracking-[-0.6px]'

function isActiveHover(state: HoverState | null): state is HoverState {
  return state !== null && state.phase !== 'leaving'
}

function hoverOverlayBackground(
  variant: ButtonVariant,
  phase: HoverPhase,
  origin: Point,
): string {
  const { settledGradient, radialAccent } = VARIANT_CONFIG[variant]
  if (phase === 'settled') return settledGradient
  const { x, y } = origin
  return `radial-gradient(circle at ${x}px ${y}px, ${radialAccent} 0%, ${TOKENS.colors.gray100} 45%, transparent 100%)`
}

function TextInnerShadowFilter({ id }: { id: string }) {
  const { blur, color, offsetX, offsetY } = TOKENS.textInnerShadow
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden">
      <defs>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation={blur} result="blur" />
          <feOffset in="blur" dx={offsetX} dy={offsetY} result="offsetBlur" />
          <feComposite in="SourceGraphic" in2="offsetBlur" operator="out" result="inverse" />
          <feFlood floodColor={color} floodOpacity="1" result="color" />
          <feComposite in="color" in2="inverse" operator="in" result="shadow" />
          <feComposite in="SourceGraphic" in2="shadow" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

function HoverOverlay({ variant, state }: { variant: ButtonVariant; state: HoverState | null }) {
  if (!state) return null
  const { origin, phase } = state
  const style: CSSProperties = {
    background: hoverOverlayBackground(variant, phase, origin),
    mixBlendMode: variant === 'primary' && phase !== 'settled' ? 'multiply' : undefined,
    opacity: phase === 'leaving' ? 0 : 1,
    transition: `opacity ${TOKENS.motion.transitionMs}ms ease-out, background ${TOKENS.motion.transitionMs}ms ease-out`,
  }
  return <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[10px]" style={style} />
}

function useHoverEffect() {
  const [state, setState] = useState<HoverState | null>(null)
  const pointerRef = useRef<Point>({ x: 0, y: 0 })
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = () => {
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current)
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
    enterTimerRef.current = null
    leaveTimerRef.current = null
  }

  const trackPointer = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onMouseEnter = (e: MouseEvent<HTMLElement>) => {
    clearTimers()
    trackPointer(e)
    enterTimerRef.current = setTimeout(() => {
      setState({ origin: { ...pointerRef.current }, phase: 'pop' })
    }, TOKENS.motion.enterDelayMs)
  }

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    trackPointer(e)
    setState((prev) => (prev && prev.phase !== 'leaving' ? { origin: { ...pointerRef.current }, phase: 'pop' } : prev))
  }

  const onMouseLeave = (e: MouseEvent<HTMLElement>) => {
    clearTimers()
    trackPointer(e)
    setState((prev) => (prev ? { origin: { ...pointerRef.current }, phase: 'leaving' } : null))
    leaveTimerRef.current = setTimeout(() => setState(null), TOKENS.motion.transitionMs)
  }

  return { state, onMouseEnter, onMouseMove, onMouseLeave }
}

export default function ButtonMoving({
  children,
  href,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const { state, onMouseEnter, onMouseMove, onMouseLeave } = useHoverEffect()
  const hovered = isActiveHover(state)
  const filterId = useId().replace(/:/g, '')
  const showInnerShadow = VARIANT_CONFIG[variant].textInnerShadowOnHover && hovered
  const border = VARIANT_CONFIG[variant].borderClass && hovered ? 'shadow-none' : VARIANT_CONFIG[variant].borderClass
  const classes = [BASE_CLASS, VARIANT_CONFIG[variant].textClass, border, className].filter(Boolean).join(' ')

  const content = (
    <>
      <HoverOverlay variant={variant} state={state} />
      {showInnerShadow ? <TextInnerShadowFilter id={filterId} /> : null}
      <span className="relative" style={showInnerShadow ? { filter: `url(#${filterId})` } : undefined}>
        {children}
      </span>
    </>
  )

  if (!href) return <button type="button" className={classes} onMouseEnter={onMouseEnter} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>{content}</button>
  if (/^https?:\/\//.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onMouseEnter={onMouseEnter} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>{content}</a>
  return <Link href={href} className={classes} onMouseEnter={onMouseEnter} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>{content}</Link>
}
