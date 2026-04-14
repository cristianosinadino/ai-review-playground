'use client'

import { useState } from 'react'

interface TranscriptSectionProps {
  transcript: string
}

export function TranscriptSection({ transcript }: TranscriptSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const previewLength = 300
  const isLongTranscript = transcript.length > previewLength
  const preview = transcript.slice(0, previewLength)

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold">Transcript</h2>
      <div className="space-y-4 text-gray-700">
        {isExpanded ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {transcript}
          </p>
        ) : (
          <div className="relative">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {preview}
              {isLongTranscript && '...'}
            </p>
            {isLongTranscript && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
          </div>
        )}

        {isLongTranscript && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            {isExpanded ? 'Collapse' : 'Show Full Transcript'}
          </button>
        )}
      </div>
    </section>
  )
}
