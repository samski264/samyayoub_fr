import BodyText from '@/components/BodyText'
import Footer from '@/components/Footer'
import HeaderElement from '@/components/HeaderElement'
import Nav from '@/components/Nav'
import CtaButton from '@/components/standardPlus_designSystem/CtaButton'
import InfrastructureBricks from '@/components/standardPlus_designSystem/InfrastructureBricks'
import MarketingVideos from '@/components/standardPlus_designSystem/MarketingVideos'
import PaiementBloc from '@/components/standardPlus_designSystem/PaiementBloc'
import SchemaFlow from '@/components/standardPlus_designSystem/SchemaFlow'
import UserBloc from '@/components/standardPlus_designSystem/UserBloc'
import Vitrine from '@/components/standardPlus_designSystem/Vitrine'

export default function StandardPlus() {
  return (
    <main className="relative w-full overflow-x-hidden text-black">
      <Nav />

      {/* HeaderElement — Figma node 187:2066 */}
      <HeaderElement
        title="standard +"
        badge="2023 - 2026"
        titleColor="#56748b"
        description="A production platform connecting designers and local workshops through an automated 3D-print pipeline, with cryptographic NFC certification for each piece."
        primaryButton={{ label: 'See in production' }}
        secondaryButton={{ label: 'See in production →' }}
        introText="standard+ is a platform I designed and engineered end-to-end — a system where each home object is generated on-demand by local 3D printers and certified by a cryptographic NFC chip."
        bullets={[
          '€40K BPI France raised',
          'Incubated at Sorbonne Center for Artificial Intelligence',
          'Onboarded 10 independent designers and 4 interns',
        ]}
        logos={[
          {
            src: '/svg/bpi.svg',
            alt: 'Backed by Sorbonne Center for Artificial Intelligence and bpifrance',
            width: 343,
            height: 102,
          },
        ]}
      />

      <div className="flex flex-col items-center">

        {/* Séparateur horizontal — Figma node 116:127 */}
        <div
          aria-hidden
          className="border-t border-[#e5e5e5] w-[892px]"
        />

        {/* Problem / Approach — Figma node 154:1530 */}
        <BodyText label="Problem / Approach :">
          <p>
            French local design is perceived as overpriced, and designers capture
            1–3% of the revenue on their work. The chain between creator,
            fabrication and customer is broken. standard+ rebuilds it: digital
            catalog, on-demand local fabrication, traceable authorship, 30% to
            the creator.
          </p>
        </BodyText>

        {/* Schema flow diagram — Figma node 213:3867 (full-bleed, enlarged) */}
        <div className="w-[1232px] max-w-full pt-[20px] pb-[80px]">
          <SchemaFlow />
        </div>

        {/* Why ? — Figma node 203:2975 */}
        <BodyText label="Why ?">
          <p className="font-semibold">For designers</p>
          <ul className="list-disc pl-[24px] marker:text-black">
            <li>30% per sale, paid as soon as a model sells</li>
            <li>0€ to start : no machine, no stock, no materials</li>
            <li>No production, shipping, or customer service to run</li>
            <li>Upload, iterate, and go live the same day</li>
          </ul>

          <p className="font-semibold mt-[1em]">For clients</p>
          <ul className="list-disc pl-[24px] marker:text-black">
            <li>Own a real designer object for the first time, at an accessible price</li>
            <li>Discover creators by taste and intent, not keywords</li>
            <li>Customize colors on a curated palette</li>
            <li>
              Guaranteed authenticity and traceability, material and creator,
              certified per object
            </li>
          </ul>
        </BodyText>

        {/* Design system — Figma node 154:1538 */}
        <BodyText label="Design system">
          <p>
            Designed a visual system where the interface disappears and each 3D
            object carries the page — minimalist typography, modular grid,
            neutral surfaces. The same system runs across the web platform, the
            physical packaging, and the printed certificate.{' '}
            <span className="text-[#afafaf]">
              (captures écrans à insérer : home, catalog, product page, checkout,
              certificate view)
            </span>
          </p>
        </BodyText>

        {/* Design system showcase — Figma node 144:1131 */}
        <div className="relative rounded-[25px] border-[0.5px] border-[#c9c9c9] w-[927px] h-[561px] mb-[100px]">
          {/* Left column — UserBloc */}
          <div className="absolute" style={{ left: 69, top: 49 }}>
            <UserBloc />
          </div>

          {/* Right column — PaiementBloc */}
          <div className="absolute" style={{ left: 515, top: 39 }}>
            <PaiementBloc />
          </div>

          {/* Bottom-left — Vitrine */}
          <div
            className="absolute [&_.homePageToptext]:hidden [&_.homePageCatalogCta]:mt-0 [&_.homePageCatalogCtaBloc]:text-[28px] [&_.homePageCatalogCtaBloc]:tracking-[-1.4px] [&_.homePageCatalogCtaArrow]:text-[20px] [&_.homePageCatalogCta]:gap-[8px]"
            style={{ left: 69, top: 244, width: 446, fontFamily: 'var(--font-rand), system-ui, sans-serif' }}
          >
            <Vitrine />
          </div>

          {/* Bottom-right — CTA button */}
          <div className="absolute" style={{ left: 515, top: 369 }}>
            <CtaButton />
          </div>
        </div>

        {/* Infrastructure — Figma node 154:1541 */}
        <div className="flex items-center pt-[150px] pb-[50px] w-[892px]">
          <p className="w-[187px] shrink-0 font-semibold text-[16px] leading-[1.3] tracking-[-0.32px] text-black">
            Infrastructure
          </p>
        </div>

        {/* Infrastructure brick cards — Figma node 213:3814 */}
        <InfrastructureBricks />

        {/* Analytics and marketing — Figma node 203:2979 */}
        <BodyText label="Analytics and marketing">
          <p>I ran acquisition end-to-end the same hand on the creative and on the funnel :</p>
          <ul className="list-disc pl-[24px] marker:text-black mt-[1em]">
            <li>
              <span className="font-semibold">Creative:</span> produced the ad
              assets myself (3D renders + motion), inside the same visual
              system as the product — the ad and the object looked like one
              thing.
            </li>
            <li>
              <span className="font-semibold">Targeting:</span> two audiences —
              25–34 first-time design buyers (~60–70% of projected revenue) and
              54–65 buyers driven by authenticity (~30–40%).
            </li>
            <li>
              <span className="font-semibold">Tracking:</span> server-side GTM
              + GA4 (AWS / GCS), clean attribution from impression to checkout.
            </li>
            <li>
              <span className="font-semibold">Results:</span> 8% conversion on
              the purchase funnel (test), hundreds of qualified leads at low
              CAC, 300+ engaged Instagram followers.
            </li>
          </ul>
        </BodyText>

        {/* Marketing videos — Figma node 203:2994 */}
        <MarketingVideos />

        {/* Footer — Figma node 206:3030 */}
        <Footer />

      </div>
    </main>
  )
}
