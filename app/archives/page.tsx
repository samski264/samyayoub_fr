import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import ProjectEntry, { type Project } from '@/components/ProjectEntry'

const ENTRIES: Project[] = [
  {
    label: 'Webd',
    description: 'Graphic — interactive 3D comic, C4D + Octane Render. 2020',
    href: '/archives/webd',
    image: '/archives/assets/img/webd/city.jpg',
  },
  {
    label: 'Objet Graphique',
    description: 'Generative — Arduino + 3D-printed object exploring physical interfaces. 2020',
    href: '/archives/obg',
    image: '/archives/assets/img/obg/image-1.jpg',
  },
  {
    label: "Rapport d'expérience",
    description: 'Generative — GAN experiment applied to artwork creation. 2019',
    href: '/archives/rapport',
    image: '/archives/assets/img/gan.png',
  },
  {
    label: 'DS automobiles',
    description: 'Motion + interactive — projects made during an internship at DS Automobile. 2019',
    href: '/archives/ds',
    image: '/archives/assets/img/ds1.jpg',
  },
  {
    label: 'Posters & argentic photography',
    description: 'Graphic — print and film photography series. 2019',
    href: '/archives/aff',
    image: '/archives/assets/img/aff_1.jpg',
  },
  {
    label: 'Tour Eiffel',
    description: 'Interactive — AR app with real-time 3D recognition and filters. 2018',
    href: '/archives/tour-eiffel',
    image: '/archives/assets/img/tour_eiffel.jpg',
  },
  {
    label: 'Workshop 3D',
    description: 'Motion — short 3D film on motorsports. 2018',
    href: '/archives/projet-fin',
    image: '/archives/assets/img/gt.jpg',
  },
  {
    label: 'JPO EPSAA',
    description: 'Interactive — generative installation controlled in real time via tablet. 2018',
    href: '/archives/jpo',
    image: '/archives/assets/img/jpo.jpg',
  },
  {
    label: 'Dit moi dix mots',
    description: 'Motion — arabesque rendered from thousands of generative glass shapes. 2018',
    href: '/archives/dix',
    image: '/archives/assets/img/dix1.jpg',
  },
  {
    label: 'Réalités plurielles',
    description: 'Motion — graphic exploration of individual perception. 2017',
    href: '/archives/realites-plurielles',
    image: '/archives/assets/img/ring.jpg',
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
