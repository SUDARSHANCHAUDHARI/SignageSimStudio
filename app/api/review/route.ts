import { NextRequest, NextResponse } from 'next/server'
import { chat } from '@/lib/ai'
import type { ReviewResult } from '@/lib/types'

const SYSTEM_PROMPT = `You are a digital signage design expert. Analyze this display placement and return JSON with exactly these keys:
- score: number 0-100
- readabilityRating: one of "Poor" | "Fair" | "Good" | "Excellent"
- issues: string array of specific problems found
- recommendations: string array of actionable improvements
- customerExplanation: a single paragraph in plain English suitable for a non-technical client

Return ONLY valid JSON, no markdown, no code fences.`

interface ReviewRequest {
  templateId: string
  displayWidthPct: number
  viewingDistanceM: number
  orientation: string
  contentDescription?: string
}

function defaultResult(): ReviewResult {
  return {
    score: 72,
    readabilityRating: 'Good',
    issues: [
      'No AI key configured — showing sample review.',
      'Text legibility cannot be verified without content image analysis.',
    ],
    recommendations: [
      'Add an ANTHROPIC_API_KEY or OPENAI_API_KEY to enable live AI review.',
      'Ensure minimum font size of 2cm per metre of viewing distance.',
      'Maintain 4.5:1 contrast ratio for accessible readability.',
    ],
    customerExplanation:
      'This is a sample review generated because no AI key is configured. In production, the AI will analyse your actual content image and provide specific feedback about readability, contrast, and text sizing for the selected environment.',
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: ReviewRequest
  try {
    body = (await req.json()) as ReviewRequest
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { templateId, displayWidthPct, viewingDistanceM, orientation, contentDescription } = body

  const hasKey =
    process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY

  if (!hasKey) {
    return NextResponse.json(defaultResult())
  }

  const userMessage = `
Display placement analysis request:
- Room/environment: ${templateId}
- Display width: ${displayWidthPct}% of available wall area
- Viewing distance: ${viewingDistanceM} metres
- Orientation: ${orientation}
- Content description: ${contentDescription ?? 'Not provided — generic signage content'}

Please evaluate readability, sizing appropriateness for the viewing distance, and suitability for the environment type.
Return JSON only.`

  try {
    const raw = await chat(SYSTEM_PROMPT, userMessage)
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleaned) as ReviewResult
    return NextResponse.json(result)
  } catch (err) {
    console.error('AI review error:', err)
    return NextResponse.json(defaultResult())
  }
}
