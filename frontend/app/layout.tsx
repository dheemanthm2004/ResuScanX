import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'ResuScan - AI Resume Analysis',
  description: 'AI-powered resume analysis platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}