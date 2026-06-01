'use client'

import Link from 'next/link'

type Item = { label: string; href: string; active?: boolean }

const ITEMS: Item[] = [
  { label: 'work', href: '/', active: true },
  { label: 'about', href: '/about' },
]

export default function Nav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed left-1/2 top-[15px] z-50 flex h-[52px] w-[200px] -translate-x-1/2 items-center rounded-[15px] bg-white/65 px-[25px] backdrop-blur-[2px] md:top-[38px]"
    >
      {ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={[
            'flex-1 text-center font-normal text-[13px] leading-none transition-colors',
            item.active ? 'text-black' : 'text-[#bfbfbf] hover:text-black',
          ].join(' ')}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
