import { getDocumentById } from '@/lib/dummy-data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getContentMode, ALWAYS_SHOW, TUTORIAL_PRIMARY, INTELLIGENCE_PRIMARY } from '@/lib/content-mode'
import { AnalysisButton } from './analysis-button'
import { ScoreDetails } from './score-details'
import { DeleteButton } from './delete-button'
import { TranscriptSection } from './transcript-section'
import { AskThisVideo } from './ask-this-video'

export const dynamic = 'force-dynamic'

// Extract YouTube video ID from URL
function extractYouTubeVideoId(url: string): string | undefined {
  try {
    const urlObj = new URL(url)

    // Handle youtube.com/watch?v=ID
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v') || undefined
    }

    // Handle youtu.be/ID
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1) || undefined
    }
  } catch {
    // Invalid URL
  }

  return undefined
}

// Helper function to split confidence reasoning into two parts
function splitReasoningText(text: string | null | undefined) {
  if (!text) return { insight: '', novelty: '' }

  // Split on periods followed by space, filter empty parts
  const sentences = text
    .split(/\.\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)

  return {
    insight: sentences[0] ? sentences[0] + '.' : '',
    novelty: sentences[1] ? sentences[1] + '.' : '',
  }
}

export default function DocumentPage({
  params,
}: {
  params: { id: string }
}) {
  const document = getDocumentById(params.id)
  if (!document) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/library" className="text-blue-600 hover:underline">
          ← Back to Library
        </Link>
        <DeleteButton sourceId={document.source.id} />
      </div>

      <div>
        <h1 className="mb-6 text-4xl font-bold break-words max-w-full">{document.source.title}</h1>
        <div className="flex flex-wrap gap-3 text-sm">
          {document.source.sourceType && (
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-gray-700 font-medium">
              {document.source.sourceType}
            </span>
          )}
          {document.source.duration != null && document.source.duration > 0 && (
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-gray-700 font-medium">
              {Math.round(document.source.duration / 60)} minutes
            </span>
          )}
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-gray-700 font-medium">
            {new Date(document.createdAt).toLocaleDateString()}
          </span>
          {document.analysis?.confidenceScore !== null && document.analysis?.confidenceScore !== undefined && (
            <span
              className={`rounded-full px-3 py-1.5 font-semibold text-white shadow-sm ${
                document.analysis.confidenceScore >= 0.85
                  ? 'bg-green-600'
                  : document.analysis.confidenceScore >= 0.6
                    ? 'bg-amber-600'
                    : 'bg-red-600'
              }`}
            >
              {Math.round(document.analysis.confidenceScore * 100)}% confidence
            </span>
          )}
          {document.analysis?.contentType && (
            <span className="rounded-full bg-indigo-100 px-3 py-1.5 text-indigo-700 font-medium">
              {document.analysis.contentType}
            </span>
          )}
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analysis</h2>
          <AnalysisButton documentId={document.id} status={document.analysis?.status} />
        </div>

        {document.analysis && (
          <div className="mb-6 space-y-4">
            {document.analysis.decisionSummary && (
              <div className="rounded-lg bg-blue-50 p-4 border-l-4 border-l-blue-500">
                <h3 className="mb-3 text-xs font-semibold text-blue-600 uppercase tracking-wide">Decision Brief</h3>
                <p className="text-gray-800 leading-relaxed">{document.analysis.decisionSummary}</p>
              </div>
            )}

            <ScoreDetails
              transcriptScore={document.analysis.transcriptQualityScore}
              analysisScore={document.analysis.analysisQualityScore}
              modelUsed={document.analysis.modelUsed}
              modelProvider={document.analysis.modelProvider}
              scoringNotes={document.analysis.scoringNotes}
            />

            {(document.analysis.insightScore !== null || document.analysis.noveltyScore !== null) && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Content Signals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {document.analysis.insightScore !== null && (
                    <div>
                      <div className="mb-2 flex items-baseline justify-between">
                        <span className="text-sm font-medium text-gray-600">Insight Depth</span>
                        <span className="text-lg font-bold text-blue-600">
                          {Math.round(document.analysis.insightScore * 100)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-300">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{ width: `${document.analysis.insightScore * 100}%` }}
                        />
                      </div>
                      {(() => {
                        const reasoning = splitReasoningText(document.analysis.confidenceReasoning)
                        return reasoning.insight && (
                          <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                            ↳ {reasoning.insight}
                          </p>
                        )
                      })()}
                    </div>
                  )}

                  {document.analysis.noveltyScore !== null && (
                    <div>
                      <div className="mb-2 flex items-baseline justify-between">
                        <span className="text-sm font-medium text-gray-600">Novelty</span>
                        <span className="text-lg font-bold text-purple-600">
                          {Math.round(document.analysis.noveltyScore * 100)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-300">
                        <div
                          className="h-full rounded-full bg-purple-600 transition-all"
                          style={{ width: `${document.analysis.noveltyScore * 100}%` }}
                        />
                      </div>
                      {(() => {
                        const reasoning = splitReasoningText(document.analysis.confidenceReasoning)
                        return reasoning.novelty && (
                          <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                            ↳ {reasoning.novelty}
                          </p>
                        )
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {document.analysis?.status === 'completed' && (
          <div className="space-y-6">
            {/* Helper: Determine content mode and render sections in proper order with grouping */}
            {(() => {
              const mode = getContentMode(document.analysis.contentType)
              const isTutorial = mode === 'tutorial'
              const isAnalysis = mode === 'analysis'
              const isMixed = mode === 'mixed'

              // Rendering order:
              // 1. ALWAYS_SHOW sections (regardless of mode)
              // 2. PRIMARY group based on mode (tutorial/analysis/mixed equally)
              // 3. Divider (only if not mixed mode)
              // 4. SECONDARY group based on mode

              return (
                <>
                  <p className="text-sm text-gray-500 italic mb-6">
                    Each section below serves a different purpose: the summary captures what this content is about,
                    What Matters explores real-world stakes, the detailed breakdown provides supporting details and gaps,
                    and So What? describes how your thinking should change.
                  </p>

                  {/* ========================================
                      ALWAYS_SHOW SECTIONS (appear first, regardless of content mode)
                      ======================================== */}

                  {/* Summary */}
                  {document.analysis.summaryShort && (
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">Summary</h3>
                      <p className="text-gray-700">{document.analysis.summaryShort}</p>
                    </div>
                  )}

                  {/* ========================================
                      PRIMARY SECTIONS (based on content mode)
                      ======================================== */}

                  {/* TUTORIAL_PRIMARY: When mode === 'tutorial' or 'mixed' */}
                  {(isTutorial || isMixed) && (
                    <>
                      {/* Step-by-Step Guide */}
                      {document.analysis.howToSteps && Array.isArray(document.analysis.howToSteps) && document.analysis.howToSteps.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-lg font-semibold">Step-by-Step Guide</h3>
                          <div className="space-y-4">
                            {(document.analysis.howToSteps as any[]).map((step: any, idx: number) => (
                              <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div className="flex items-baseline gap-3">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-sm">
                                      {step.step_number}
                                    </span>
                                    <h4 className="font-bold text-gray-900">{step.title}</h4>
                                  </div>
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                                    step.confidence === 'high' ? 'bg-green-100 text-green-800' :
                                    step.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {step.confidence} confidence
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm mb-3">{step.instruction}</p>
                                {step.rationale && (
                                  <p className="text-gray-600 text-xs italic mb-2">
                                    <span className="font-medium">Why:</span> {step.rationale}
                                  </p>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                                  {step.ui_path && step.ui_path.length > 0 && (
                                    <div className="text-xs">
                                      <span className="font-medium text-gray-700">Path:</span>
                                      <p className="text-gray-600">{step.ui_path.join(' → ')}</p>
                                    </div>
                                  )}
                                  {step.tools_or_requirements && step.tools_or_requirements.length > 0 && (
                                    <div className="text-xs">
                                      <span className="font-medium text-gray-700">Needs:</span>
                                      <p className="text-gray-600">{step.tools_or_requirements.join(', ')}</p>
                                    </div>
                                  )}
                                  {step.expected_outcome && (
                                    <div className="text-xs col-span-full">
                                      <span className="font-medium text-gray-700">Expected outcome:</span>
                                      <p className="text-gray-600">{step.expected_outcome}</p>
                                    </div>
                                  )}
                                </div>
                                {step.confidence_reasoning && (
                                  <p className="text-gray-500 text-xs italic mt-3 pt-3 border-t border-gray-200">
                                    {step.confidence_reasoning}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Common Pitfalls */}
                      {document.analysis.commonPitfalls && Array.isArray(document.analysis.commonPitfalls) && document.analysis.commonPitfalls.length > 0 && (
                        <div>
                          <h3 className="mb-3 text-lg font-semibold">Common Pitfalls</h3>
                          <ul className="space-y-2">
                            {document.analysis.commonPitfalls.map((pitfall: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700">
                                <span className="mt-1 text-orange-600">⚠</span>
                                <span className="text-sm">{pitfall}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Validation Checks */}
                      {document.analysis.validationChecks && Array.isArray(document.analysis.validationChecks) && document.analysis.validationChecks.length > 0 && (
                        <div>
                          <h3 className="mb-3 text-lg font-semibold">Validation Checks</h3>
                          <ul className="space-y-2">
                            {document.analysis.validationChecks.map((check: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700">
                                <span className="mt-1 text-green-600">✓</span>
                                <span className="text-sm">{check}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Implementation Notes */}
                      {document.analysis.implementationNotes && (
                        <div className="rounded-lg bg-gray-100 p-4">
                          <h3 className="mb-2 text-lg font-semibold text-gray-900">Implementation Notes</h3>
                          <p className="text-gray-800 text-sm whitespace-pre-wrap">{document.analysis.implementationNotes}</p>
                        </div>
                      )}

                      {/* Framework & List Breakdown */}
                      {Array.isArray(document.analysis.keyItems) && document.analysis.keyItems.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-lg font-semibold">Framework & List Breakdown</h3>
                          <div className="space-y-3 mb-4">
                            {(document.analysis.keyItems as any[]).map((item: any, idx: number) => {
                              const qualityColors = {
                                strong: 'bg-green-100 text-green-800',
                                weak: 'bg-yellow-100 text-yellow-800',
                                incomplete: 'bg-red-100 text-red-800',
                              }
                              const colorClass = qualityColors[item.quality as keyof typeof qualityColors] || qualityColors.weak

                              return (
                                <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${colorClass}`}>
                                      {item.quality}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm mb-2">{item.explanation}</p>
                                  {item.applicability && (
                                    <p className="text-gray-600 text-xs italic">
                                      <span className="font-medium">When:</span> {item.applicability}
                                    </p>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                          {document.analysis.keyItemsSynthesis && (
                            <p className="text-gray-700 text-sm italic border-t border-gray-200 pt-4">
                              {document.analysis.keyItemsSynthesis}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action Items */}
                      {document.analysis.actionItems && document.analysis.actionItems.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">Action Items</h3>
                          <ul className="space-y-2">
                            {document.analysis.actionItems.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700">
                                <span className="mt-1 text-green-600">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  {/* Divider for secondary sections (only show if not mixed mode) */}
                  {!isMixed && (
                    <div className="my-8 border-t-2 border-gray-200 pt-8">
                      <h2 className="text-lg font-semibold text-gray-600 mb-6">Additional Analysis</h2>
                    </div>
                  )}

                  {/* INTELLIGENCE_PRIMARY: When mode === 'analysis' or 'mixed' (secondary for tutorial) */}
                  {(isAnalysis || isMixed) && (
                    <>
                      {/* Mechanisms ("How It Works") */}
                      {document.analysis.mechanisms && document.analysis.mechanisms.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">How It Works</h3>
                          <div className="space-y-3">
                            {document.analysis.mechanisms.map((mechanism: string, idx: number) => (
                              <div key={idx} className="border-l-4 border-l-blue-400 pl-4">
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  <span className="font-semibold text-gray-800">{idx + 1}.</span> {mechanism}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contradictions */}
                      {document.analysis.contradictions && document.analysis.contradictions.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">Contradictions</h3>
                          <ul className="space-y-2">
                            {document.analysis.contradictions.map((contradiction: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700">
                                <span className="mt-1 text-yellow-600">⊗</span>
                                <span>{contradiction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Key Risks */}
                      {document.analysis.keyRisks && document.analysis.keyRisks.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">Key Risks</h3>
                          <ul className="space-y-2">
                            {document.analysis.keyRisks.map((risk: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700">
                                <span className="mt-1 text-red-600">⚡</span>
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Claims & Assertions */}
                      {document.analysis.claims && document.analysis.claims.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">Claims & Assertions</h3>
                          <ul className="space-y-2">
                            {document.analysis.claims.map((claim: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700">
                                <span className="mt-1 text-purple-600">◆</span>
                                <span>{claim}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Critiques & Gaps */}
                      {document.analysis.critiques && document.analysis.critiques.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">Critiques & Gaps</h3>
                          <ul className="space-y-2">
                            {document.analysis.critiques.map((critique: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700">
                                <span className="mt-1 text-orange-600">⚠</span>
                                <span>{critique}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  {/* TUTORIAL_PRIMARY as secondary: When mode === 'analysis' (secondary) */}
                  {isAnalysis && (
                    <>
                      {/* Step-by-Step Guide (secondary for analysis content) */}
                      {document.analysis.howToSteps && Array.isArray(document.analysis.howToSteps) && document.analysis.howToSteps.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-lg font-semibold">Step-by-Step Guide</h3>
                          <div className="space-y-4">
                            {(document.analysis.howToSteps as any[]).map((step: any, idx: number) => (
                              <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div className="flex items-baseline gap-3">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-sm">
                                      {step.step_number}
                                    </span>
                                    <h4 className="font-bold text-gray-900">{step.title}</h4>
                                  </div>
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                                    step.confidence === 'high' ? 'bg-green-100 text-green-800' :
                                    step.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {step.confidence} confidence
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm mb-3">{step.instruction}</p>
                                {step.rationale && (
                                  <p className="text-gray-600 text-xs italic mb-2">
                                    <span className="font-medium">Why:</span> {step.rationale}
                                  </p>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                                  {step.ui_path && step.ui_path.length > 0 && (
                                    <div className="text-xs">
                                      <span className="font-medium text-gray-700">Path:</span>
                                      <p className="text-gray-600">{step.ui_path.join(' → ')}</p>
                                    </div>
                                  )}
                                  {step.tools_or_requirements && step.tools_or_requirements.length > 0 && (
                                    <div className="text-xs">
                                      <span className="font-medium text-gray-700">Needs:</span>
                                      <p className="text-gray-600">{step.tools_or_requirements.join(', ')}</p>
                                    </div>
                                  )}
                                  {step.expected_outcome && (
                                    <div className="text-xs col-span-full">
                                      <span className="font-medium text-gray-700">Expected outcome:</span>
                                      <p className="text-gray-600">{step.expected_outcome}</p>
                                    </div>
                                  )}
                                </div>
                                {step.confidence_reasoning && (
                                  <p className="text-gray-500 text-xs italic mt-3 pt-3 border-t border-gray-200">
                                    {step.confidence_reasoning}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Common Pitfalls (secondary for analysis) */}
                      {document.analysis.commonPitfalls && Array.isArray(document.analysis.commonPitfalls) && document.analysis.commonPitfalls.length > 0 && (
                        <div>
                          <h3 className="mb-3 text-lg font-semibold">Common Pitfalls</h3>
                          <ul className="space-y-2">
                            {document.analysis.commonPitfalls.map((pitfall: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700">
                                <span className="mt-1 text-orange-600">⚠</span>
                                <span className="text-sm">{pitfall}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Validation Checks (secondary for analysis) */}
                      {document.analysis.validationChecks && Array.isArray(document.analysis.validationChecks) && document.analysis.validationChecks.length > 0 && (
                        <div>
                          <h3 className="mb-3 text-lg font-semibold">Validation Checks</h3>
                          <ul className="space-y-2">
                            {document.analysis.validationChecks.map((check: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700">
                                <span className="mt-1 text-green-600">✓</span>
                                <span className="text-sm">{check}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Implementation Notes (secondary for analysis) */}
                      {document.analysis.implementationNotes && (
                        <div className="rounded-lg bg-gray-100 p-4">
                          <h3 className="mb-2 text-lg font-semibold text-gray-900">Implementation Notes</h3>
                          <p className="text-gray-800 text-sm whitespace-pre-wrap">{document.analysis.implementationNotes}</p>
                        </div>
                      )}

                      {/* Framework & List Breakdown (secondary for analysis) */}
                      {Array.isArray(document.analysis.keyItems) && document.analysis.keyItems.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-lg font-semibold">Framework & List Breakdown</h3>
                          <div className="space-y-3 mb-4">
                            {(document.analysis.keyItems as any[]).map((item: any, idx: number) => {
                              const qualityColors = {
                                strong: 'bg-green-100 text-green-800',
                                weak: 'bg-yellow-100 text-yellow-800',
                                incomplete: 'bg-red-100 text-red-800',
                              }
                              const colorClass = qualityColors[item.quality as keyof typeof qualityColors] || qualityColors.weak

                              return (
                                <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${colorClass}`}>
                                      {item.quality}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm mb-2">{item.explanation}</p>
                                  {item.applicability && (
                                    <p className="text-gray-600 text-xs italic">
                                      <span className="font-medium">When:</span> {item.applicability}
                                    </p>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                          {document.analysis.keyItemsSynthesis && (
                            <p className="text-gray-700 text-sm italic border-t border-gray-200 pt-4">
                              {document.analysis.keyItemsSynthesis}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action Items (secondary for analysis) */}
                      {document.analysis.actionItems && document.analysis.actionItems.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">Action Items</h3>
                          <ul className="space-y-2">
                            {document.analysis.actionItems.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700">
                                <span className="mt-1 text-green-600">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  {/* ========================================
                      ALWAYS_SHOW SECTIONS (continued)
                      ======================================== */}
                  {document.analysis.summaryDetailed && (
                    <details className="group">
                      <summary className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer select-none list-none">
                        <span>View Full Breakdown</span>
                        <span className="text-gray-400 transition-transform group-open:rotate-90">
                          ›
                        </span>
                      </summary>
                      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{document.analysis.summaryDetailed}</p>
                      </div>
                    </details>
                  )}

                  {document.analysis.whatMatters && (
                    <div className="rounded-lg bg-blue-50 p-4 border-l-4 border-l-blue-600">
                      <h3 className="mb-2 text-lg font-semibold text-blue-900">What Matters</h3>
                      <p className="whitespace-pre-wrap text-blue-800">{document.analysis.whatMatters}</p>
                    </div>
                  )}

                  {document.analysis.soWhat && (
                    <div className="rounded-lg bg-amber-50 p-4 border-l-4 border-l-amber-600">
                      <h3 className="mb-2 text-lg font-semibold text-amber-900">So What?</h3>
                      <p className="whitespace-pre-wrap text-amber-800">{document.analysis.soWhat}</p>
                    </div>
                  )}

                  {document.analysis.keyPoints && document.analysis.keyPoints.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">Key Points</h3>
                      <ul className="space-y-2">
                        {document.analysis.keyPoints.map((point: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700">
                            <span className="mt-1 text-blue-600">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {document.analysis.domains && document.analysis.domains.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-lg font-semibold">Domains</h3>
                      <div className="flex flex-wrap gap-2">
                        {document.analysis.domains.map((domain: string, idx: number) => {
                          const colors = [
                            'bg-blue-100 text-blue-800',
                            'bg-purple-100 text-purple-800',
                            'bg-pink-100 text-pink-800',
                            'bg-cyan-100 text-cyan-800',
                            'bg-emerald-100 text-emerald-800',
                            'bg-amber-100 text-amber-800',
                            'bg-rose-100 text-rose-800',
                            'bg-indigo-100 text-indigo-800',
                          ]
                          const colorClass = colors[idx % colors.length]
                          return (
                            <span
                              key={domain}
                              className={`rounded-full px-3 py-1.5 text-sm font-medium ${colorClass}`}
                            >
                              {domain}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        )}

        {document.analysis?.status === 'processing' && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
            <div className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></span>
              Analysis is being generated...
            </div>
          </div>
        )}

        {document.analysis?.status === 'failed' && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <p className="font-semibold">Analysis Failed</p>
            {document.analysis.message && (
              <p className="mt-1 text-sm">{document.analysis.message}</p>
            )}
          </div>
        )}

        {!document.analysis && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-600">
            No analysis yet. Click &quot;Run Analysis&quot; to get started.
          </div>
        )}
      </section>

      {/* Ask This Video Section */}
      {document.cleanText && document.analysis && document.analysis.status === 'completed' && document.transcriptAvailable && (
        <AskThisVideo
          documentId={document.id}
          videoId={extractYouTubeVideoId(document.source.url)}
          keyItems={document.analysis?.keyItems as any[] | undefined}
          mechanisms={document.analysis?.mechanisms as string[] | undefined}
        />
      )}

      {document.cleanText && <TranscriptSection transcript={document.cleanText} />}

      {!document.cleanText && (
        <section className="rounded-lg border border-yellow-200 bg-yellow-50 p-8 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-yellow-900">No Transcript Available</h2>
          <p className="text-yellow-800">
            This video does not have captions or subtitles available. Transcript extraction failed.
          </p>
          <p className="mt-4 text-sm text-yellow-700">
            For analysis to work best, videos with captions are preferred. Check the video details
            to ensure captions are enabled.
          </p>
        </section>
      )}
    </div>
  )
}
