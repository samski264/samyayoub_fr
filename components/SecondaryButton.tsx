'use client'

import Link from 'next/link'
import { useState, type CSSProperties, type ReactNode } from 'react'

type SecondaryButtonProps = {
  children: ReactNode
  href?: string
  className?: string
}

const hoverGradient = 'linear-gradient(to right, #ececec, #e0e0e0)'

const BASE_CLASS =
  'relative inline-flex h-[34px] w-[154px] cursor-pointer items-center justify-center overflow-hidden rounded-[10px] font-normal text-[12px] leading-none tracking-[-0.6px]'

function ButtonSurface({
  href,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  href?: string
  className: string
  style: CSSProperties
  onMouseEnter: () => void
  onMouseLeave: () => void
  children: ReactNode
}) {
  if (!href) {
    return (
      <button
        type="button"
        className={className}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </button>
    )
  }

  if (/^https?:\/\//.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  )
}

export default function SecondaryButton({
  children,
  href,
  className = '',
}: SecondaryButtonProps) {
  const [hovered, setHovered] = useState(false)

  const classes = [BASE_CLASS, hovered ? 'text-[#6a6a6a]' : 'text-[#323232]', className]
    .filter(Boolean)
    .join(' ')

  const style: CSSProperties = {
    background: hovered ? hoverGradient : 'transparent',
    transition: 'background 220ms ease, color 220ms ease',
  }

  return (
    <ButtonSurface
      href={href}
      className={classes}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </ButtonSurface>
  )
}
