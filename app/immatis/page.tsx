import BodyText from '@/components/BodyText'
import Footer from '@/components/Footer'
import HeaderElement from '@/components/HeaderElement'
import SchemaFlow from '@/components/immatis/SchemaFlow'
import LandscapeStrip from '@/components/immatis_designSystem/LandscapeStrip'
import Showcase from '@/components/immatis_designSystem/Showcase'
import Nav from '@/components/Nav'
import InfrastructureBricks, {
  type Brick,
} from '@/components/standardPlus_designSystem/InfrastructureBricks'

const BRICKS: Brick[] = [
  {
    title: (
      <>
        <span className="font-light">Rules </span>
        <span className="font-semibold">engine</span>
      </>
    ),
    gradientColor: '#c8f57a',
    titleColor: '#273e00',
    chipBackground: '#ffffff',
    stack: ['TypeScript', 'Zod', 'Vitest'],
    bullets: [
      'One pure function per decision',
      'Official figures as sourced JSON',
      '25 tests',
    ],
  },
  {
    title: (
      <>
        <span className="font-light">Extraction </span>
        <span className="font-semibold">API</span>
      </>
    ),
    gradientColor: '#d9f3ff',
    titleColor: '#0e3a4f',
    chipBackground: '#ffffff',
    stack: ['Hono', 'Gemini', 'SSE'],
    bullets: [
      '1 to 3 scans, photo or PDF',
      'Output locked to the schema',
      'Streams upload → reading → verdict',
    ],
  },
  {
    title: <span className="font-semibold">Interface</span>,
    gradientColor: '#e7e7e7',
    titleColor: '#3a3a3a',
    chipBackground: '#ffffff',
    stack: ['Next.js', 'WebGL2', 'GLSL'],
    bullets: [
      'Canvas in plain GLSL, no library',
      'Light enough for any phone',
      'Flight synced to the stream',
    ],
  },
]

export default function Immatis() {
  return (
    <main className="relative w-full overflow-x-hidden text-black">
      <Nav />

      <HeaderElement
        banner={
          <div className="absolute inset-0 overflow-hidden">
            <LandscapeStrip abstract />
          </div>
        }
        title="Immatis"
        badge="2026"
        titleColor="#273e00"
        description="Reads a foreign car’s registration document and tells you what the French administration will decide, before you buy."
        primaryButton={{ label: 'See in production', href: 'https://immatis.com' }}
        secondaryButton={{
          label: 'Github →',
          href: 'https://github.com/samski264/immatis',
        }}
        introText="I imported a car and lost months to the procedure. Everything the administration would decide was already on the registration document, but reading it means knowing the law, and the law is written for no one who imports a car once. Immatis does that reading: a photo in, the verdict out, with the reason."
        bullets={[
          'Free, no account, live at immatis.com',
          'A photo in, the verdict in ten seconds',
          'Every answer shows the field read and the rule applied',
        ]}
      />

      <div className="flex flex-col items-center">
        <div aria-hidden className="w-full border-t border-[#e5e5e5] lg:w-[892px]" />

        <BodyText label="The decision is a program.">
          <p>
            The administration applies rules, not judgment: a date, a power
            figure, a few boxes filled or empty. I wrote those rules in
            TypeScript, with the official figures in files that name their
            source. Everything else was built around them.
          </p>
        </BodyText>

        <div className="flex w-full items-center px-[10px] pt-[80px] pb-[28px] lg:w-[892px] lg:px-0 lg:pt-[150px] lg:pb-[36px]">
          <p className="w-[187px] shrink-0 font-semibold text-[16px] leading-[1.3] tracking-[-0.32px] text-black">
            Pipeline
          </p>
        </div>

        <div className="w-full px-[10px] pb-[40px] lg:w-[892px] lg:px-0 lg:pb-[50px]">
          <SchemaFlow />
        </div>

        <div className="flex w-full items-center px-[10px] pt-[80px] pb-[40px] lg:w-[892px] lg:px-0 lg:pt-[150px] lg:pb-[50px]">
          <p className="w-[187px] shrink-0 font-semibold text-[16px] leading-[1.3] tracking-[-0.32px] text-black">
            Infrastructure
          </p>
        </div>

        <InfrastructureBricks bricks={BRICKS} nowrap={false} />

        <BodyText label="Design system">
          <p>
            Importing a car is a trip, and the paperwork is a jungle. The site
            is drawn as the trip. A landscape with a road runs under the page:
            dropping the document makes it take off, the scan is the flight, the
            verdict is the landing. Three surfaces mark the three stops, neutral
            for the drop, lime for the reading, sky for the verdict. Aquawax for
            titles, Parabole for text. Tokens set in the Pencil mockup, mirrored
            in the CSS. The drop zone is the only control.
          </p>
        </BodyText>

        <Showcase />

        <BodyText label="GLSL, and light.">
          <p>
            One WebGL2 particle system, plain GLSL, no library. Landscapes, road
            and step scenes go in as textures; the shader draws them as dithered
            glyphs. The pointer enlarges particles, nothing moves. Rendering
            stops off screen, motion stops under prefers-reduced-motion. It runs
            on about anything, phone included.
          </p>
        </BodyText>

        <BodyText label="What I take from it">
          <p>Write the rules first. Everything else is what it takes to read them.</p>
        </BodyText>

        <Footer />
      </div>
    </main>
  )
}
