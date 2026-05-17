export interface RoomTemplate {
  id: string
  name: string
  description: string
  bgClasses: string
  wallClasses: string
  accentColor: string
}

export interface DisplayConfig {
  widthPct: number
  heightPct: number
  x: number
  y: number
  orientation: 'landscape' | 'portrait'
  viewingDistanceM: number
}

export interface ReviewResult {
  score: number
  readabilityRating: 'Poor' | 'Fair' | 'Good' | 'Excellent'
  issues: string[]
  recommendations: string[]
  customerExplanation: string
}
