'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { ROOM_TEMPLATES } from '@/lib/templates'
import type { DisplayConfig, ReviewResult, RoomTemplate } from '@/lib/types'

const PRESETS: { label: string; widthPct: number }[] = [
  { label: '32"', widthPct: 22 },
  { label: '43"', widthPct: 30 },
  { label: '55"', widthPct: 38 },
  { label: '65"', widthPct: 46 },
  { label: '86"', widthPct: 60 },
]

function computeHeightPct(widthPct: number, orientation: 'landscape' | 'portrait'): number {
  // 16:9 aspect ratio
  const ratio = orientation === 'landscape' ? 9 / 16 : 16 / 9
  return widthPct * ratio
}

function ratingColor(rating: ReviewResult['readabilityRating']): string {
  switch (rating) {
    case 'Poor':
      return 'text-red-400'
    case 'Fair':
      return 'text-yellow-400'
    case 'Good':
      return 'text-green-400'
    case 'Excellent':
      return 'text-emerald-400'
  }
}

function scoreColor(score: number): string {
  if (score < 40) return 'text-red-400'
  if (score < 70) return 'text-yellow-400'
  return 'text-green-400'
}

export default function SimulatorPage() {
  const [template, setTemplate] = useState<RoomTemplate>(ROOM_TEMPLATES[0])
  const [contentImage, setContentImage] = useState<string | null>(null)
  const [config, setConfig] = useState<DisplayConfig>({
    widthPct: 38,
    heightPct: computeHeightPct(38, 'landscape'),
    x: 50,
    y: 50,
    orientation: 'landscape',
    viewingDistanceM: 3,
  })
  const [review, setReview] = useState<ReviewResult | null>(null)
  const [reviewing, setReviewing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [contentDescription, setContentDescription] = useState('')

  const canvasRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ mouseX: 0, mouseY: 0, displayX: 0, displayY: 0 })

  // File upload
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setContentImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setContentImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  // Drag display
  const handleDisplayMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      isDragging.current = true
      dragStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        displayX: config.x,
        displayY: config.y,
      }

      const onMove = (ev: MouseEvent) => {
        if (!isDragging.current || !canvasRef.current) return
        const rect = canvasRef.current.getBoundingClientRect()
        const wallWidth = rect.width * 0.6
        const wallHeight = rect.height

        const dxPx = ev.clientX - dragStart.current.mouseX
        const dyPx = ev.clientY - dragStart.current.mouseY

        const dxPct = (dxPx / wallWidth) * 100
        const dyPct = (dyPx / wallHeight) * 100

        setConfig((prev) => ({
          ...prev,
          x: Math.max(5, Math.min(95, dragStart.current.displayX + dxPct)),
          y: Math.max(5, Math.min(95, dragStart.current.displayY + dyPct)),
        }))
      }

      const onUp = () => {
        isDragging.current = false
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [config.x, config.y],
  )

  const setPreset = useCallback(
    (widthPct: number) => {
      setConfig((prev) => ({
        ...prev,
        widthPct,
        heightPct: computeHeightPct(widthPct, prev.orientation),
      }))
    },
    [],
  )

  const toggleOrientation = useCallback(() => {
    setConfig((prev) => {
      const next = prev.orientation === 'landscape' ? 'portrait' : 'landscape'
      return {
        ...prev,
        orientation: next,
        heightPct: computeHeightPct(prev.widthPct, next),
      }
    })
  }, [])

  const handleReview = useCallback(async () => {
    setReviewing(true)
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          displayWidthPct: config.widthPct,
          viewingDistanceM: config.viewingDistanceM,
          orientation: config.orientation,
          contentDescription: contentDescription || undefined,
        }),
      })
      const data = (await res.json()) as ReviewResult
      setReview(data)
    } catch {
      // silent fail — keep previous review
    } finally {
      setReviewing(false)
    }
  }, [template, config, contentDescription])

  const handleExport = useCallback(async () => {
    if (!canvasRef.current) return
    setExporting(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: null,
      })
      const link = document.createElement('a')
      link.download = `signsim-${template.id}-preview.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [template])

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex-none border-b border-white/10 px-4 py-3 flex items-center justify-between bg-gray-900">
        <Link href="/" className="text-sm font-bold tracking-tight text-white">
          SignSim<span className="text-indigo-400">Studio</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: template.accentColor }}
          />
          {template.name}
        </div>
        <Link href="/templates" className="text-xs text-gray-500 hover:text-white transition-colors">
          Templates
        </Link>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        <aside className="w-72 flex-none border-r border-white/10 bg-gray-900 flex flex-col overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Content upload */}
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Content
              </h2>
              <label
                className="block border-2 border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-500/50 transition-colors group"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {contentImage ? (
                  <img
                    src={contentImage}
                    alt="Uploaded content"
                    className="max-h-24 mx-auto rounded object-contain"
                  />
                ) : (
                  <div className="py-4">
                    <div className="text-2xl mb-2">+</div>
                    <p className="text-xs text-gray-500 group-hover:text-gray-400">
                      Drop image or click to upload
                    </p>
                  </div>
                )}
              </label>
              {contentImage && (
                <button
                  onClick={() => setContentImage(null)}
                  className="mt-2 text-xs text-gray-600 hover:text-gray-400 transition-colors w-full text-center"
                >
                  Remove image
                </button>
              )}
            </section>

            {/* Template selector */}
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Room Template
              </h2>
              <div className="grid grid-cols-2 gap-1.5">
                {ROOM_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t)}
                    className={`flex flex-col items-start p-2 rounded-lg border transition-all text-left ${
                      template.id === t.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <div className={`w-full h-8 rounded mb-1.5 ${t.bgClasses}`} />
                    <span className="text-xs text-gray-300 leading-tight">{t.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Display size */}
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Display Size
              </h2>
              <div className="flex gap-1.5 flex-wrap">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setPreset(p.widthPct)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      config.widthPct === p.widthPct
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Orientation */}
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Orientation
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => config.orientation !== 'landscape' && toggleOrientation()}
                  className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${
                    config.orientation === 'landscape'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Landscape
                </button>
                <button
                  onClick={() => config.orientation !== 'portrait' && toggleOrientation()}
                  className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${
                    config.orientation === 'portrait'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Portrait
                </button>
              </div>
            </section>

            {/* Viewing distance */}
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Viewing Distance
              </h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">1m</span>
                <span className="text-sm font-semibold text-white">
                  {config.viewingDistanceM}m
                </span>
                <span className="text-xs text-gray-500">10m</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={config.viewingDistanceM}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    viewingDistanceM: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-indigo-500"
              />
              <p className="text-xs text-gray-600 mt-1">
                Recommended font: {Math.round(config.viewingDistanceM * 2)}cm minimum
              </p>
            </section>

            {/* Content description (optional, for AI) */}
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Content Description
                <span className="ml-1 text-gray-600 normal-case tracking-normal font-normal">
                  (optional, for AI)
                </span>
              </h2>
              <textarea
                value={contentDescription}
                onChange={(e) => setContentDescription(e.target.value)}
                placeholder="e.g. Burger menu board with large text prices and food photography"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-gray-300 placeholder-gray-600 resize-none h-16 focus:outline-none focus:border-indigo-500/50"
              />
            </section>

            {/* Action buttons */}
            <section className="space-y-2 pb-4">
              <button
                onClick={handleReview}
                disabled={reviewing}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                {reviewing ? 'Reviewing...' : 'Get AI Review'}
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {exporting ? 'Exporting...' : 'Export Preview'}
              </button>
            </section>
          </div>
        </aside>

        {/* Simulation canvas */}
        <main className="flex-1 overflow-hidden" ref={canvasRef}>
          <SimulationCanvas
            template={template}
            config={config}
            contentImage={contentImage}
            onDisplayMouseDown={handleDisplayMouseDown}
          />
        </main>

        {/* Right panel — review results */}
        {review && (
          <aside className="w-80 flex-none border-l border-white/10 bg-gray-900 overflow-y-auto">
            <ReviewPanel review={review} accentColor={template.accentColor} onClose={() => setReview(null)} />
          </aside>
        )}
      </div>
    </div>
  )
}

