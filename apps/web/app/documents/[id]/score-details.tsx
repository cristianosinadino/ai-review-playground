'use client'

import { useState } from 'react'

interface ScoreDetailsProps {
  transcriptScore: number | null
  analysisScore: number | null
  modelUsed: string | null
  modelProvider: string | null
  scoringNotes: string[]
}

export function ScoreDetails({
  transcriptScore,
  analysisScore,
  modelUsed,
  modelProvider,
  scoringNotes,
}: ScoreDetailsProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Don't render if no data
  if (!transcriptScore && !analysisScore) {
    return null
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
      >
        <span>Score Details</span>
        <span className="text-gray-400 transition-transform" style={{
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>
          ›
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          {transcriptScore !== null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Transcript Quality:</span>
              <span className="font-medium text-gray-900">
                {Math.round(transcriptScore * 100)}%
              </span>
            </div>
          )}

          {analysisScore !== null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Analysis Quality:</span>
              <span className="font-medium text-gray-900">
                {Math.round(analysisScore * 100)}%
              </span>
            </div>
          )}

          {modelUsed && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Model Used:</span>
              <span className="font-medium text-gray-900">
                {modelUsed}
                {modelProvider && ` (${modelProvider})`}
              </span>
            </div>
          )}

          {scoringNotes.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-medium text-gray-600 mb-1">Notes:</p>
              <ul className="space-y-1">
                {scoringNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="mt-0.5">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
