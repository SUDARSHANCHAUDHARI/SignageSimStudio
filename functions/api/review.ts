// Cloudflare Pages Function — serves POST /api/review.
// Ported from the former Next.js route handler (app/api/review/route.ts) so the
// app can be a static export + Functions on Cloudflare Pages.
import { chat, type AIProvider } from '../../lib/ai'
import type { ReviewResult } from '../../lib/types'

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

const MAX_CONTENT_DESCRIPTION_CHARS = 2_000
const ALLOWED_ORIENTATIONS = new Set(['landscape', 'portrait'])

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function defaultResult(): ReviewResult {
  return {
    score: 72,
    readabilityRating: 'Good',
    issues: [
      'No API key set — showing sample review.',
      'Text legibility cannot be verified without content image analysis.',
    ],
    recommendations: [
      'Add your own API key in Settings to enable live AI review.',
      'Ensure minimum font size of 2cm per metre of viewing distance.',
      'Maintain 4.5:1 contrast ratio for accessible readability.',
    ],
    customerExplanation:
      'This is a sample review generated because no AI key is configured. In production, the AI will analyse your actual content image and provide specific feedback about readability, contrast, and text sizing for the selected environment.',
  }
}

export const onRequestPost = async (context: { request: Request }): Promise<Response> => {
  const req = context.request

  let body: ReviewRequest
  try {
    body = (await req.json()) as ReviewRequest
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const { templateId, displayWidthPct, viewingDistanceM, orientation, contentDescription } = body
  if (!templateId || typeof templateId !== 'string') {
    return json({ error: 'templateId is required' }, 400)
  }
  if (!ALLOWED_ORIENTATIONS.has(orientation)) {
    return json({ error: 'orientation must be landscape or portrait' }, 400)
  }
  if (typeof displayWidthPct !== 'number' || displayWidthPct < 5 || displayWidthPct > 95) {
    return json({ error: 'displayWidthPct must be between 5 and 95' }, 400)
  }
  if (typeof viewingDistanceM !== 'number' || viewingDistanceM < 1 || viewingDistanceM > 20) {
    return json({ error: 'viewingDistanceM must be between 1 and 20' }, 400)
  }
  if (contentDescription && contentDescription.length > MAX_CONTENT_DESCRIPTION_CHARS) {
    return json({ error: `contentDescription must be ${MAX_CONTENT_DESCRIPTION_CHARS} characters or fewer` }, 413)
  }

  // Bring-your-own-key: supplied by the user per request, never stored server-side.
  const apiKey = req.headers.get('x-api-key') ?? ''
  const provider: AIProvider = req.headers.get('x-ai-provider') === 'openai' ? 'openai' : 'claude'

  if (!apiKey) {
    return json(defaultResult())
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
    const raw = await chat(SYSTEM_PROMPT, userMessage, { provider, apiKey })
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleaned) as ReviewResult
    return json(result)
  } catch (err) {
    console.error('AI review error:', err)
    return json(defaultResult())
  }
}