function SimulationCanvas({
  template,
  config,
  contentImage,
  onDisplayMouseDown,
}: {
  template: RoomTemplate
  config: DisplayConfig
  contentImage: string | null
  onDisplayMouseDown: (e: React.MouseEvent) => void
}) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${template.bgClasses} relative overflow-hidden`}>
      {/* Ambient room floor shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-black/30" />

      {/* Wall area */}
      <div
        className={`relative ${template.wallClasses} rounded-sm`}
        style={{ width: '60%', height: '75%' }}
      >
        {/* Wall texture lines */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full border-t border-white"
              style={{ top: `${(i + 1) * 12.5}%` }}
            />
          ))}
        </div>

        {/* Display */}
        <div
          className="absolute draggable"
          style={{
            left: `${config.x}%`,
            top: `${config.y}%`,
            width: `${config.widthPct}%`,
            paddingBottom: `${config.heightPct}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onMouseDown={onDisplayMouseDown}
        >
          <div className="absolute inset-0 rounded-sm overflow-hidden border-4 border-gray-700 shadow-2xl shadow-black/80">
            {/* Bezel */}
            <div className="absolute inset-0 border-2 border-black/50 rounded-sm z-10 pointer-events-none" />

            {/* Content */}
            {contentImage ? (
              <img
                src={contentImage}
                alt="Signage content"
                className="w-full h-full object-fill"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-center p-4">
                <div className="text-white/20 text-4xl mb-2">+</div>
                <p className="text-white/30 text-xs">Upload content</p>
              </div>
            )}

            {/* Screen glare overlay */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Drag hint */}
        <div className="absolute bottom-2 right-2 text-xs text-white/20 select-none">
          Drag to reposition
        </div>
      </div>

      {/* Distance indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-white/40">
        <div className="w-8 border-t border-dashed border-white/20" />
        Viewing distance: {config.viewingDistanceM}m
        <div className="w-8 border-t border-dashed border-white/20" />
      </div>
    </div>
  )
}

function ReviewPanel({
  review,
  accentColor,
  onClose,
}: {
  review: ReviewResult
  accentColor: string
  onClose: () => void
}) {
  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">AI Review</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-lg leading-none">
          &times;
        </button>
      </div>

      {/* Score */}
      <div className="text-center py-4">
        <div className={`text-7xl font-bold ${scoreColor(review.score)}`}>{review.score}</div>
        <div className="text-xs text-gray-500 mt-1">/ 100</div>
        <div
          className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
            review.readabilityRating === 'Poor'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : review.readabilityRating === 'Fair'
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                : review.readabilityRating === 'Good'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}
        >
          {review.readabilityRating}
        </div>
      </div>

      {/* Issues */}
      {review.issues.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Issues
          </h3>
          <ul className="space-y-1.5">
            {review.issues.map((issue, i) => (
              <li key={i} className="flex gap-2 text-xs text-gray-400">
                <span className="text-red-500 mt-0.5 flex-none">!</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {review.recommendations.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Recommendations
          </h3>
          <ul className="space-y-1.5">
            {review.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-2 text-xs text-gray-400">
                <span className="flex-none" style={{ color: accentColor }}>
                  &#10003;
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Customer explanation */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Summary
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed">{review.customerExplanation}</p>
      </div>
    </div>
  )
}
