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
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[11px] bottom-[3px] -left-[15px] -right-[18px] -z-10 origin-center scale-97 rounded-[9px] bg-[#ededed] opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:scale-100 group-hover:opacity-100"
      />
      <span className="w-[204px] shrink-0 pr-[52px] font-normal text-black">
        {label}
      </span>
      <span className="flex-1 pr-[49px] font-normal text-[#afafaf] underline decoration-from-font [text-underline-position:from-font] group-hover:no-underline">
        {description}
      </span>
      <svg
        aria-hidden
        viewBox="0 0 22 11"
        className="absolute right-0 top-[14px] h-[11px] w-[22px] text-black opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100"
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
      <li className="group relative isolate flex h-[51px] cursor-pointer items-start">
        {children}
      </li>
    )
  }

  return (
    <li className="group relative isolate h-[51px]">
      <Link href={href} className="relative flex h-full cursor-pointer items-start">
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
