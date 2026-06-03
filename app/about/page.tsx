import Button from '@/components/Button'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'

export default function About() {
  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-black">
      <Nav />

      <div className="relative flex flex-1 flex-col items-center px-6 pt-[110px]">
        <div className="w-[392px] max-w-full">
          <div className="mt-[93px] flex flex-col gap-[34px]">
            <p className="w-[392px] max-w-full font-normal text-[16px] leading-normal tracking-[-0.32px] text-[#afafaf]">
              I always wanted to build things that{' '}
              <span className="text-black">people use</span> and aligned with{' '}
              <span className="text-black">business challenges.</span>
              <br />
              <br />
              For three years{' '}
              <span className="text-black">standard+</span>, a startup I founded
              at the intersection of design and additive manufacturing.
              <br />
              <br />
              <span className="text-black">I built the product end-to-end</span>
              : the Next.js app, the payment flow, the AI search over the
              catalog, even a cryptographic NFC system to certify physical
              parts. I raised €40K from BPI France, got incubated at the
              Sorbonne Center for AI, and onboard designers and mangaged team
              of dev.
              <br />
              <br />
              <span className="text-black">
                I made all the usual startuper mistake
              </span>
              , and proud to say I will do everything to never do them again.
              <br />
              <br />
              I&apos;m looking for a team where I can learn continiusly and{' '}
              <span className="text-black">meet great people</span> and continue
              along the path.
            </p>

            <div className="flex flex-col gap-[22px]">
              <p className="font-normal text-[16px] leading-normal tracking-[-0.32px] text-[#afafaf]">
                email me at :{' '}
                <a
                  href="mailto:ayoubsamy26@gmail.com"
                  className="text-black transition-opacity hover:opacity-70"
                >
                  ayoubsamy26@gmail.com
                </a>
              </p>
              <Button href="/cv.pdf">See my CV</Button>
            </div>
          </div>
        </div>

        <div className="flex-1" />
        <Footer />
      </div>
    </main>
  )
}
