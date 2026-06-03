import type { CSSProperties, ReactNode } from 'react'
import Image from 'next/image'
import GlyphGrid from '@/components/GlyphGrid'
import ProjectHeader from '@/components/ProjectHeader'

/*
 * HeaderElement — full-width section combining a banner, the glassmorphic
 * ProjectEncart card, and an optional IntroText block.
 * Matches Figma node 187:2066 ("Header element").
 *
 * Banner:
 *   Pass `banner` to override the default animated GlyphGrid (e.g. a real photo).
 *   `bannerHeight` controls the absolute-positioned banner zone (default 281px).
 *
 * Encart:
 *   `encartPaddingTop` controls how far from the top the card starts (default 229px).
 *   This lets the card straddle the banner/content boundary at any offset.
 *   NoButton variant activates automatically when neither primaryButton nor
 *   secondaryButton is provided.
 *
 * IntroText:
 *   Both `introText` and `bullets` are optional. When omitted the block is hidden.
 */

type HeaderButton = { label: ReactNode; href?: string }

export type Logo = {
  src: string
  alt: string
  width: number
  height: number
}

type HeaderElementProps = {
  title: ReactNode
  badge: ReactNode
  description: ReactNode
  primaryButton?: HeaderButton
  secondaryButton?: HeaderButton
  titleColor?: string
  /** Optional intro paragraph above the bullet list */
  introText?: ReactNode
  /** Optional bullet list items */
  bullets?: ReactNode[]
  /** Optional partner logos row */
  logos?: Logo[]
  /** Custom banner content. Defaults to the animated GlyphGrid. */
  banner?: ReactNode
  /** Height of the banner zone in px (default 281) */
  bannerHeight?: number
  /** Top padding in px before the ProjectEncart card (default 229) */
  encartPaddingTop?: number
}

export default function HeaderElement({
  title,
  badge,
  description,
  primaryButton,
  secondaryButton,
  titleColor,
  introText,
  bullets,
  logos,
  banner,
  bannerHeight = 281,
  encartPaddingTop = 229,
}: HeaderElementProps) {
  const hasIntro = Boolean(introText || bullets?.length)

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden">
      {/* Fetch the canvas glyph font at high priority during HTML parse so the
          GlyphGrid sketch can draw as soon as p5 finishes loading. Only when
          the default animated banner is used. React hoists this into <head>. */}
      {!banner && (
        <link
          rel="preload"
          href="/font/Gridular-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      )}

      {/* Banner zone — absolute so it doesn't push content down */}
      <div
        aria-hidden
        className={`absolute top-0 left-0 w-full z-0${!banner ? ' mix-blend-difference' : ''}`}
        style={{ height: bannerHeight }}
      >
        {banner ?? <GlyphGrid className="block h-full w-full" />}
      </div>

      {/* ProjectEncart — Figma node 187:2046 */}
      <div
        className="relative z-10 flex items-start overflow-clip px-[15px] w-full lg:px-px lg:w-[1110px]"
        style={{ paddingTop: encartPaddingTop }}
      >
        <ProjectHeader
          title={title}
          badge={badge}
          description={description}
          primaryButton={primaryButton}
          secondaryButton={secondaryButton}
          titleColor={titleColor}
        />
      </div>

      {/* IntroText — Figma node 187:2201 / 245:4003 (mobile) */}
      {hasIntro && (
        <div className="relative z-10 flex flex-col gap-[10px] items-start justify-center w-full px-[10px] pb-[40px] pt-[61px] lg:w-[892px] lg:px-0">
          <div className="flex w-full flex-col gap-[22px] items-start">
            {introText && (
              <div className="w-full font-normal text-[16px] leading-[1.3] tracking-[-0.32px] text-justify text-black lg:w-[593px]">
                {introText}
              </div>
            )}
            {bullets && bullets.length > 0 && (
              <ul className="w-full list-disc pl-[24px] font-semibold text-[16px] leading-[1.3] tracking-[-0.32px] text-black marker:text-black lg:w-[593px]">
                {bullets.map((bullet, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Partner logos — Figma node 187:2205 */}
          {logos && logos.length > 0 && (
            <div className="flex w-full flex-wrap gap-[50px] items-center justify-center py-[24px] lg:w-auto lg:justify-start">
              {logos.map((logo) => (
                <Image
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="object-contain"
                  unoptimized
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
