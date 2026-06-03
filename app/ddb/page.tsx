import fs from 'fs'
import path from 'path'
import { imageSize } from 'image-size'

import BodyText from '@/components/BodyText'
import Footer from '@/components/Footer'
import HeaderElement from '@/components/HeaderElement'
import Marquee from '@/components/Marquee'
import Nav from '@/components/Nav'

/*
 * DDB page — Figma node 119:613.
 * Layout: flex-column, items-center. No artboard, no absolute coordinates.
 * Content sections stack in normal flow; marquees fill the full viewport width
 * via w-full on their wrappers.
 */

const PUBLIC_DDB = path.join(process.cwd(), 'public/images/ddb')

type ImageEntry = { src: string; displayWidth: number }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function listImages(
  subdir: string,
  tileSize: number,
  exclude: string[] = [],
): ImageEntry[] {
  const dir = path.join(PUBLIC_DDB, subdir)
  const all = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .filter((f) => !exclude.includes(f))

  // Prefer .webp: when an original (.jpg/.png) has a same-named .webp twin,
  // drop the heavier original and keep only the webp (≈5× smaller).
  const webpBases = new Set(
    all
      .filter((f) => /\.webp$/i.test(f))
      .map((f) => f.replace(/\.webp$/i, '')),
  )

  return all
    .filter((f) => {
      if (/\.webp$/i.test(f)) return true
      return !webpBases.has(f.replace(/\.(jpe?g|png)$/i, ''))
    })
    .sort()
    .map((f) => {
      const src = `/images/ddb/${subdir}/${encodeURIComponent(f)}`
      try {
        const buf = fs.readFileSync(path.join(dir, f))
        const { width, height } = imageSize(buf)
        if (width && height && height > width) {
          return { src, displayWidth: Math.round(tileSize * (width / height)) }
        }
      } catch {
        // Ignore dimension-read errors, fall back to square tile
      }
      return { src, displayWidth: tileSize }
    })
}

export default function Ddb() {
  const mcdoImages = shuffle(
    listImages('mcdo', 353, ['mosaic_all_fit.jpg', 'mosaic_all_fit.webp', 'mcdo.webp']),
  )
  const thalysAll = listImages('thalys', 212, [
    'mosaic_all_fit.jpg',
    'thalys.webp',
  ])
  // Two independent shuffles so the staggered rows never line up.
  const thalysImages = shuffle(thalysAll)
  const thalysImagesShuffled = shuffle(thalysAll)

  return (
    <main className="relative w-full overflow-x-hidden text-black flex flex-col items-center">
      <Nav />

      {/* HeaderElement — Figma node 187:2143.
          Photo banner tiles at 356px height, clipped to bannerHeight=281.
          encartPaddingTop=229 matches the Figma pt-[229px] on the encart wrapper. */}
      <HeaderElement
        banner={
          <div
            className="absolute left-0 right-0 top-0 h-full bg-repeat-x pointer-events-none"
            style={{
              backgroundImage: "url('/images/ddb/header.webp')",
              backgroundSize: 'auto 356px',
              backgroundPosition: 'left top',
            }}
          />
        }
        bannerHeight={281}
        encartPaddingTop={229}
        title="DDB Paris"
        badge="2020"
        titleColor="#56748b"
        description={
          <>
            Art direction internship at DDB Paris.{' '}
            <br />
            Social creative production for McDonald&apos;s, Volkswagen, Arte.
            Concept work alongside copywriters, producers and strategists.
          </>
        }
        bullets={[
          'Highlights 3M+ cumulative views on social content',
          'End-to-end ownership on a published Arte piece',
          'Scripted production pipeline for Thalys (4 languages, automated render)',
        ]}
      />

      {/* ── Arte ─────────────────────────────────────────────────── */}
      <BodyText label="Arte">
        <p>
          Concept → delivery on a social film published on Arte&apos;s
          Instagram. Storyboard, narrative, direction, edit and format
          adaptation.
        </p>
      </BodyText>

      {/* Arte video — Figma node 188:2800 / 142:911.
          587×587, right-aligned inside a w-[892px] container to match Figma's justify-end. */}
      <div className="flex w-full items-center justify-center px-[10px] lg:w-[892px] lg:justify-end lg:px-0">
        <video
          className="aspect-square w-full max-w-[587px] rounded-[4px] object-cover lg:aspect-auto lg:h-[587px] lg:w-[587px]"
          src="/video/arte.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* ── McDonald's France ──────────────────────────────────────── */}
      <BodyText label="McDonald's France">
        <p>
          Weekly motion/visual production for Facebook and creative proposals
          for Instagram. Brand-tone iteration on short cycles.
        </p>
      </BodyText>

      {/* McDonald's carousel — Figma node 178:1891.
          Tile 353×353, gap 36 (step 389). Full viewport width. */}
      <div className="w-full">
        <Marquee
          id="mcdo"
          images={mcdoImages.map((e) => e.src)}
          imageWidths={mcdoImages.map((e) => e.displayWidth)}
          tileSize={353}
          gap={36}
          pxPerSecond={80}
          direction="left"
          altPrefix="McDonald's France social creative"
          shuffleOnMount
        />
      </div>

      {/* ── Thalys ────────────────────────────────────────────────── */}
      <BodyText label="Thalys">
        <p>
          Data-driven templates and a batch render pipeline producing localized
          visuals across 4 languages. Asset generation scripted, render queue
          automated, consistency control on output. The interesting part was
          less the visuals themselves than the system that made them
          reproducible at scale.
        </p>
      </BodyText>

      {/* Thalys brick grid — Figma node 178:1890.
          2 staggered rows: row 2 offset by 116px and scrolls right for a lively pattern.
          Tile 212×212, gap 20 (step 232). */}
      <div className="w-full">
        <Marquee
          id="thalys-row1"
          images={thalysImages.map((e) => e.src)}
          imageWidths={thalysImages.map((e) => e.displayWidth)}
          tileSize={212}
          gap={20}
          pxPerSecond={70}
          direction="left"
          altPrefix="Thalys multilingual campaign"
        />
      </div>
      <div className="mt-5 w-full">
        <Marquee
          id="thalys-row2"
          images={thalysImagesShuffled.map((e) => e.src)}
          imageWidths={thalysImagesShuffled.map((e) => e.displayWidth)}
          tileSize={212}
          gap={20}
          pxPerSecond={55}
          direction="right"
          offsetX={116}
          altPrefix="Thalys multilingual campaign"
        />
      </div>

      {/* ── What I take from it ────────────────────────────────────── */}
      <BodyText label="What I take from it">
        <p>
          Working inside a brand system teaches you what discipline a design
          system actually requires. Production constraints (volume, languages,
          formats) push toward automation faster than any technical preference.
        </p>
      </BodyText>

      {/* Footer — Figma node 206:3030 */}
      <Footer />
    </main>
  )
}
