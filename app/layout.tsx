import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PopupSpotlight',
  description: 'Discover, book, and staff pop-up businesses in Denver and Boulder.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
