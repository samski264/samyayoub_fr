export type Project = {
  label: string
  description: string
}

export default function ProjectEntry({ label, description }: Project) {
  return (
    <li className="group relative isolate flex cursor-pointer items-start">
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-[19px] top-1/2 -z-10 h-[54px] -translate-y-1/2 rounded-[9px] bg-[#d9d9d9] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      />
      <span className="w-[112px] shrink-0 pr-[14px] text-black">{label}</span>
      <span className="flex-1 text-[#afafaf]">{description}</span>
      <svg
        aria-hidden
        viewBox="0 0 19 11"
        className="ml-3 h-[11px] w-[19px] shrink-0 self-center text-black opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      >
        <path d="M0 5.5h18M13.5 1l5 4.5L13.5 10" />
      </svg>
    </li>
  )
}
