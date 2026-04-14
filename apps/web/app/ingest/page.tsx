'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function IngestPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ingest/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to ingest URL'
        const details = data.code ? ` (${data.code})` : ''
        throw new Error(errorMsg + details)
      }

      // Success - redirect to document
      // (Even if transcript wasn't available, we can still view the page)
      router.push(`/documents/${data.documentId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Add Content</h1>
        <p className="text-gray-600">Paste a YouTube URL or web link to ingest content.</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="url" className="mb-2 block text-sm font-medium">
              URL
            </label>
            <input
              id="url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !url}
            className="w-full"
          >
            {loading ? 'Processing...' : 'Ingest'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Supported Sources</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✓ YouTube videos (with automatic transcript extraction)</li>
          <li>✓ YouTube playlists (coming soon)</li>
          <li>✓ Web pages and documentation</li>
          <li>✓ PDFs (coming soon)</li>
        </ul>
      </div>
    </div>
  )
}
