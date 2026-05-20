import GlyphGrid from '@/components/GlyphGrid'

export const metadata = {
  title: 'Test — Glyph Grid',
}

export default function TestPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <GlyphGrid />
    </main>
  )
}
