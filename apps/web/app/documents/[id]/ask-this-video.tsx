'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface EvidenceItem {
  chunkId: string
  text: string
  startTimestamp: number | null
  relevanceScore: number
}

interface QAResponse {
  answer: string
  confidence: 'high' | 'medium' | 'low'
  evidence: EvidenceItem[]
  caveat: string | null
}

interface QAHistory {
  question: string
  response: QAResponse
}

interface KeyItem {
  title: string
  explanation: string
  quality: string
  applicability?: string
}

const FALLBACK_QUESTIONS = [
  'What were the main frameworks mentioned?',
  'What did the speaker recommend?',
  'What are the key risks discussed?',
]

export function AskThisVideo({
  documentId,
  videoId,
  keyItems,
  mechanisms,
}: {
  documentId: string
  videoId: string | undefined
  keyItems?: KeyItem[]
  mechanisms?: string[]
}) {
  // Generate dynamic starter questions based on analysis data
  const starterQuestions = (() => {
    const questions: string[] = []

    if (keyItems && keyItems.length > 0) {
      questions.push(`What are the ${keyItems[0].title} details?`)
    }

    if (mechanisms && mechanisms.length > 0) {
      questions.push(`How does ${mechanisms[0]} work?`)
    }

    questions.push('What should I do with this information?')

    // If we have fewer than 3 questions, pad with fallback questions
    while (questions.length < 3 && FALLBACK_QUESTIONS.length > 0) {
      const fallback = FALLBACK_QUESTIONS[questions.length - (keyItems ? 1 : 0) - (mechanisms ? 1 : 0)]
      if (fallback && !questions.includes(fallback)) {
        questions.push(fallback)
      }
    }

    return questions.slice(0, 3)
  })()
  const router = useRouter()

  const [hasEmbeddings, setHasEmbeddings] = useState<boolean | null>(null)
  const [isEmbeddingInProgress, setIsEmbeddingInProgress] = useState(false)
  const [embeddingProgress, setEmbeddingProgress] = useState('')

  const [questionInput, setQuestionInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [qaHistory, setQaHistory] = useState<QAHistory[]>([])
  const [expandedEvidenceIdx, setExpandedEvidenceIdx] = useState<{ [key: number]: boolean }>({})
  const [expandedCardIdx, setExpandedCardIdx] = useState<{ [key: string]: boolean }>({})
  const inputRef = useRef<HTMLInputElement>(null)

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number = 40): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const checkEmbeddings = useCallback(async () => {
    try {
      const response = await fetch(`/api/embed/${documentId}`)
      const data = await response.json()

      if (response.ok) {
        setHasEmbeddings(data.embeddedCount > 0)
      }
    } catch (error) {
      console.error('Failed to check embeddings:', error)
      setHasEmbeddings(false)
    }
  }, [documentId])

  // Check if embeddings exist
  useEffect(() => {
    checkEmbeddings()
  }, [checkEmbeddings])

  async function startEmbedding() {
    setIsEmbeddingInProgress(true)
    setEmbeddingProgress('Generating embeddings... this takes ~30 seconds')

    try {
      const response = await fetch(`/api/embed/${documentId}`, {
        method: 'POST',
      })

      if (response.ok) {
        setEmbeddingProgress('Embeddings complete! Refreshing...')
        setTimeout(() => {
          setIsEmbeddingInProgress(false)
          setHasEmbeddings(true)
          router.refresh()
        }, 1000)
      } else {
        const error = await response.json()
        setEmbeddingProgress(`Error: ${error.error}`)
        setTimeout(() => setIsEmbeddingInProgress(false), 3000)
      }
    } catch (error) {
      setEmbeddingProgress(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setTimeout(() => setIsEmbeddingInProgress(false), 3000)
    }
  }

  async function handleAskQuestion(question: string) {
    if (!question.trim()) return

    setQuestionInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`/api/ask/${documentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      if (response.ok) {
        const qaResponse: QAResponse = await response.json()
        setQaHistory((prev) => [{ question, response: qaResponse }, ...prev].slice(0, 3))
      } else {
        const error = await response.json()
        console.error('Q&A failed:', error)
      }
    } catch (error) {
      console.error('Failed to ask question:', error)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  // Show loading state while checking embeddings
  if (hasEmbeddings === null) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">Ask This Video</h2>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></span>
          Loading...
        </div>
      </section>
    )
  }

  // Show embedding setup screen
  if (!hasEmbeddings) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">Ask This Video</h2>
        <p className="mb-6 text-gray-700">
          Enable Q&A to ask questions about this video&apos;s content. We&apos;ll analyze the transcript and create searchable embeddings.
        </p>
        <button
          onClick={startEmbedding}
          disabled={isEmbeddingInProgress}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isEmbeddingInProgress ? embeddingProgress : 'Enable Q&A for this video'}
        </button>
      </section>
    )
  }

  // Show Q&A interface
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">Ask This Video</h2>

      {/* Question Input */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleAskQuestion(questionInput)
              }
            }}
            placeholder="Ask a question about this video..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={() => handleAskQuestion(questionInput)}
            disabled={isLoading || !questionInput.trim()}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Asking...' : 'Ask'}
          </button>
        </div>

        {/* Starter Questions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {starterQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleAskQuestion(q)}
              disabled={isLoading}
              title={q}
              className="inline-block rounded-full border border-blue-400 bg-blue-50 px-3 py-1 text-xs text-blue-600 hover:bg-blue-100 disabled:opacity-50 truncate max-w-xs"
            >
              {truncateText(q, 40)}
            </button>
          ))}
        </div>
      </div>

      {/* Question History / Answers */}
      {qaHistory.length > 0 && (
        <div className="space-y-8">
          {qaHistory.map((item, idx) => (
            <div key={idx} className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
              {/* Question */}
              <p className="mb-4 font-semibold text-gray-900">{item.question}</p>

              {/* Answer */}
              <div className="mb-4">
                <p className="mb-3 text-gray-700">{item.response.answer}</p>

                {/* Confidence Badge + Caveat */}
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${
                      item.response.confidence === 'high'
                        ? 'bg-green-600'
                        : item.response.confidence === 'medium'
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                    }`}
                  >
                    {item.response.confidence} confidence
                  </span>
                  {item.response.caveat && (
                    <p className="text-sm italic text-gray-600">{item.response.caveat}</p>
                  )}
                </div>
              </div>

              {/* Evidence */}
              {item.response.evidence.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      const key = `${idx}`
                      setExpandedEvidenceIdx((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <span>Supporting Evidence ({item.response.evidence.length} {item.response.evidence.length === 1 ? 'excerpt' : 'excerpts'})</span>
                    <span className="text-gray-400 transition-transform" style={{
                      transform: expandedEvidenceIdx[`${idx}`] ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}>
                      ›
                    </span>
                  </button>

                  {expandedEvidenceIdx[`${idx}`] && (
                    <div className="space-y-3 mt-3">
                      {item.response.evidence.map((evidence, eIdx) => {
                        const cardKey = `${idx}-${eIdx}`
                        const isExpanded = expandedCardIdx[cardKey]

                        return (
                          <div
                            key={eIdx}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                          >
                            <p className={`mb-2 text-sm text-gray-700 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                              {evidence.text}
                            </p>
                            {!isExpanded && evidence.text.split('\n').length > 3 && (
                              <button
                                onClick={() => {
                                  setExpandedCardIdx((prev) => ({
                                    ...prev,
                                    [cardKey]: !prev[cardKey],
                                  }))
                                }}
                                className="text-xs text-blue-600 hover:underline mb-2 block"
                              >
                                Show more
                              </button>
                            )}
                            {isExpanded && evidence.text.split('\n').length > 3 && (
                              <button
                                onClick={() => {
                                  setExpandedCardIdx((prev) => ({
                                    ...prev,
                                    [cardKey]: !prev[cardKey],
                                  }))
                                }}
                                className="text-xs text-blue-600 hover:underline mb-2 block"
                              >
                                Show less
                              </button>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                Relevance: {Math.round(evidence.relevanceScore * 100)}%
                              </span>
                              {evidence.startTimestamp !== null && videoId && (
                                <a
                                  href={`https://youtube.com/watch?v=${videoId}&t=${Math.floor(evidence.startTimestamp)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  at {formatTime(evidence.startTimestamp)}
                                </a>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {qaHistory.length === 0 && !isLoading && (
        <p className="text-center text-gray-500">Ask a question to get started</p>
      )}
    </section>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
