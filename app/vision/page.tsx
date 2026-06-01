import BodyText from '@/components/BodyText'
import Footer from '@/components/Footer'
import HeaderElement from '@/components/HeaderElement'
import Nav from '@/components/Nav'

export default function Vision() {
  return (
    <main className="relative w-full overflow-x-hidden text-black">
      <Nav />

      <HeaderElement
        title="Vision +"
        badge="2021"
        titleColor="#005290"
        description="Explore how persistent AR overlays could be monetized. I prototyped an attention-to-credits economy where users can trade engagement for benefits (ad filtering / alternative content)."
        introText={
          <>
            <p className="mb-[1em]">
              A smartphone screen is pull — you decide when to open it. A
              persistent AR overlay is push — it&apos;s always in your field of
              view, always mediating reality. That changes the interaction model
              entirely.
            </p>
            <p>
              Vision+ simulates that future. I built an always-on AR interface
              on Meta Quest 2 to prototype one specific question: if your
              attention is constantly available to the system, who controls the
              terms?
            </p>
          </>
        }
        bullets={[
          'Designed and built the attention-to-credits economy end-to-end: earning rules, gaze thresholds, cooldowns, anti-abuse logic, two spend flows (ad filter / alternative content).',
          'Hand tracking only — no controller. The design decision: if the interface lives in your field of view permanently, the friction of picking up a controller breaks the premise.',
          '72 FPS hard constraint. Profiled and optimized on-device via Meta Profiler: baked lighting, LODs, lightweight particles.',
        ]}
      />

      <div className="flex flex-col items-center">

        {/* First video — right-aligned in 890px column */}
        <div className="flex w-full items-center justify-center px-[10px] pt-[80px] lg:w-[890px] lg:justify-end lg:px-0 lg:pt-[150px]">
          <video
            className="aspect-square w-full max-w-[587px] rounded-[4px] object-cover lg:aspect-auto lg:h-[587px] lg:w-[587px]"
            src="/video/com.Samy_3.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        {/* Concept */}
        <BodyText label="Concept">
          <p>
            The credit system is inspired by BAT (Basic Attention Token /
            Brave browser) — the idea that attention has measurable value and
            that value should flow back to the user. Here it&apos;s a UX
            mechanism: every transaction between you and the system
            (what&apos;s tracked, what it&apos;s worth, what you can do with
            it) is made explicit and actionable.
          </p>
        </BodyText>

        {/* Second video */}
        <div className="flex items-center justify-end w-[890px]">
          <video
            className="rounded-[4px] object-cover"
            style={{ width: 587, height: 587 }}
            src="/video/com.Samy_1.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        {/* Tech */}
        <BodyText label="Tech">
          <p>
            Unity/C# — MRTK — Meta Quest 2 standalone. Credit scoring via
            raycast intersections on sponsored UI panels. Head-locked FOV UI
            with smoothing. Full MRTK hand tracking: buttons, touch panel,
            slider, near-interaction colliders.
          </p>
        </BodyText>

        {/* Third video */}
        <div className="flex items-center justify-end w-[890px]">
          <video
            className="rounded-[4px] object-cover"
            style={{ width: 587, height: 587 }}
            src="/video/com.Samy_2.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        {/* Footer — Figma node 206:3030 */}
        <Footer />

      </div>
    </main>
  )
}
