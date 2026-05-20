import Link from 'next/link'
import type { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  href?: string
  className?: string
}

const BASE_CLASSES =
  'group relative inline-flex h-[34px] w-[154px] items-center justify-center overflow-hidden rounded-[10px] border-[0.5px] border-[#afafaf] bg-gradient-to-r from-[#ececec] to-[#e0e0e0] font-normal text-[12px] leading-none tracking-[-0.6px] text-black transition-transform duration-150 hover:-translate-y-[1px]'

function Inner({ children }: { children: ReactNode }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 isolate"
      >
        <span
          className="absolute left-[18%] top-1/2 h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 scale-50 rounded-full bg-[#cad9dc] opacity-0 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.6] group-hover:opacity-100"
          style={{ filter: 'blur(18px)', mixBlendMode: 'multiply' }}
        />
        <span
          className="absolute left-[82%] top-1/2 h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 scale-50 rounded-full bg-[#507cc0] opacity-0 transition-all duration-[1100ms] delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.6] group-hover:opacity-100"
          style={{ filter: 'blur(18px)', mixBlendMode: 'multiply' }}
        />
        <span
          className="absolute left-1/2 top-1/2 h-[28px] w-[110px] -translate-x-1/2 -translate-y-1/2 scale-50 rounded-full bg-[#a8bfde] opacity-0 transition-all duration-[1200ms] delay-150 ease-out group-hover:scale-100 group-hover:opacity-90"
          style={{ filter: 'blur(12px)', mixBlendMode: 'soft-light' }}
        />
      </span>
      <span className="relative">{children}</span>
    </>
  )
}

export default function Button({ children, href, className = '' }: ButtonProps) {
  const classes = `${BASE_CLASSES} ${className}`.trim()

  if (!href) {
    return (
      <button type="button" className={classes}>
        <Inner>{children}</Inner>
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
      >
        <Inner>{children}</Inner>
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      <Inner>{children}</Inner>
    </Link>
  )
}
