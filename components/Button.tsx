'use client'

import Link from 'next/link'
import {
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = {
  children: ReactNode
  href?: string
  variant?: ButtonVariant
  className?: string
}

const TOKENS = {
  colors: {
    gray100: '#ececec',
    gray200: '#e0e0e0',
    grayBlue: '#d1d7e2',
  },
  textInnerShadow: { blur: 0.3, color: '#000000', offsetX: 0, offsetY: 0 },
} as const

const VARIANT_CONFIG = {
  primary: {
    defaultTextClass: 'text-[#323232]',
    hoverTextClass: 'text-[#6a6a6a]',
    borderClass: '',
    textInnerShadowOnHover: true,
    defaultGradient: `linear-gradient(to right, ${TOKENS.colors.gray100}, ${TOKENS.colors.gray200})`,
    hoverGradient: `linear-gradient(to right, ${TOKENS.colors.gray100}, ${TOKENS.colors.grayBlue})`,
  },
  secondary: {
    defaultTextClass: 'text-[#323232]',
    hoverTextClass: 'text-[#323232]',
    borderClass: '',
    textInnerShadowOnHover: false,
    hoverGradient: `linear-gradient(to right, ${TOKENS.colors.gray100}, ${TOKENS.colors.gray200})`,
    defaultGradient: `linear-gradient(to right, ${TOKENS.colors.gray100}, ${TOKENS.colors.gray200})`,
  },
} as const satisfies Record<
  ButtonVariant,
  {
    defaultTextClass: string
    hoverTextClass: string
    borderClass: string
    textInnerShadowOnHover: boolean
    hoverGradient: string
    defaultGradient: string
  }
>

const BASE_CLASS =
  'relative inline-flex h-[34px] w-[154px] cursor-pointer items-center justify-center overflow-hidden rounded-[10px] font-normal text-[12px] leading-none tracking-[-0.6px]'

function TextInnerShadowFilter({ id }: { id: string }) {
  const { blur, color, offsetX, offsetY } = TOKENS.textInnerShadow

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        <filter
          id={id}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation={blur} result="blur" />
          <feOffset in="blur" dx={offsetX} dy={offsetY} result="offsetBlur" />
          <feComposite
            in="SourceGraphic"
            in2="offsetBlur"
            operator="out"
            result="inverse"
          />
          <feFlood floodColor={color} floodOpacity="1" result="color" />
          <feComposite in="color" in2="inverse" operator="in" result="shadow" />
          <feComposite in="SourceGraphic" in2="shadow" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

function ButtonLabel({
  variant,
  hovered,
  children,
}: {
  variant: ButtonVariant
  hovered: boolean
  children: ReactNode
}) {
  const filterId = useId().replace(/:/g, '')
  const showInnerShadow =
    VARIANT_CONFIG[variant].textInnerShadowOnHover && hovered

  return (
    <>
      {showInnerShadow ? <TextInnerShadowFilter id={filterId} /> : null}
      <span
        className="relative"
        style={
          showInnerShadow ? { filter: `url(#${filterId})` } : undefined
        }
      >
        {children}
      </span>
    </>
  )
}

type ButtonSurfaceProps = {
  className: string
  style: CSSProperties
  onMouseEnter: () => void
  onMouseLeave: () => void
  children: ReactNode
}

function ButtonSurface({
  href,
  ...props
}: ButtonSurfaceProps & { href?: string }) {
  if (!href) {
    return <button type="button" {...props} />
  }

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    )
  }

  return <Link href={href} {...props} />
}

export default function Button({
  children,
  href,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const [hovered, setHovered] = useState(false)
  const { defaultTextClass, hoverTextClass, borderClass, defaultGradient, hoverGradient } =
    VARIANT_CONFIG[variant]
  const textClass = hovered ? hoverTextClass : defaultTextClass
  const border = borderClass && hovered ? 'shadow-none' : borderClass
  const classes = [BASE_CLASS, textClass, border, className].filter(Boolean).join(' ')
  const style: CSSProperties = {
    background: defaultGradient,
    transition: 'box-shadow 220ms ease',
  }

  return (
    <ButtonSurface
      href={href}
      className={classes}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[10px]"
        style={{
          background: hoverGradient,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
      />
      <ButtonLabel variant={variant} hovered={hovered}>
        {children}
      </ButtonLabel>
    </ButtonSurface>
  )
}
