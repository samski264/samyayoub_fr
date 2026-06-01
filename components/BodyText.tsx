import { ReactNode, type CSSProperties } from 'react'

interface BodyTextProps {
  label: string
  children: ReactNode
  paddingTop?: number
  paddingBottom?: number
}

/*
 * BodyText — label + content block. Matches Figma node 245:3902 (mobile) and
 * the desktop two-column layout.
 *
 * Mobile (< lg): single column, full width, label stacked above content,
 * 10px side padding (Figma mobile rule).
 * Desktop (>= lg): the original two-column layout (label 187px + content 587px,
 * 118px gutter, fixed 892px width). Desktop vertical padding is driven by the
 * paddingTop/paddingBottom props via CSS variables so it stays configurable.
 */

export default function BodyText({
  label,
  children,
  paddingTop = 150,
  paddingBottom = 50,
}: BodyTextProps) {
  return (
    <div
      className="mx-auto flex flex-col gap-[45px] w-full px-[10px] pt-[80px] pb-[40px] text-[16px] tracking-[-0.32px] text-justify text-black [word-break:break-word] lg:flex-row lg:items-center lg:gap-[118px] lg:w-[892px] lg:min-w-[305px] lg:px-0 lg:pt-[var(--bt-pt)] lg:pb-[var(--bt-pb)]"
      style={
        {
          '--bt-pt': `${paddingTop}px`,
          '--bt-pb': `${paddingBottom}px`,
        } as CSSProperties
      }
    >
      <p className="font-semibold leading-[1.3] lg:w-[187px] lg:shrink-0 lg:self-stretch">
        {label}
      </p>
      <div className="w-full font-normal leading-[1.3] lg:w-[587px] lg:shrink-0 lg:self-stretch">
        {children}
      </div>
    </div>
  )
}
