import BodyText from '@/components/BodyText'
import Footer from '@/components/Footer'
import HeaderElement from '@/components/HeaderElement'
import Nav from '@/components/Nav'

/*
 * NFC physical certification — Figma node 155:1554 (file yHPjBbzQtc3QXBuv2EOmPt).
 *
 * Structure (node 188:2551): HeaderElement → flex-col BodyText stack with an
 * inline NFC tap demo video.
 * Sections in Figma order:
 *   1. How it works, briefly      (177:1867)
 *   2. NFC tap demo video         (207:3109 / 207:3108)
 *   3. The choice of the chip     (178:1907)
 *   4. Provisioning side          (178:1916)
 *   5. Trade-offs                 (178:1919)
 *   6. What I take from it        (178:1925)
 * URL pill (178:1898) — inline inside "How it works" content column.
 */
export default function Nfc() {
  return (
    <main className="relative w-full overflow-x-hidden text-black">
      <Nav />

      <HeaderElement
        title={
          <>
            NFC physical
            <br />
            certification
          </>
        }
        badge="2024"
        description="A physical object that proves its own origin. No app, no QR redirect, no central database to query — the chip itself produces a unique cryptographic proof on every tap, readable by any phone."
        introText={
          <>
            <p>
              The core question of this system is how to secure and trace a
              digital object that has been physicalised — by definition something
              that can be produced without limit.
            </p>
            <p className="mt-[1em]">
              Authenticity is supplied by a chip that gives the consumer
              assurance their object is genuine, and lets them explore its full
              traceability: who designed it, when it was produced.
            </p>
            <p className="mt-[1em]">Two constraints :</p>
          </>
        }
        bullets={[
          'No companion app — friction kills authentication features',
          '~€1 per piece — passive NFC only, no battery, no smart device',
        ]}
      />

      <div className="flex flex-col items-center">

        {/* === How it works, briefly === */}
        <BodyText label="How it works, briefly">
          <p>
            Customer taps their phone on the object. The chip rewrites its URL
            on the fly and the phone opens it in the browser:
          </p>

          {/* URL pill — Figma node 178:1898 */}
          <div className="my-[20px] flex items-center justify-center rounded-[19px] bg-white px-[20px] py-[8px]">
            <p className="font-mono text-[12px] leading-[1.3] tracking-[-0.24px] text-center text-black">
              https://domain.com/verify?p=
              <span className="font-bold">&lt;PICCData&gt;</span>
              &amp;e=
              <span className="font-semibold">&lt;EncFileData&gt;</span>
              &amp;m=
              <span className="font-semibold">&lt;CMAC&gt;</span>
            </p>
          </div>

          <p>
            <span className="font-serif italic font-bold">p</span> carries the
            UID and read counter, encrypted with Key 1.
          </p>
          <p>
            <span className="font-serif italic font-bold">e</span> is an
            encrypted user payload.{' '}
            <span className="font-serif italic font-bold">m</span> is a
            truncated AES-CMAC.
          </p>
          <p className="mt-[1em]">
            The server decrypts{' '}
            <span className="font-serif italic font-bold">p</span>, derives a
            session key from Key 1 and the UID, recomputes the CMAC, compares.
          </p>
          <p className="mt-[1em]">
            The customer sees: a web page that says authenticated.
            That&apos;s it. No install, no scan, no account.
          </p>
        </BodyText>

        {/* NFC tap demo video — Figma node 207:3109 / 207:3108.
            587×440, right-aligned inside a w-[892px] container to match the
            Figma "items-end" alignment (same pattern as the DDB Arte tile). */}
        <div className="flex items-center justify-end w-[892px]">
          <video
            className="rounded-[4px] object-cover flex-none"
            style={{ width: 587, height: 440 }}
            src="/video/nfc_tag_exemple.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        {/* === The choice of the chip === */}
        <BodyText label="The choice of the chip">
          <p>
            NTAG 424 DNA. A passive NFC chip (no power source), but with one
            feature normal NTAGs don&apos;t have: it can sign its own reads.
          </p>
          <p className="mt-[1em]">Inside :</p>
          <ul className="mt-[1em] list-disc pl-[24px] marker:text-black">
            <li>Two AES-128 keys, never readable from outside</li>
            <li className="mt-[1em]">A read counter that increments on every tap</li>
            <li className="mt-[1em]">An NDEF URL field</li>
            <li className="mt-[1em]">
              SDM (Secure Dynamic Messaging) — the feature that ties the three
              above together
            </li>
          </ul>
        </BodyText>

        {/* === Provisioning side === */}
        <BodyText label="Provisioning side">
          <p>
            Before a chip can sign anything, it has to be keyed. A blank NTAG
            424 ships with factory default keys — anyone with a reader can
            rewrite it. So between print and packaging, the operator passes
            each piece over a provisioning bench: a Raspberry Pi connected to
            a PN532 NFC reader, running a small Flask API. One POST
            authenticates with the factory keys, rotates both AES keys,
            enables SDM mirroring (UID + counter + CMAC), and writes the NDEF
            URL. For the operator it&apos;s one action. Behind it, a sequence
            designed so a failure mid-rotation doesn&apos;t brick the chip.
          </p>
          <p className="mt-[1em]">
            One detail that matters: Key 1 is never the same across chips.
            It&apos;s derived from a master key and the chip&apos;s UID. A
            compromised piece leaks one key, not the batch — and the server
            can always re-derive the right one from the UID at verify time,
            so no per-chip secret is stored anywhere.
          </p>
        </BodyText>

        {/* === Trade-offs === */}
        <BodyText label="Trade-offs">
          <ul className="list-disc pl-[24px] marker:text-black">
            <li>
              On-chip signing instead of a server lookup: the customer&apos;s
              path doesn&apos;t depend on our infrastructure being up. Cost:
              locked to NTAG 424 (NXP), no second source.
            </li>
            <li className="mt-[1em]">
              Off-chain signed payload anchored on-chain for ownership,
              instead of one mint per piece: no gas at production rate, public
              verifiability still works.
            </li>
            <li className="mt-[1em]">
              Side-channel hardening (LRP) implemented but disabled — ~30%
              throughput cost on the chip, the threat model doesn&apos;t
              include lab-grade attackers.
            </li>
          </ul>
        </BodyText>

        {/* === What I take from it === */}
        <BodyText label="What I take from it">
          <p>
            Designing the cryptography wasn&apos;t the hard part. Making it
            invisible was. The whole stack — chip choice, provisioning bench,
            server library — exists so the operator does nothing and the
            customer does one tap.
          </p>
        </BodyText>

        {/* Footer — Figma node 206:3030 */}
        <Footer />

      </div>
    </main>
  )
}
