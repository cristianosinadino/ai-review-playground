import Link from 'next/link'
import { allDocuments } from '@/lib/dummy-data'

export const dynamic = 'force-dynamic'

export default function LibraryPage() {
  const sources = allDocuments.map(doc => ({
    ...doc.source,
    documents: [doc],
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Library</h1>
        <Link
          href="/ingest"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Content
        </Link>
      </div>

      {sources.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          No documents yet. Add some content to get started.
        </div>
      )}

      <div className="space-y-4">
        {sources.map(source => {
          const doc = source.documents[0]
          const analysis = doc?.analysis
          return (
            <Link
              key={source.id}
              href={`/documents/${doc.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="font-semibold text-gray-900">{source.title}</h2>
                {analysis?.contentType && (
                  <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
                    {analysis.contentType}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>{source.sourceType}</span>
                {source.duration && (
                  <span>{Math.round(source.duration / 60)} min</span>
                )}
                <span>{new Date(source.createdAt).toLocaleDateString()}</span>
                {analysis?.confidenceScore != null && (
                  <span className={`font-medium ${
                    analysis.confidenceScore >= 0.85 ? 'text-green-600' :
                    analysis.confidenceScore >= 0.6 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {Math.round(analysis.confidenceScore * 100)}% confidence
                  </span>
                )}
              </div>
              {analysis?.summaryShort && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {analysis.summaryShort}
                </p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
