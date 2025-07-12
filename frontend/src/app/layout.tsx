import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Rebite - Smart Food Rescue Platform',
  description: 'Connect with local farmers and restaurants to rescue surplus food while building healthy habits and making a positive impact on the planet.',
  keywords: ['food rescue', 'sustainability', 'local food', 'healthy eating', 'food waste', 'community'],
  authors: [{ name: 'Rebite Team' }],
  creator: 'Rebite',
  publisher: 'Rebite',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rebite.com'),
  openGraph: {
    title: 'Rebite - Smart Food Rescue Platform',
    description: 'Rescue food. Respect values. Reinvent access.',
    url: 'https://rebite.com',
    siteName: 'Rebite',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rebite - Smart Food Rescue Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rebite - Smart Food Rescue Platform',
    description: 'Rescue food. Respect values. Reinvent access.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 