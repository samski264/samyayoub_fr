import Image from 'next/image'

type SchemaFlowProps = {
  className?: string
}

const SCHEMA_FLOW_SRC = '/svg/diagram2.svg'

export default function SchemaFlow({ className }: SchemaFlowProps) {
  return (
    <div className={['schemaFlow relative overflow-hidden', className].filter(Boolean).join(' ')}>
      <style>{`
        @keyframes schema-flow-enter {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.985);
            filter: blur(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes schema-flow-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes schema-flow-sweep {
          0%, 18% { transform: translateX(-130%) skewX(-18deg); opacity: 0; }
          28% { opacity: 0.18; }
          62% { opacity: 0.18; }
          78%, 100% { transform: translateX(260%) skewX(-18deg); opacity: 0; }
        }

        .schemaFlowImage {
          animation:
            schema-flow-enter 700ms cubic-bezier(0.22, 1, 0.36, 1) both,
            schema-flow-float 6s ease-in-out 900ms infinite;
          transform-origin: center;
        }

        .schemaFlowSweep {
          animation: schema-flow-sweep 4.8s ease-in-out 1s infinite;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.75) 50%,
            transparent 100%
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .schemaFlowImage,
          .schemaFlowSweep {
            animation: none !important;
          }
        }
      `}</style>

      <Image
        src={SCHEMA_FLOW_SRC}
        alt="Flow diagram: Designer uploads CAD to standard+, standard+ delivers Object to Consumer, Consumer pays standard+, standard+ sends Royalties to Designer."
        width={1232}
        height={386}
        className="schemaFlowImage block h-auto w-full select-none"
        draggable={false}
        unoptimized
      />
      <div
        aria-hidden
        className="schemaFlowSweep pointer-events-none absolute -top-1/4 left-0 h-[150%] w-1/3"
      />
    </div>
  )
}
