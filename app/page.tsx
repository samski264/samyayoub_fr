import Link from 'next/link'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import ProjectEntry, { type Project } from '@/components/ProjectEntry'

type Intro = {
  titleStart: string
  titleStrong: string
  description: string
  stack: string
}

type Section = {
  title: string
  entries: Project[]
}

const INTRO: Intro = {
  titleStart: "Hi, I'm Samy a ",
  titleStrong: 'product engineer.',
  description:
    'Building functionality all the way through, implementing complex infrastructure and minimalist interface with all the tools needed :',
  stack: 'ts, js, ai, figma, nfc, vr.',
}

const SECTIONS: Section[] = [
  {
    title: 'Work',
    entries: [
      {
        label: 'standard +',
        description:
          'Founder of a design + additive manufacturing startup. End to end shipped product 2023- 2026.',
        href: '/standard-plus',
      },
      {
        label: 'DDB',
        description: 'Multi-brand social creative production. 2020',
        href: '/ddb',
      },
    ],
  },
  {
    title: 'Lab',
    entries: [
      {
        label: 'NFC physical certification',
        description: 'standard + core certification system 2024',
        href: '/nfc',
      },
      {
        label: 'Server side tracking and metrics',
        description: 'standard + server side metrics system stack 2025',
        href: '/metrics',
      },
      {
        label: 'Fondation Louis Vuitton',
        description: 'Real-time installation, student exibition 2020',
        href: '/flv',
      },
      {
        label: 'Vision +',
        description: 'AR concept exploring attention as currency. 2021.',
        href: '/vision',
      },
    ],
  },
]

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden text-black">
      <Nav />

      <div className="relative flex flex-col items-center px-6 pt-[110px] lg:pt-[150px]">
        <div className="w-[590px] max-w-full">
          <h1 className="w-[459px] max-w-full font-light text-[33px] leading-[normal] tracking-[-2.64px] text-[#ff8c00]">
            {INTRO.titleStart}
            <span className="font-semibold">{INTRO.titleStrong}</span>
          </h1>

          <p className="mt-[10px] w-[459px] max-w-full font-normal text-[16px] leading-[normal] tracking-[-0.96px] text-justify text-[#afafaf]">
            {INTRO.description}{' '}
            <span className="font-semibold text-black"><br></br>{INTRO.stack}</span>
          </p>

          {SECTIONS.map((section, idx) => (
            <section key={section.title} className={idx === 0 ? 'pt-[80px]' : 'pt-[50px]'}>
              <h2 className="pb-[35px] font-light text-[39px] leading-[normal] tracking-[-0.78px] text-black">
                {section.title}
              </h2>
              <ul className="flex flex-col gap-[10px] font-normal text-[13px] leading-[normal]">
                {section.entries.map((entry, i) => (
                  <ProjectEntry key={`${entry.label}-${i}`} {...entry} />
                ))}
              </ul>
            </section>
          ))}

          <Link
            href="/archives"
            className="group block pt-[50px] pb-[35px] font-light text-[39px] leading-[normal] tracking-[-0.78px] text-black"
          >
            Archives{' '}
            <span
              aria-hidden
              className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-[6px]"
            >
              →
            </span>
          </Link>
        </div>

        {/* Footer — Figma node 206:3030 */}
        <Footer />
      </div>
    </main>
  )
}
