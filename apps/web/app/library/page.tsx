import Link from 'next/link'
import { allDocuments } from '@/lib/dummy-data'

export const dynamic = 'force-dynamic'

export default function LibraryPage() {
  const sources = allDocuments.map(doc => ({
    ...doc.source,
    documents: [doc],
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Library</h1>
          <p className="text-xs font-mono text-[#00ff88]">{`> ${sources.length} document${sources.length !== 1 ? 's' : ''} loaded`}</p>
        </div>
        <Link
          href="/ingest"
          className="bg-[#00ff88] hover:bg-[#00ff88]/90 text-black font-mono font-semibold px-4 py-2 text-sm rounded transition-all duration-200 border border-[#00ff88] shadow-lg shadow-[#00ff88]/20 hover:shadow-[#00ff88]/40"
        >
          + Add Content
        </Link>
      </div>

      {/* Empty State */}
      {sources.length === 0 && (
        <div className="rounded-lg border border-[#00ff88]/30 bg-black/40 p-8 text-center">
          <p className="font-mono text-[#00ff88] mb-2">{'$ library --list'}</p>
          <p className="text-gray-400">No documents yet. Add some content to get started.</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map(source => {
          const doc = source.documents[0]
          const analysis = doc?.analysis
          const confidenceScore = analysis?.confidenceScore
          const scoreColor = confidenceScore != null
            ? confidenceScore >= 0.85 ? '#00ff88' :
              confidenceScore >= 0.6 ? '#ffaa00' : '#ff4444'
            : '#666'
          
          return (
            <Link
              key={source.id}
              href={`/documents/${doc.id}`}
              className="group block h-full rounded-lg border border-[#00ff88]/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-[#00ff88]/60 hover:shadow-lg hover:shadow-[#00ff88]/20"
            >
              {/* Thumbnail */}
              <div className="relative h-40 bg-black/80 overflow-hidden border-b border-[#00ff88]/10">
                {source.thumbnail ? (
                  <img
                    src={source.thumbnail}
                    alt={source.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00ff88]/10 to-black/80">
                    <div className="text-[#00ff88]/30 font-mono text-sm">[no preview]</div>
                  </div>
                )}
                
                {/* Confidence Badge */}
                {confidenceScore != null && (
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded border border-[#00ff88]/30">
                    <span className="font-mono text-xs font-semibold" style={{ color: scoreColor }}>
                      {Math.round(confidenceScore * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col h-[calc(100%-160px)]">
                {/* Title */}
                <h2 className="font-semibold text-white text-sm group-hover:text-[#00ff88] transition-colors duration-200 mb-2 line-clamp-2">
                  {source.title}
                </h2>

                {/* Content Type Badge */}
                {analysis?.contentType && (
                  <div className="mb-3">
                    <span className="inline-block font-mono text-xs text-[#00ff88] border border-[#00ff88]/40 rounded px-2 py-1 bg-[#00ff88]/5">
                      {'> '}{analysis.contentType}
                    </span>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-gray-400 mb-3">
                  <span className="text-[#00ff88]/60">{source.sourceType}</span>
                  {source.duration && (
                    <span className="text-gray-500">{Math.round(source.duration / 60)}m</span>
                  )}
                  <span className="text-gray-500">{new Date(source.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Summary */}
                {analysis?.summaryShort && (
                  <p className="text-xs text-gray-400 line-clamp-2 flex-grow">
                    {analysis.summaryShort}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
