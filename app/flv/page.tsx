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
        description="A production platform connecting designers and local workshops through an automated 3D-print pipeline, with cryptographic NFC certification for each piece."
        introText="standard+ is a platform I designed and engineered end-to-end — a system where each home object is generated on-demand by local 3D printers and certified by a cryptographic NFC chip."
        bullets={[
          '€40K BPI France raised',
          'Incubated at Sorbonne Center for Artificial Intelligence',
          'Onboarded 10 independent designers and 4 interns',
        ]}
      />

      {/* ── Trade-offs ────────────────────────────────────────────── */}
      {/* Figma node 190:2891 */}
      <BodyText label="Trade-offs">
        <ul className="list-disc pl-[24px] marker:text-black">
          <li className="mb-[1em]">
            On-chip signing instead of a server lookup: the customer&apos;s
            path doesn&apos;t depend on our infrastructure being up. Cost:
            locked to NTAG 424 (NXP), no second source.
          </li>
          <li className="mb-[1em]">
            Off-chain signed payload anchored on-chain for ownership, instead
            of one mint per piece: no gas at production rate, public
            verifiability still works.
          </li>
          <li>
            Side-channel hardening (LRP) implemented but disabled — ~30%
            throughput cost on the chip, the threat model doesn&apos;t include
            lab-grade attackers.
          </li>
        </ul>
      </BodyText>

      {/* flv3 — vue large installation + projection */}
      <div className="relative w-[892px] h-[502px] shrink-0">
        <Image
          src="/images/flv/flv3.webp"
          alt="Exhibition view — projection and visitor"
          fill
          className="object-cover"
        />
      </div>

      {/* ── Provisioning side ─────────────────────────────────────── */}
      {/* Figma node 190:2894 */}
      <BodyText label="Provisioning side">
        <p className="mb-[1em]">
          Before a chip can sign anything, it has to be keyed. A blank NTAG 424
          ships with factory default keys — anyone with a reader can rewrite it.
          So between print and packaging, the operator passes each piece over a
          provisioning bench: a Raspberry Pi connected to a PN532 NFC reader,
          running a small Flask API. One POST authenticates with the factory
          keys, rotates both AES keys, enables SDM mirroring (UID + counter +
          CMAC), and writes the NDEF URL. For the operator it&apos;s one action.
          Behind it, a sequence designed so a failure mid-rotation doesn&apos;t
          brick the chip.
        </p>
        <p>
          One detail that matters: Key 1 is never the same across chips.
          It&apos;s derived from a master key and the chip&apos;s UID. A
          compromised piece leaks one key, not the batch — and the server can
          always re-derive the right one from the UID at verify time, so no
          per-chip secret is stored anywhere.
        </p>
      </BodyText>

      {/* Two-column image row — détails interaction */}
      <div className="flex gap-[15px] items-center w-[892px] shrink-0">
        <div className="relative w-[437px] h-[291px]">
          <Image
            src="/images/flv/flv2.webp"
            alt="Tablet UI — Atelier Otto interface"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative w-[437px] h-[291px]">
          <Image
            src="/images/flv/flv1.webp"
            alt="Visitor interacting with installation podium"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* ── On-chain anchoring ────────────────────────────────────── */}
      {/* Figma node 190:2897 */}
      <BodyText label="On-chain anchoring">
        <ul className="list-disc pl-[24px] marker:text-black">
          <li className="mb-[1em]">
            On-chip signing instead of a server lookup: the customer&apos;s
            path doesn&apos;t depend on our infrastructure being up. Cost:
            locked to NTAG 424 (NXP), no second source.
          </li>
          <li className="mb-[1em]">
            Off-chain signed payload anchored on-chain for ownership, instead
            of one mint per piece: no gas at production rate, public
            verifiability still works.
          </li>
          <li>
            Side-channel hardening (LRP) implemented but disabled — ~30%
            throughput cost on the chip, the threat model doesn&apos;t include
            lab-grade attackers.
          </li>
        </ul>
      </BodyText>

      {/* flv4 — vue large salle expo, visiteuse + projection */}
      <div className="relative w-[892px] h-[502px] shrink-0">
        <Image
          src="/images/flv/flv4.webp"
          alt="Exhibition hall — visitor watching projection"
          fill
          className="object-cover"
        />
      </div>

      {/* flv6 — TouchDesigner system / back-end */}
      <div className="relative w-[892px] h-[490px] shrink-0 mt-[15px]">
        <Image
          src="/images/flv/flv6.webp"
          alt="TouchDesigner project — installation system"
          fill
          className="object-cover"
        />
      </div>

      {/* Footer — Figma node 206:3030 */}
      <Footer />
    </main>
  )
}
