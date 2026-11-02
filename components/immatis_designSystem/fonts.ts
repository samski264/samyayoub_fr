import localFont from 'next/font/local'

export const aquawax = localFont({
  variable: '--font-aquawax',
  display: 'swap',
  src: [
    { path: './fonts/aquawaxfx-extralight.otf', weight: '200', style: 'normal' },
    { path: './fonts/aquawaxfx-medium.otf', weight: '500', style: 'normal' },
  ],
})

export const parabole = localFont({
  variable: '--font-parabole',
  display: 'swap',
  weight: '64 116',
  src: './fonts/parabole-variabletext.woff2',
})
