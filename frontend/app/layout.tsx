import './globals.css'
import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'ResuScanX – AI Resume vs Job Match Analyzer',
  description:
    'AI-powered resume analysis that matches your resume to job descriptions with ATS compatibility checks.',
  metadataBase: new URL('https://resuscanx.vercel.app'),
  openGraph: {
    title: 'ResuScanX – AI Resume vs JD Analyzer',
    description:
      'Upload your resume and get AI-driven match scores, ATS checks, and feedback tailored to job descriptions.',
    url: 'https://resuscanx.vercel.app',
    siteName: 'ResuScanX',
    images: [
      {
        url: 'https://i.ibb.co/0y7QkrBJ/image.png',
        width: 1200,
        height: 630,
        alt: 'ResuScanX AI resume scan preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResuScanX – AI Resume vs JD Analyzer',
    description:
      'Get detailed AI feedback, ATS compliance insights, and resume match scores.',
    images: ['https://i.ibb.co/0y7QkrBJ/image.png'],
  },
  icons: {
    icon: 'https://i.ibb.co/gczr2t9/Screenshot-2025-06-30-235805.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Explicit favicon link for browser tab */}
        <link
          rel="icon"
          href="https://i.ibb.co/gczr2t9/Screenshot-2025-06-30-235805.png"
          type="image/png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
