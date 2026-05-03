import type { Metadata } from 'next'
import { Playfair_Display, IBM_Plex_Mono, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex',
  weight: ['400', '500', '600'],
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Cuaderno Cornell',
  description: 'Apuntes estructurados con ingesta por IA',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${ibmPlexMono.variable} ${sourceSerif.variable}`}>
        {children}
      </body>
    </html>
  )
}
