// Shared types — mirrors Prisma schema exactly

export interface Source {
  id: string
  url: string
  sourceType: string
  title: string
  description?: string | null
  duration?: number | null
  thumbnail?: string | null
  metadata?: Record<string, unknown> | null
  ingestionStatus: string
  createdAt: Date
  updatedAt: Date
}

export interface HowToStep {
  step_number: number
  title: string
  instruction: string
  rationale?: string
  ui_path?: string[]
  tools_or_requirements?: string[]
  expected_outcome?: string
  confidence: 'high' | 'medium' | 'low'
  confidence_reasoning?: string
}

export interface KeyItem {
  title: string
  explanation: string
  applicability?: string
  quality: 'strong' | 'weak' | 'incomplete'
}

export interface Analysis {
  id: string
  documentId: string
  summaryShort?: string | null
  summaryDetailed?: string | null
  keyPoints: string[]
  claims: string[]
  critiques: string[]
  actionItems: string[]
  domains: string[]
  assumptions: string[]
  contrarians: string[]
  entities?: Record<string, unknown> | null
  whatMatters?: string | null
  soWhat?: string | null
  mechanisms: string[]
  keyRisks: string[]
  contradictions: string[]
  keyItems?: KeyItem[] | null
  keyItemsSynthesis?: string | null
  decisionSummary?: string | null
  insightScore?: number | null
  noveltyScore?: number | null
  confidenceNote?: string | null
  confidenceReasoning?: string | null
  contentType?: string | null
  contentTypeReasoning?: string | null
  tutorialGoal?: string | null
  prerequisites?: string[] | null
  howToSteps?: HowToStep[] | null
  implementationNotes?: string | null
  commonPitfalls: string[]
  validationChecks: string[]
  status: string
  message?: string | null
  error?: string | null
  transcriptQualityScore?: number | null
  analysisQualityScore?: number | null
  confidenceScore?: number | null
  modelUsed?: string | null
  modelProvider?: string | null
  scoringNotes: string[]
  retryCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  sourceId: string
  source: Source
  rawTranscript?: string | null
  cleanText?: string | null
  transcriptAvailable: boolean
  transcriptLanguage?: string | null
  analysis?: Analysis | null
  createdAt: Date
  updatedAt: Date
}
