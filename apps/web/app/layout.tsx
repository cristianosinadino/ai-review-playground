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
      <body className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
        <KeyboardShortcuts />
        <div className="min-h-screen">
          <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex items-center justify-between py-2.5">
                <h1 className="whitespace-nowrap text-base sm:text-xl font-bold">
                  📚
                  <span className="inline sm:hidden">KE</span>
                  <span className="hidden sm:inline ml-2">Knowledge Engine</span>
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
