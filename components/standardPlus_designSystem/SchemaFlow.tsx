import Image from 'next/image'

type SchemaFlowProps = {
  className?: string
}

const SCHEMA_FLOW_SRC = '/svg/diagram2.svg'

export default function SchemaFlow({ className }: SchemaFlowProps) {
  return (
    <div className={className}>
      <Image
        src={SCHEMA_FLOW_SRC}
        alt="Flow diagram: Designer uploads CAD to standard+, standard+ delivers Object to Consumer, Consumer pays standard+, standard+ sends Royalties to Designer."
        width={1232}
        height={386}
        className="block h-auto w-full select-none"
        draggable={false}
        unoptimized
      />
    </div>
  )
}
