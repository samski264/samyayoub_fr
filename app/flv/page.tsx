import Image from 'next/image'

import BodyText from '@/components/BodyText'
import Footer from '@/components/Footer'
import HeaderElement from '@/components/HeaderElement'
import Nav from '@/components/Nav'

/*
 * FLV page — Fondation Louis Vuitton.
 * Figma node 152:1156.
 * Layout: flex-column, items-center.
 */

export default function Flv() {
  return (
    <main className="relative w-full overflow-x-hidden text-black flex flex-col items-center">
      <Nav />

      {/* HeaderElement — Figma node 190:2814 */}
      <HeaderElement
        banner={
          <div className="absolute left-0 right-0 top-0 h-full pointer-events-none">
            <Image
              src="/images/flv/out.gif"
              alt="Fondation Louis Vuitton"
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        }
        bannerHeight={281}
        encartPaddingTop={229}
        title={
          <>
            Fondation
            <br />
            Louis Vuitton
          </>
        }
        badge="2020"
        titleColor="#005290"
        description="FLVX is a real-time mediation installation built for the Fondation Louis Vuitton auditorium, developed during FLV LAB#4."
        introText="It starts from a premise: imagine the Fondation has disappeared, and the only thing left to rebuild it is the flow of data it once produced visitor movement, gestures, traces."
      />

      {/* ── The project ───────────────────────────────────────────── */}
      {/* Figma node 190:2891 */}
      <BodyText label="The project">
        <p>
          A large-scale projection displays a 3D model that evolves through the
          day as live data comes in from sensors across the auditorium. Visitors
          don&apos;t watch passively: a Leap Motion reads their hand gestures,
          letting them navigate and reshape the reconstruction without touching
          anything. A tablet timeline lets them replay earlier states of the day
          and leave with their own generated plan of the Fondation.
        </p>
      </BodyText>

      {/* flv3 — vue large installation + projection */}
      <div className="w-full px-[10px] lg:w-[892px] lg:px-0">
        <div className="relative aspect-[892/502] w-full shrink-0 lg:h-[502px]">
          <Image
            src="/images/flv/flv3.webp"
            alt="Exhibition view — projection and visitor"
            fill
            sizes="(min-width: 1024px) 892px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* ── What I worked on ──────────────────────────────────────── */}
      {/* Figma node 190:2894 */}
      <BodyText label="What I worked on:">
        <ul className="list-disc pl-[24px] marker:text-black">
          <li className="mb-[1em]">
            Real-time system from concept to on-site deployment (TouchDesigner
            runtime, projection-ready pipeline)
          </li>
          <li className="mb-[1em]">
            Contactless interaction layer — hand gestures via Leap Motion to
            navigate and manipulate the 3D model
          </li>
          <li className="mb-[1em]">
            Tablet timeline interface to replay the day and export each
            visitor&apos;s plan
          </li>
          <li>
            Live data ingestion and smoothing driving the generative building
            structure and floor plans from visitor movement
          </li>
        </ul>
      </BodyText>

      {/* Two-column image row — détails interaction */}
      <div className="flex flex-col gap-[15px] items-center w-full px-[10px] shrink-0 lg:flex-row lg:w-[892px] lg:px-0">
        <div className="relative aspect-[437/291] w-full lg:h-[291px] lg:w-[437px]">
          <Image
            src="/images/flv/flv2.webp"
            alt="Tablet UI — Atelier Otto interface"
            fill
            sizes="(min-width: 1024px) 437px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-[437/291] w-full lg:h-[291px] lg:w-[437px]">
          <Image
            src="/images/flv/flv1.webp"
            alt="Visitor interacting with installation podium"
            fill
            sizes="(min-width: 1024px) 437px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* flv4 — vue large salle expo, visiteuse + projection */}
      <div className="w-full px-[10px] lg:w-[892px] lg:px-0">
        <div className="relative aspect-[892/502] w-full shrink-0 lg:h-[502px]">
          <Image
            src="/images/flv/flv4.webp"
            alt="Exhibition hall — visitor watching projection"
            fill
            sizes="(min-width: 1024px) 892px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* flv6 — TouchDesigner system / back-end */}
      <div className="w-full px-[10px] mt-[15px] lg:w-[892px] lg:px-0">
        <div className="relative aspect-[898/490] w-full shrink-0 lg:h-[490px]">
          <Image
            src="/images/flv/flv6.webp"
            alt="TouchDesigner project — installation system"
            fill
            sizes="(min-width: 1024px) 898px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Footer — Figma node 206:3030 */}
      <Footer />
    </main>
  )
}
