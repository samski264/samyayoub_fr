import Link from 'next/link'
import type { ReactNode } from 'react'

export type Project = {
  label: string
  description: string
  href?: string
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
  children,
}: {
  href?: string
  children: ReactNode
}) {
  if (!href) {
    return (
      <li className="group relative isolate flex flex-col gap-[5px] cursor-pointer lg:h-[51px] lg:flex-row lg:items-start lg:gap-0">
        {children}
      </li>
    )
  }

  return (
    <li className="group relative isolate lg:h-[51px]">
      <Link
        href={href}
        className="relative flex flex-col gap-[5px] cursor-pointer lg:h-full lg:flex-row lg:items-start lg:gap-0"
      >
        {children}
      </Link>
    </li>
  )
}

export default function ProjectEntry({ label, description, href }: Project) {
  return (
    <Wrapper href={href}>
      <EntryInner label={label} description={description} />
    </Wrapper>
  )
}
