import Button from '@/components/Button'
import GlyphGrid from '@/components/GlyphGrid'
import Nav from '@/components/Nav'

export default function StandardPlus() {
  return (
    <main className="relative min-h-[2009px] w-full overflow-x-hidden text-black">
      <Nav />

      <div className="relative flex flex-col items-center px-6 pb-[400px] pt-[145px]">
        <figure
          aria-hidden
          className="w-[992px] max-w-full mix-blend-difference"
        >
          <GlyphGrid className="block h-[139px] w-full" />
        </figure>

        <header className="mt-[87px] w-[370px] max-w-full">
          <div className="flex items-center justify-between">
            <h1 className="font-light text-[33px] leading-[normal] tracking-[-2.64px] text-[#ff8c00]">
              standard +
            </h1>
            <span className="inline-flex h-[26px] w-[87px] items-center justify-center rounded-[43px] bg-[#e0e0e0] font-normal text-[8px] leading-none tracking-[-0.48px] text-black">
              2023 - 2026
            </span>
          </div>

          <p className="mt-[28px] font-normal text-[16px] leading-[1.3] tracking-[-0.32px] text-justify text-[#afafaf]">
            A production platform connecting designers and local workshops
            through an automated 3D-print pipeline, with cryptographic NFC
            certification for each piece.
          </p>

          <div className="mt-[34px] flex justify-between">
            <Button variant="primary">See in production</Button>
            <Button variant="secondary">Github →</Button>
          </div>
        </header>

        <section className="mt-[122px] w-[593px] max-w-full font-normal text-[16px] leading-[1.3] tracking-[-0.32px] text-justify text-black">
          <p>
            standard+ is a platform I designed and engineered end-to-end — a
            system where each home object is generated on-demand by local 3D
            printers and certified by a cryptographic NFC chip. Founder, sole
            engineer, sole designer for the first two years.
          </p>

          <ul className="mt-[20px] list-disc pl-[24px] text-left marker:text-black">
            <li>€40K BPI France R&amp;D grant</li>
            <li>Incubated at Sorbonne Center for Artificial Intelligence</li>
            <li>Onboarded 10 independent designers and 4 interns</li>
          </ul>
        </section>

        <section className="mt-[400px] w-[593px] max-w-full space-y-[1.3em] font-normal text-[16px] leading-[1.3] tracking-[-0.32px] text-justify text-black">
          <p>
            Pitch (1 phrase) : A production platform connecting designers and
            local workshops through an automated 3D-print pipeline, with
            cryptographic NFC certification for each piece.
          </p>
          <p>
            <span className="font-semibold">Problem / Approach</span> : French
            local design is perceived as overpriced, and designers capture only
            1–3% of the revenue on their work. standard+ rebuilds the chain:
            digital catalog, on-demand local fabrication, traceable authorship,
            fair share to the creator.
          </p>
          <p>
            Product design : Designed a visual system where the interface
            disappears and each 3D object carries the page — minimalist
            typography, modular grid, neutral surfaces. The same system runs
            across the web platform, the physical packaging, and the printed
            certificate.{' '}
            <span className="text-[#afafaf]">
              (captures écrans à insérer : home, catalog, product page,
              checkout, certificate view)
            </span>
          </p>
        </section>
      </div>
    </main>
  )
}
