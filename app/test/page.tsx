import GlyphGrid from '@/components/GlyphGrid'

export const metadata = {
  title: 'Test — Glyph Grid',
}

export default function TestPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-black p-6">
      <GlyphGrid className="block h-[139px] w-[992px] max-w-full" />
    </main>
  )
}
