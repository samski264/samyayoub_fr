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
          'Founder of a design + additive manufacturing startup. Shipped product, design, infra. 2023- 2025.',
        href: '/standard-plus',
      },
      {
        label: 'DDB',
        description: 'Multi-brand social creative production. 2020',
      },
      {
        label: 'DS automobiles',
        description: 'Multi-brand social creative production. 2019',
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
        label: 'NFC physical certification',
        description: 'standard + core certification system 2024',
      },
      {
        label: 'Vision +',
        description: 'AR concept exploring attention as currency. 2021.',
      },
      {
        label: 'Fondation Louis Vuitton',
        description: 'Real-time installation, student exibition 2020',
      },
    ],
  },
]

export default function Home() {
  return (
    <main className="relative min-h-[2009px] w-full overflow-x-hidden text-black">
      <Nav />

      <div className="relative flex flex-col items-center px-6 pb-[760px] pt-[249px]">
        <div className="w-[610px] max-w-full">
          <h1 className="w-[508px] max-w-full font-light text-[33px] leading-[normal] tracking-[-2.64px] text-[#ff8c00]">
            Hi, I’m Samy a{' '}
            <span className="font-medium">product engineer.</span>
          </h1>

          <p className="mt-[28px] w-[432px] max-w-full font-normal text-[16px] leading-[normal] tracking-[-0.96px] text-justify text-[#afafaf]">
            I start by the problem and find solution : enjoying designing and
            engineering products user needs.
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
                {section.entries.map((entry) => (
                  <ProjectEntry key={entry.label} {...entry} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
