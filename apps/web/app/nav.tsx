import Link from 'next/link'

export function Navigation() {
  return (
    <nav className="flex items-center gap-2 sm:gap-6">
      <Link href="/" className="whitespace-nowrap px-2 py-1 text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 transition">
        Home
      </Link>
      <Link href="/ingest" className="whitespace-nowrap px-2 py-1 text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 transition">
        Add
        <span className="hidden sm:inline"> Content</span>
      </Link>
      <Link href="/library" className="whitespace-nowrap px-2 py-1 text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 transition">
        Library
      </Link>
      <Link href="/search" className="whitespace-nowrap px-2 py-1 text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 transition">
        Search
      </Link>
    </nav>
  )
}
