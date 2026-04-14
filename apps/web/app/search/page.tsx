'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface SearchResult {
  sourceId: string
  documentId: string
  title: string
  thumbnail: string | null
  duration: number | null
  sourceType: string
  matchedIn: 'title' | 'summary' | 'transcript'
  snippet: string
  confidenceScore: number | null
  rank: number
}

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced search
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Don't search if query is too short
    if (query.length < 2) {
      setResults([])
      setError(null)
      setHasSearched(query.length > 0)
      return
    }

    setIsLoading(true)
    setError(null)
    setHasSearched(true)

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`)

        if (!response.ok) {
          throw new Error('Search failed')
        }

        const data = await response.json()
        setResults(data.results || [])
        setError(null)
      } catch (err) {
        console.error('Search error:', err)
        setError('Search unavailable')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [query])

  const handleResultClick = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  const getMatchedInColor = (matchedIn: string) => {
    switch (matchedIn) {
      case 'title':
        return 'bg-blue-100 text-blue-800'
      case 'summary':
        return 'bg-purple-100 text-purple-800'
      case 'transcript':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.85) return 'bg-green-100 text-green-800'
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const highlightSnippet = (snippet: string, searchQuery: string) => {
    if (!snippet) return ''

    // Escape regex special characters
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')

    const parts = snippet.split(regex)

    return parts.map((part: string, idx: number) => {
      if (regex.test(part)) {
        return (
          <mark key={idx} className="bg-yellow-200 font-semibold">
            {part}
          </mark>
        )
      }
      return part
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search your knowledge base..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {query.length > 0 && query.length < 2 && (
          <p className="mt-2 text-sm text-gray-500">
            Enter at least 2 characters to search
          </p>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_: unknown, i: number) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State - Before Search */}
      {!hasSearched && !isLoading && results.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-600">Start typing to search your knowledge base</p>
        </div>
      )}

      {/* Empty State - No Results */}
      {hasSearched && !isLoading && results.length === 0 && !error && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-600">
            No results for &quot;{query}&quot; — try different keywords
          </p>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {results.map((result: SearchResult) => (
          <button
            key={`${result.sourceId}-${result.matchedIn}`}
            onClick={() => handleResultClick(result.documentId)}
            className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              {result.thumbnail && (
                <div className="flex-shrink-0">
                  <Image
                    src={result.thumbnail}
                    alt={result.title}
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">
                  {result.title}
                </h3>

                {/* Badges Row */}
                <div className="mb-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getMatchedInColor(
                      result.matchedIn
                    )}`}
                  >
                    {result.matchedIn}
                  </span>

                  {result.confidenceScore !== null && result.confidenceScore !== undefined && (
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getConfidenceColor(
                        result.confidenceScore
                      )}`}
                    >
                      {Math.round(result.confidenceScore * 100)}% confidence
                    </span>
                  )}

                  {result.duration && (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                      {Math.round(result.duration / 60)} min
                    </span>
                  )}
                </div>

                {/* Snippet */}
                <p
                  className="line-clamp-2 text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: result.snippet }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Results Count */}
      {!isLoading && results.length > 0 && (
        <p className="text-center text-sm text-gray-500">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </p>
      )}
    </div>
  )
}
