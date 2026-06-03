import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import ProjectEntry, { type Project } from '@/components/ProjectEntry'

const ENTRIES: Project[] = [
  {
    label: 'Webd',
    description: 'Graphic — interactive 3D comic, C4D + Octane Render. 2020',
    href: '/archives/webd',
  },
  {
    label: 'Objet Graphique',
    description: 'Generative — Arduino + 3D-printed object exploring physical interfaces. 2020',
    href: '/archives/obg',
  },
  {
    label: "Rapport d'expérience",
    description: 'Generative — GAN experiment applied to artwork creation. 2019',
    href: '/archives/rapport',
  },
  {
    label: 'DS automobiles',
    description: 'Motion + interactive — projects made during an internship at DS Automobile. 2019',
    href: '/archives/ds',
  },
  {
    label: 'Posters & argentic photography',
    description: 'Graphic — print and film photography series. 2019',
    href: '/archives/aff',
  },
  {
    label: 'Tour Eiffel',
    description: 'Interactive — AR app with real-time 3D recognition and filters. 2018',
    href: '/archives/tour-eiffel',
  },
  {
    label: 'Workshop 3D',
    description: 'Motion — short 3D film on motorsports. 2018',
    href: '/archives/projet-fin',
  },
  {
    label: 'JPO EPSAA',
    description: 'Interactive — generative installation controlled in real time via tablet. 2018',
    href: '/archives/jpo',
  },
  {
    label: 'Dit moi dix mots',
    description: 'Motion — arabesque rendered from thousands of generative glass shapes. 2018',
    href: '/archives/dix',
  },
  {
    label: 'Réalités plurielles',
    description: 'Motion — graphic exploration of individual perception. 2017',
    href: '/archives/realites-plurielles',
  },
]

export default function Archives() {
  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-black">
      <Nav />

      <div className="relative flex flex-1 flex-col items-center px-6 pt-[110px]">
        <div className="w-[693px] max-w-full">
          <section className="mt-[93px]">
            <h1 className="font-light text-[39px] leading-[normal] tracking-[-0.78px] text-black">
              Archives
            </h1>
            <ul className="mt-[41px] flex flex-col gap-[34px] font-normal text-[13px] leading-[normal]">
              {ENTRIES.map((entry, i) => (
                <ProjectEntry key={`${entry.label}-${i}`} {...entry} />
              ))}
            </ul>
          </section>
        </div>

        <div className="flex-1" />
        <Footer />
      </div>
    </main>
  )
}
