import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'PopupSpotlight',
  description: 'Discover, book, and staff pop-up businesses in Denver and Boulder.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
