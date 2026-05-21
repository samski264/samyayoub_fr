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
        className="pointer-events-none absolute -top-[6px] -bottom-[8px] -left-[10px] -right-[35px] -z-10 rounded-[9px] bg-[#ededed] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      />
      <span className="w-[112px] shrink-0 pr-[14px] font-normal text-black">
        {label}
      </span>
      <span className="flex-1 font-normal text-[#afafaf]">{description}</span>
      <svg
        aria-hidden
        viewBox="0 0 19 11"
        className="ml-3 h-[11px] w-[19px] shrink-0 self-center text-black opacity-0 -translate-x-1 transition-[opacity,translate] duration-150 ease-out group-hover:opacity-100 group-hover:translate-x-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      >
        <path d="M0 5.5h18M13.5 1l5 4.5L13.5 10" />
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
      <li className="group relative isolate flex h-[51px] items-center">
        {children}
      </li>
    )
  }

  return (
    <li className="group relative isolate h-[51px]">
      <Link href={href} className="relative flex h-full cursor-pointer items-center">
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
