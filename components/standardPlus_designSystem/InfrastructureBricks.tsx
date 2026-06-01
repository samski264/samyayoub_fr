import type { ReactNode } from 'react'

/*
 * InfrastructureBricks — Figma node 213:3814.
 * Stack of four "brick" cards (title + tech stack chips) each paired with a
 * bullet list to its right. One row per architectural brick.
 *
 * Each card background is a vertical linear gradient lifted verbatim from the
 * Figma node fills (GRADIENT_LINEAR, top color → transparent white).
 */

type Brick = {
  title: ReactNode
  /** Top color of the vertical gradient (fades down to transparent white). */
  gradientColor: string
  stack: string[]
  bullets: string[]
}

const BRICKS: Brick[] = [
  {
    title: (
      <>
        <span className="font-light">Exploratory</span>
        <span className="font-semibold"> marketplace</span>
      </>
    ),
    gradientColor: '#ff8c00',
    stack: ['Next.js', 'NextAuth', 'MongoDB', 'Stripe'],
    bullets: [
      'Browse by intent, not keywords',
      'Upload → instant cost estimation',
      'Authorship locked at upload',
    ],
  },
  {
    title: (
      <>
        <span className="font-semibold">Automated</span>
        <span className="font-light"> production API</span>
      </>
    ),
    gradientColor: '#507cc0',
    stack: ['Express.js', 'Docker', 'openAI embedding'],
    bullets: [
      'Order-triggered slicing → gcode → queue',
      'Slicing isolated & scalable (Docker)',
      'Auto-retry on failure',
    ],
  },
  {
    title: (
      <>
        <span className="font-light">Cryptographic</span>
        <span className="font-semibold"> certification</span>
      </>
    ),
    gradientColor: '#a6c8bb',
    stack: ['NFC', 'EVM', 'AES-128'],
    bullets: [
      '2s check, no app',
      'Uncloneable, non-rewritable chip',
      'Off-chain read, on-chain source of truth',
    ],
  },
  {
    title: (
      <>
        <span className="font-light">Printer </span>
        <span className="font-semibold">network</span>
      </>
    ),
    gradientColor: '#ff7073',
    stack: ['Moonraker API', 'Klipper'],
    bullets: [
      'Real-time job orchestration',
      'Remote control & monitoring',
      'Operator only loads & packs',
    ],
  },
]

export default function InfrastructureBricks() {
  return (
    <div className="flex flex-col gap-[72px] items-start w-[801px]">
      {BRICKS.map((brick, i) => (
        <div key={i} className="flex gap-[27px] items-start w-[801px]">
          {/* Brick card with gradient background, title, and stack chips.
              Gradient lifted from Figma node fill: vertical, top color → transparent white. */}
          <div
            className="relative flex flex-col gap-[17px] items-start shrink-0 w-[506px] pl-[20px] pr-[45px] pt-[15px] pb-[14px] rounded-t-[10px] overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(180deg, ${brick.gradientColor} 0%, rgba(255,255,255,0) 100%)`,
            }}
          >
            <h4 className="relative z-10 w-full font-normal text-[33px] leading-[1.3] tracking-[-0.66px] text-white [word-break:break-word]">
              {brick.title}
            </h4>
            <div className="relative z-10 flex flex-wrap content-start gap-y-[5px] gap-x-[12px] h-[56px] w-full px-px">
              {brick.stack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center justify-center px-[10px] py-[5px] rounded-[70px] bg-[rgba(255,255,255,0.36)] text-[10px] font-light leading-[1.3] tracking-normal text-black text-center whitespace-nowrap"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Bullets adjacent — aligned to top of row to match Figma 213:3815 */}
          <ul className="list-disc pl-[24px] text-[16px] font-normal leading-[1.3] tracking-[-0.32px] text-black marker:text-black whitespace-nowrap">
            {brick.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
