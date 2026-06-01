'use client'

/*
 * MarketingVideos — Figma node 203:2994 / 94:62.
 * Row of 6 vertical marketing clips (mk1 → mk6).
 *
 * Desktop: CSS-only infinite marquee.
 * Mobile:  JS auto-scroll (rAF) + native touch swipe.
 *          Doubles the video list for a seamless loop, same pattern as desktop.
 *          Auto-scroll pauses on touch and resumes 1.5 s after release.
 */

import { useEffect, useRef } from 'react'

const VIDEOS = ['mk1', 'mk2', 'mk3', 'mk6', 'mk5', 'mk4'] as const

const TILE_W = 250
const TILE_H = 445
const GAP = 119
const PX_PER_SECOND = 70

const MOBILE_TILE_W = 200
const MOBILE_TILE_H = Math.round(MOBILE_TILE_W * (TILE_H / TILE_W))
const MOBILE_GAP = 16
const MOBILE_PX_PER_SECOND = 40

export default function MarketingVideos() {
  const copyLength = VIDEOS.length * (TILE_W + GAP)
  const durationSec = copyLength / PX_PER_SECOND
  const animationName = 'marquee-marketing-videos'
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (window.matchMedia('(min-width: 1024px)').matches) return

    let animId: number
    let lastTime: number | null = null
    let paused = false
    let resumeAt: number | null = null
    const EASE_MS = 300
    let resumeTimer: ReturnType<typeof setTimeout> | null = null

    function step(time: number) {
      if (lastTime !== null && !paused) {
        // Ease-in speed ramp on resume
        let t = 1
        if (resumeAt !== null) {
          t = Math.min((time - resumeAt) / EASE_MS, 1)
          // ease-out cubic: smooth deceleration curve reversed as ease-in
          t = t * t * (3 - 2 * t)
          if (t >= 1) resumeAt = null
        }
        const delta = time - lastTime
        el!.scrollLeft += (MOBILE_PX_PER_SECOND * t * delta) / 1000
        // Seamless loop: jump back by half when we reach the midpoint
        const half = el!.scrollWidth / 2
        if (el!.scrollLeft >= half) {
          el!.scrollLeft -= half
        }
      }
      lastTime = time
      animId = requestAnimationFrame(step)
    }

    animId = requestAnimationFrame(step)

    const onTouchStart = () => {
      paused = true
      lastTime = null
      if (resumeTimer) clearTimeout(resumeTimer)
    }
    const onTouchEnd = () => {
      if (resumeTimer) clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => {
        resumeAt = performance.now()
        paused = false
      }, 1500)
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      cancelAnimationFrame(animId)
      if (resumeTimer) clearTimeout(resumeTimer)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const css = `
    @keyframes ${animationName} {
      from { transform: translate3d(0, 0, 0); }
      to   { transform: translate3d(-${copyLength}px, 0, 0); }
    }
    .mv-outer {
      position: relative;
      width: 100vw;
      left: 50%;
      transform: translateX(-50%);
      padding-top: 100px;
      padding-bottom: 150px;
    }
    /* ── Desktop marquee ── */
    .mv-marquee {
      display: flex;
      align-items: center;
      gap: ${GAP}px;
      padding-left: ${GAP}px;
      width: max-content;
      overflow: hidden;
      animation: ${animationName} ${durationSec}s linear infinite;
      will-change: transform;
    }
    /* ── Mobile swipe ── */
    .mv-swipe {
      display: none;
    }
    @media (max-width: 1023px) {
      .mv-outer {
        overflow: hidden;
      }
      .mv-marquee {
        display: none;
      }
      .mv-swipe {
        display: flex;
        align-items: center;
        gap: ${MOBILE_GAP}px;
        padding-left: ${MOBILE_GAP}px;
        padding-right: ${MOBILE_GAP}px;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .mv-swipe::-webkit-scrollbar {
        display: none;
      }
    }
  `

  return (
    <div className="mv-outer">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Desktop: CSS infinite marquee */}
      <div className="mv-marquee" aria-hidden>
        {[...VIDEOS, ...VIDEOS].map((name, i) => (
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
            style={{ width: TILE_W, height: TILE_H }}
          />
        ))}
      </div>

      {/* Mobile: JS auto-scroll + touch swipe (duplicated for seamless loop) */}
      <div ref={scrollRef} className="mv-swipe" aria-label="Marketing videos">
        {[...VIDEOS, ...VIDEOS].map((name, i) => (
          <video
            key={`${name}-mobile-${i}`}
            src={`/video/${name}.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="block object-cover rounded-[10px] bg-[#f0f0f0] flex-none"
            style={{ width: MOBILE_TILE_W, height: MOBILE_TILE_H }}
          />
        ))}
      </div>
    </div>
  )
}
