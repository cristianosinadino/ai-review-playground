/**
 * Content mode detection
 * Determines the primary mode of content based on contentType
 */

const TUTORIAL_TYPES = new Set([
  'tutorial',
  'howto',
  'how-to',
  'guide',
  'procedural',
])

const ANALYSIS_TYPES = new Set([
  'research',
  'analysis',
  'strategy',
  'opinion',
  'commentary',
])

export type ContentMode = 'tutorial' | 'analysis' | 'mixed'

/**
 * Section groups for conditional rendering
 */
export const ALWAYS_SHOW = [
  'Decision Brief',
  'Summary',
  'Detailed Summary',
  'What Matters',
  'So What',
  'Key Points',
  'Score Details',
  'Content Signals',
  'Domains',
]

export const TUTORIAL_PRIMARY = [
  'Step-by-Step Guide',
  'Prerequisites',
  'Implementation Notes',
  'Common Pitfalls',
  'Validation Checks',
  'Framework & List Breakdown',
  'Action Items',
]

export const INTELLIGENCE_PRIMARY = [
  'Mechanisms',
  'How It Works',
  'Claims & Assertions',
  'Key Risks',
  'Critiques & Gaps',
  'Contradictions',
]

/**
 * Determine content mode from contentType string
 * @param rawType - The raw contentType value from database (can be string, null, or undefined)
 * @returns 'tutorial', 'analysis', or 'mixed'
 */
export function getContentMode(rawType?: string | null): ContentMode {
  const t = (rawType ?? '').toLowerCase().trim()
  if (TUTORIAL_TYPES.has(t)) return 'tutorial'
  if (ANALYSIS_TYPES.has(t)) return 'analysis'
  return 'mixed'
}
