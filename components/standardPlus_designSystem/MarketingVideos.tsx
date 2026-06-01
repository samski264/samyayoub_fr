/*
 * MarketingVideos — Figma node 203:2994 / 94:62.
 * Row of 6 vertical marketing clips (mk1 → mk6) shown right after the
 * "Analytics and marketing" block. Videos autoplay muted and loop in place,
 * preserving the 9:16 ratio from the source assets.
 *
 * The row runs as an infinite horizontal marquee — same pattern as the DDB
 * page <Marquee>: two consecutive copies of the list translated by exactly
 * one copy's length so the loop is seamless. CSS-only animation, no JS.
 * The marquee spans full viewport width so videos bleed off both edges.
 */

const VIDEOS = ['mk1', 'mk2', 'mk3', 'mk6', 'mk5', 'mk4'] as const

const TILE_WIDTH = 250
const TILE_HEIGHT = 445
const GAP = 119
const PX_PER_SECOND = 70

export default function MarketingVideos() {
  const copyLength = VIDEOS.length * (TILE_WIDTH + GAP)
  const durationSec = copyLength / PX_PER_SECOND
  const tiles = [...VIDEOS, ...VIDEOS]
  const animationName = 'marquee-marketing-videos'
  const keyframes = `@keyframes ${animationName} {
    from { transform: translate3d(0, 0, 0); }
    to   { transform: translate3d(-${copyLength}px, 0, 0); }
  }`

  return (
    <div className="relative w-screen left-1/2 -translate-x-1/2 pt-[100px] pb-[150px] overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div
        className="flex items-center"
        style={{
          gap: `${GAP}px`,
          paddingLeft: `${GAP}px`,
          width: 'max-content',
          animation: `${animationName} ${durationSec}s linear infinite`,
          willChange: 'transform',
        }}
        aria-hidden
      >
        {tiles.map((name, i) => (
          <video
            key={`${name}-${i}`}
            src={`/video/${name}.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="block object-cover rounded-[10px] bg-[#f0f0f0] flex-none"
            style={{ width: TILE_WIDTH, height: TILE_HEIGHT }}
          />
        ))}
      </div>
    </div>
  )
}
