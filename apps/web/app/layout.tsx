import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from './nav'
import { KeyboardShortcuts } from './keyboard-shortcuts'

export const metadata: Metadata = {
  title: 'Knowledge Engine',
  description: 'Local-first knowledge ingestion, analysis, and search',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-gray-100">
        <KeyboardShortcuts />
        <div className="min-h-screen">
          <header className="sticky top-0 z-50 border-b border-[#00ff88]/10 bg-black/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex items-center justify-between py-2.5">
                <h1 className="whitespace-nowrap text-base sm:text-xl font-bold">
                  📚
                  <span className="inline sm:hidden text-[#00ff88]">KE</span>
                  <span className="hidden sm:inline ml-2 text-white">Knowledge <span className="text-[#00ff88]">Engine</span></span>
                </h1>
                <Navigation />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-6 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
