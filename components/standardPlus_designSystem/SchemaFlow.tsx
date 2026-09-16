import Image from 'next/image'

type SchemaFlowProps = {
  className?: string
}

const SCHEMA_FLOW_SRC = '/svg/diagram3.svg'

export default function SchemaFlow({ className }: SchemaFlowProps) {
  return (
    <div className={className}>
      <Image
        src={SCHEMA_FLOW_SRC}
        alt="Flow diagram: Designer uploads CAD to standard+, standard+ delivers Object to Consumer, Consumer pays standard+, standard+ sends Royalties to Designer."
        width={804}
        height={402}
        className="mx-auto block h-auto w-full max-w-[1080px] select-none"
        draggable={false}
        unoptimized
      />
    </div>
  )
}
