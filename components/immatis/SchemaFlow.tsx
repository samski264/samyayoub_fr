/*
 * Pipeline on a 3-column grid.
 * Left two columns: Law splits into JSON and TypeScript.
 * Right column: Document, Schema, Extraction, one under the other.
 * JSON, TypeScript and Extraction each run into the verdict.
 * Below 760px the same stations stack.
 */

import { parabole } from '@/components/immatis_designSystem/fonts'

function Dot() {
  return (
    <span className="relative z-[1] size-[16px] shrink-0 rounded-full border-[1.5px] border-black bg-white" />
  )
}

function Station({
  title,
  subtitle,
  side = 'right',
}: {
  title: string
  subtitle: string
  side?: 'left' | 'right'
}) {
  const place =
    side === 'left'
      ? 'right-[calc(50%+18px)] w-[148px] text-right'
      : 'left-[calc(50%+18px)] w-[148px] text-left'
  return (
    <div className="relative flex h-[16px] items-center justify-center">
      <Dot />
      <div className={`absolute top-1/2 -translate-y-1/2 ${place}`}>
        <p className="text-[14px] leading-[1.2] text-black" style={{ fontWeight: 116 }}>
          {title}
        </p>
        <p className="mt-[2px] text-[12px] leading-[1.3] text-[#697068]" style={{ fontWeight: 90 }}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}

function Spine() {
  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-black" />
    </div>
  )
}

function Wide() {
  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2">
        <Station title="Law" subtitle="The rules" />
      </div>
      <Station title="Document" subtitle="Photo or PDF" />

      <div className="relative col-span-3 h-[56px]">
        <span className="absolute top-0 h-[22px] w-[2px] -translate-x-1/2 bg-black" style={{ left: '33.333%' }} />
        <span className="absolute top-[22px] h-[2px] bg-black" style={{ left: '16.667%', width: '33.333%' }} />
        <span className="absolute top-[22px] bottom-0 w-[2px] -translate-x-1/2 bg-black" style={{ left: '16.667%' }} />
        <span className="absolute top-[22px] bottom-0 w-[2px] -translate-x-1/2 bg-black" style={{ left: '50%' }} />
        <span className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-black" style={{ left: '83.333%' }} />
      </div>

      <Station side="left" title="JSON" subtitle="The official figures" />
      <Station title="TypeScript" subtitle="One function per decision" />
      <Station title="Schema" subtitle="The fields to read" />

      <div className="relative col-span-3 h-[48px]">
        <span className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-black" style={{ left: '16.667%' }} />
        <span className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-black" style={{ left: '50%' }} />
        <span className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-black" style={{ left: '83.333%' }} />
      </div>

      <Spine />
      <Spine />
      <Station title="Extraction" subtitle="What the scan contains" />

      <div className="relative col-span-3 h-[36px]">
        <span className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-black" style={{ left: '16.667%' }} />
        <span className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-black" style={{ left: '50%' }} />
        <span className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-black" style={{ left: '83.333%' }} />
      </div>

      <div className="col-span-3 px-[8%]">
        <div className="rounded-[18px] bg-[#C8F57A] px-[16px] py-[10px] text-center">
          <p className="text-[14px] leading-[1.2] text-[#273E00]" style={{ fontWeight: 116 }}>
            Verdict
          </p>
          <p className="mt-[2px] text-[12px] leading-[1.3] text-[#273E00]" style={{ fontWeight: 90 }}>
            Figures, rules, and the scan
          </p>
        </div>
      </div>
    </div>
  )
}

function Narrow() {
  return (
    <div className="mx-auto flex max-w-[420px] flex-col items-center">
      <CaptionBlock title="Law" subtitle="The rules" />
      <span aria-hidden className="h-[14px] w-[2px] bg-black" />
      <span aria-hidden className="h-[2px] w-1/2 bg-black" />
      <div className="grid w-full grid-cols-2">
        <div className="flex flex-col items-center">
          <span aria-hidden className="h-[14px] w-[2px] bg-black" />
          <StationStatic />
          <div className="px-[8px] pt-[8px]">
            <CaptionBlock title="JSON" subtitle="The official figures" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span aria-hidden className="h-[14px] w-[2px] bg-black" />
          <StationStatic />
          <div className="px-[8px] pt-[8px]">
            <CaptionBlock title="TypeScript" subtitle="One function per decision" />
          </div>
        </div>
      </div>
      <div className="h-[28px]" />
      <CaptionBlock title="Document" subtitle="Photo or PDF" />
      <span aria-hidden className="mt-[8px] h-[16px] w-[2px] bg-black" />
      <StationStatic />
      <div className="px-[8px] pt-[8px]">
        <CaptionBlock title="Schema" subtitle="The fields to read" />
      </div>
      <span aria-hidden className="mt-[8px] h-[16px] w-[2px] bg-black" />
      <StationStatic />
      <div className="px-[8px] pt-[8px]">
        <CaptionBlock title="Extraction" subtitle="What the scan contains" />
      </div>
      <div className="mt-[22px] grid w-full grid-cols-3">
        <div className="flex flex-col items-center">
          <p className="text-[12px] leading-[1.2] text-[#697068]" style={{ fontWeight: 90 }}>
            JSON
          </p>
          <span aria-hidden className="mt-[6px] h-[18px] w-[2px] bg-black" />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[12px] leading-[1.2] text-[#697068]" style={{ fontWeight: 90 }}>
            TypeScript
          </p>
          <span aria-hidden className="mt-[6px] h-[18px] w-[2px] bg-black" />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[12px] leading-[1.2] text-[#697068]" style={{ fontWeight: 90 }}>
            Extraction
          </p>
          <span aria-hidden className="mt-[6px] h-[18px] w-[2px] bg-black" />
        </div>
      </div>
      <div className="w-full rounded-[18px] bg-[#C8F57A] px-[14px] py-[8px] text-center">
        <p className="text-[14px] leading-[1.2] text-[#273E00]" style={{ fontWeight: 116 }}>
          Verdict
        </p>
        <p className="mt-[2px] text-[12px] leading-[1.3] text-[#273E00]" style={{ fontWeight: 90 }}>
          Figures, rules, and the scan
        </p>
      </div>
    </div>
  )
}

function StationStatic() {
  return <span className="size-[16px] shrink-0 rounded-full border-[1.5px] border-black bg-white" />
}

function CaptionBlock({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="w-[200px] text-center">
      <p className="text-[14px] leading-[1.2] text-black" style={{ fontWeight: 116 }}>
        {title}
      </p>
      <p className="mt-[4px] text-[12px] leading-[1.3] text-[#697068]" style={{ fontWeight: 90 }}>
        {subtitle}
      </p>
    </div>
  )
}

export default function SchemaFlow() {
  return (
    <figure
      className={`${parabole.variable} @container text-left [word-break:normal]`}
      style={{ fontFamily: 'var(--font-parabole), system-ui, sans-serif' }}
    >
      <figcaption className="sr-only">
        The rules split into the official figures and one function per decision.
        The document is read field by field. Both meet at the verdict: the field
        read, and the rule applied.
      </figcaption>
      <div className="@min-[760px]:hidden">
        <Narrow />
      </div>
      <div className="hidden @min-[760px]:block">
        <Wide />
      </div>
    </figure>
  )
}
