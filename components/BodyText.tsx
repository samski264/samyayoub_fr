import { ReactNode } from 'react'

interface BodyTextProps {
  label: string
  children: ReactNode
  paddingTop?: number
  paddingBottom?: number
}

export default function BodyText({
  label,
  children,
  paddingTop = 150,
  paddingBottom = 50,
}: BodyTextProps) {
  return (
    <div
      className="mx-auto flex items-center gap-[118px] w-[892px] min-w-[305px] text-[16px] tracking-[-0.32px] text-justify text-black [word-break:break-word]"
      style={{ paddingTop, paddingBottom }}
    >
      <p className="w-[187px] shrink-0 self-stretch font-semibold leading-[1.3]">
        {label}
      </p>
      <div className="w-[587px] shrink-0 self-stretch font-normal leading-[1.3]">
        {children}
      </div>
    </div>
  )
}
