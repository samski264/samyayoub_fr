import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import ProjectEntry, { type Project } from '@/components/ProjectEntry'

type Section = { title: string; entries: Project[] }

const SECTIONS: Section[] = [
  {
    title: 'Work',
    entries: [
      {
        label: 'standard +',
        description:
          'Founder of a design and additive manufacturing startup. Shipped product, design, infra. 2023- 2026.',
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
        label: 'homelab and AI workflow',
        description: 'Homelab AI structure and workflow 2026',
      },
      {
        label: 'Server side tracking and metrics',
        description: 'standard + metrics system stack : fully server side 2025',
        href: '/metrics',
      },
      {
        label: 'NFC physical certification',
        description: 'standard + core certification system 2024',
        href: '/nfc',
      },
      {
        label: 'Vision +',
        description: 'AR concept exploring attention as currency. 2021.',
        href: '/vision',
      },
      {
        label: 'Fondation Louis Vuitton',
        description: 'Real-time installation, student exibition 2020',
        href: '/flv',
      },
    ],
  },
  {
    title: 'Archives',
    entries: [
      {
        label: 'Archive 1',
        description: 'Coming soon',
      },
      {
        label: 'Archive 2',
        description: 'Coming soon',
      },
      {
        label: 'Archive 3',
        description: 'Coming soon',
      },
    ],
  },
]

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden text-black">
      <Nav />

      <div className="relative flex flex-col items-center px-6 pt-[165px]">
        <div className="w-[693px] max-w-full">
          <h1 className="w-[508px] max-w-full font-light text-[33px] leading-[normal] tracking-[-2.64px] text-[#ff8c00]">
            Hi, I&apos;m Samy a{' '}
            <span className="font-semibold">design engineer.</span>
          </h1>

          <p className="mt-[28px] w-[432px] max-w-full font-normal text-[16px] leading-[normal] tracking-[-0.96px] text-justify text-[#afafaf]">
            I build functionality all the way long, implementing complex
            infrastructure and minimalist interface with all the tool needed :{' '}
            <span className="font-semibold text-black">
              ts, ai, figma, nfc, vr, wrench.
            </span>
          </p>

          {SECTIONS.map((section, idx) => (
            <section
              key={section.title}
              className={idx === 0 ? 'mt-[93px]' : 'mt-[113px]'}
            >
              <h2 className="font-light text-[39px] leading-[normal] tracking-[-0.78px] text-black">
                {section.title}
              </h2>
              <ul className="mt-[41px] flex flex-col gap-[34px] font-normal text-[13px] leading-[normal]">
                {section.entries.map((entry, i) => (
                  <ProjectEntry key={`${entry.label}-${i}`} {...entry} />  
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Footer — Figma node 206:3030 */}
        <Footer />
      </div>
    </main>
  )
}
