import type { CSSProperties, ReactNode } from 'react'
import Button from '@/components/Button'
import SecondaryButton from '@/components/SecondaryButton'

/*
 * ProjectHeader — glassmorphic card used as the heading block on each
 * project page. Matches Figma node 144:1015 ("ProjectEncart").
 *
 * Layout: flex column with auto height. The card grows with its content,
 * so long titles or long descriptions never overlap. Internal spacing follows
 * Figma exactly: padding 40px / 24px, gap 23px between sections.
 *
 * Variant is implicit: when primaryButton or secondaryButton is provided, the
 * buttons row is rendered below the description with the same 23px gap.
 */

type ProjectHeaderButton = {
  label: ReactNode
  href?: string
}

type ProjectHeaderProps = {
  title: ReactNode
  badge: ReactNode
  description: ReactNode
  primaryButton?: ProjectHeaderButton
  secondaryButton?: ProjectHeaderButton
  titleColor?: string
  className?: string
  style?: CSSProperties
}

export default function ProjectHeader({
  title,
  badge,
  description,
  primaryButton,
  secondaryButton,
  titleColor = '#2da4ff',
  className = '',
  style,
}: ProjectHeaderProps) {
  const hasButtons = Boolean(primaryButton || secondaryButton)

  return (
    <>
      {/*
       * SVG displacement filter — reproduces Figma's "GLASS" effect on node 144:1004
       * (type: GLASS, radius: 4, refraction: 1, depth: 62, lightAngle: 307°, lightIntensity: 0.8).
       * The real visual signature of Figma's GLASS is not blur — it's REFRACTION:
       * pixels behind the surface are displaced as if light is bending through thick glass.
       * The only CSS equivalent is `backdrop-filter: url(#svgFilter)` with feDisplacementMap.
       *   - feTurbulence → procedural noise = the glass micro-roughness
       *   - feDisplacementMap scale="62" ↔ Figma's `depth: 62`
       *   - feGaussianBlur stdDeviation="4" inside the chain ↔ Figma's `radius: 4`
       */}
      <svg
        aria-hidden
        style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
      >
        <defs>
          <filter id="ph-glass" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="2"
              seed="17"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale="62"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div
        className={`relative flex w-full flex-col items-start gap-[23px] overflow-hidden rounded-[14px] bg-[rgba(255,255,255,0.74)] px-[40px] py-[24px] lg:w-[434px] ${className}`}
        style={{
          backdropFilter: 'url(#ph-glass) blur(4px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(8px) saturate(1.5)',
          // Inset only — these are surface reflections from Figma's lightAngle 307°
          // (top-left), not drop shadow. Pure glass-surface highlights.
          boxShadow:
            'inset 1.5px 1.5px 0 rgba(255,255,255,0.55), inset 0 0 0 1px rgba(255,255,255,0.20), inset -1px -1px 0 rgba(255,255,255,0.06)',
          ...style,
        }}
      >
        <div className="flex w-full items-center gap-[15px]">
          <h1
            className="min-w-0 flex-1 font-light text-[33px] leading-[normal] tracking-[-2.64px] break-words"
            style={{ color: titleColor }}
          >
            {title}
          </h1>

          <span className="inline-flex h-[26px] w-[87px] shrink-0 items-center justify-center rounded-[43px] border border-[#e0e0e0] font-normal text-[8px] leading-none tracking-[-0.48px] text-black">
            {badge}
          </span>
        </div>

        <div className="w-full font-normal text-[16px] leading-[1.3] tracking-[-0.32px] text-justify text-[#afafaf] break-words">
          {description}
        </div>

        {hasButtons && (
          <div className="flex w-full items-center gap-[23px]">
            {primaryButton && (
              <Button variant="primary" href={primaryButton.href}>
                {primaryButton.label}
              </Button>
            )}
            {secondaryButton && (
              <SecondaryButton href={secondaryButton.href}>
                {secondaryButton.label}
              </SecondaryButton>
            )}
          </div>
        )}
      </div>
    </>
  )
}
