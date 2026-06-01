import type { CSSProperties } from 'react'
import Link from 'next/link'

/*
 * Footer — Figma node 206:3030.
 * "Let's do something new" sign-off + author / contact row. Reusable across
 * project pages; lives at /components root rather than the standardPlus-only
 * folder.
 */

type FooterProps = {
  /** Width of the footer column. Defaults to 890px to align with BodyText. */
  width?: number
}

export default function Footer({ width = 890 }: FooterProps) {
  return (
    <footer
      className="mx-auto flex w-full flex-col gap-[19px] items-start justify-end px-[10px] pt-[60px] pb-[40px] text-black lg:w-[var(--footer-w)] lg:gap-[12px] lg:px-0 lg:pt-[196px] lg:pb-[50px]"
      style={{ '--footer-w': `${width}px` } as CSSProperties}
    >
      <p className="font-light text-[16px] leading-[1.3] tracking-[-0.32px] w-full">
        <span>Let&apos;s </span>
        <span className="font-semibold">do something </span>
        <span>new !</span>
      </p>

      <div className="flex w-full flex-col gap-[19px] text-[10px] leading-[1.3] tracking-[-0.2px] text-[#afafaf] whitespace-nowrap lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <span>Samy Ayoub Fawaz</span>

        <div className="flex gap-[49px] items-center justify-center lg:justify-start">
          <Link
            href="https://www.linkedin.com/in/samy-ayoub-fawaz/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            Linkedin
          </Link>
          <Link
            href="https://github.com/samyayoub"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            Github
          </Link>
          <Link
            href="mailto:ayoubsamy26@gmail.com"
            className="transition-colors hover:text-black"
          >
            ayoubsamy26@gmail.com
          </Link>
        </div>
      </div>
    </footer>
  )
}
