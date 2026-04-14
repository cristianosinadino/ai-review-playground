'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AnalysisButtonProps {
  documentId: string
  status: string | undefined
}

export function AnalysisButton({ documentId, status }: AnalysisButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Only show button if status is pending or failed
  if (status !== 'pending' && status !== 'failed') {
    return null
  }

  const handleRunAnalysis = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/analyze/${documentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to run analysis')
      }

      // Refresh page to show results
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      console.error('Analysis failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleRunAnalysis}
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Analyzing...
          </>
        ) : status === 'failed' ? (
          <>Retry Analysis</>
        ) : (
          <>Run Analysis</>
        )}
      </button>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  )
}
