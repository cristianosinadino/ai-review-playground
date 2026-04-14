import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative border-l-4 border-l-blue-600 rounded-2xl bg-white px-8 py-16 md:px-12 md:py-20 shadow-sm">
        <h1 className="mb-4 text-4xl md:text-5xl font-bold text-gray-900">
          Transform Content Into Intelligence
        </h1>
        <p className="mb-8 text-lg md:text-xl text-gray-600 max-w-2xl">
          Ingest YouTube videos, extract transcripts, and get AI-powered analysis with semantic search.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/ingest"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            Add Content
          </Link>
          <Link
            href="/library"
            className="rounded-lg border-2 border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition"
          >
            View Library
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="mb-8 text-2xl font-bold text-gray-900">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Ingest Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:scale-[1.02]">
            <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">Ingest Content</h3>
            <p className="text-sm text-gray-600">
              Add YouTube videos or web content. System extracts transcripts automatically.
            </p>
          </div>

          {/* Search Card */}
          <Link
            href="/search"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:scale-[1.02]"
          >
            <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">Intelligent Search</h3>
            <p className="text-sm text-gray-600">
              Search across all content by keyword or semantic similarity.
            </p>
          </Link>

          {/* Analyze Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:scale-[1.02]">
            <div className="mb-4 inline-flex rounded-lg bg-amber-100 p-3">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">Structured Analysis</h3>
            <p className="text-sm text-gray-600">
              Get AI-powered summaries, critiques, key points, and action items.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
