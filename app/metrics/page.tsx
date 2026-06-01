import BodyText from '@/components/BodyText'
import Footer from '@/components/Footer'
import HeaderElement from '@/components/HeaderElement'
import Nav from '@/components/Nav'

/*
 * Metrics page — Figma node 206:3051 (/gtm_metrics).
 * Server-side GTM stack for standard+.
 */

export default function Metrics() {
  return (
    <main
      className="relative w-full overflow-x-hidden text-black flex flex-col items-center"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1728 2032' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-35.8 65.694 -65.187 2.659 1092.5 1024.1)'><stop stop-color='rgba(255,255,255,1)' offset='0'/><stop stop-color='rgba(241,241,241,1)' offset='1'/></radialGradient></defs></svg>"), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)`,
      }}
    >
      <Nav />

      {/* HeaderElement — Figma node I206:3052;187:2046 */}
      <HeaderElement
        title="Server side tracking and metrics"
        badge="2025"
        titleColor="#005290"
        description="A first-party, fully server-side analytics stack for standard+, running on Google Cloud."
        introText={
          <>
            standard+ needed metrics it could trust.
            <br />
            Client-side tracking was not enough precise: ad blockers,
            Safari/iOS restrictions and third-party cookie loss meant
            unreliability and not enough data.
          </>
        }
      />

      {/* ── Why server-side ────────────────────────────────────── */}
      <BodyText label="Why server-side">
        <ul className="list-disc pl-[24px]">
          <li>
            <strong>Data loss :</strong> Ad blockers and iOS/ITP kill
            client-side tags before they fire. Server-side collection runs from
            a first-party endpoint, so events aren&apos;t blocked at the source.
          </li>
          <li className="mt-[1.3em]">
            <strong>Reliability :</strong> Events are sent server-to-server, not
            from the browser. No dropped beacons on page unload, no race
            conditions, consistent payloads.
          </li>
          <li className="mt-[1.3em]">
            <strong>Ownership :</strong> The data passes through infrastructure I
            control before it goes anywhere. I decide what&apos;s collected,
            what&apos;s forwarded, what&apos;s stripped.
          </li>
        </ul>
      </BodyText>

      {/* ── Stack ──────────────────────────────────────────────── */}
      <BodyText label="Stack">
        <p>
          A server-side Google Tag Manager container on Google Cloud. The site
          sends events to a first-party domain; the container enriches them and
          forwards them server-to-server to GA4, the Meta Conversions API
          (CAPI), Hotjar and Pinterest Ads.
        </p>
        <p className="mt-[1.3em]">
          The full e-commerce funnel is tracked: view_item, search,
          begin_checkout, add_shipping_info, add_payment_info, purchase, plus
          engagement events like scroll depth and CTA interactions. Meta
          deduplication runs on event_id, with first-party fbc/fbp cookies and a
          hashed external_id for cross-session matching.
        </p>
      </BodyText>

      {/* ── Outcome ────────────────────────────────────────────── */}
      <BodyText label="Outcome">
        <p>
          Built and deployed solo: infrastructure, event schema, server-side
          forwarding and identity handling. The funnel is fully instrumented on
          live traffic. Every step from view to checkout is captured
          server-to-server, where client-side tracking structurally loses data.
        </p>
      </BodyText>

      {/* Footer — Figma node 206:3062 */}
      <Footer />
    </main>
  )
}
