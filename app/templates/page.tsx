import Link from 'next/link'
import { ROOM_TEMPLATES } from '@/lib/templates'

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-gray-950">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          SignageSimStudio
        </Link>
        <Link
          href="/simulator"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          Open Simulator
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Room Templates</h1>
          <p className="text-gray-400">
            10 distinct environments for testing your digital signage placement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {ROOM_TEMPLATES.map((template) => (
            <Link
              key={template.id}
              href={`/simulator?template=${template.id}`}
              className="group border border-white/10 rounded-xl overflow-hidden hover:border-indigo-500/40 transition-all"
            >
              {/* Preview swatch */}
              <div className={`${template.bgClasses} h-32 relative`}>
                {/* Wall representation */}
                <div
                  className={`absolute inset-x-8 inset-y-4 ${template.wallClasses} rounded-sm opacity-70`}
                />
                {/* Simulated display */}
                <div
                  className="absolute bg-gray-900 rounded-sm border border-gray-600"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: '40%',
                    height: '25%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      className="w-3/4 h-1.5 rounded-full opacity-60"
                      style={{ backgroundColor: template.accentColor }}
                    />
                  </div>
                </div>
                {/* Accent badge */}
                <div
                  className="absolute top-2 right-2 w-3 h-3 rounded-full opacity-80"
                  style={{ backgroundColor: template.accentColor }}
                />
              </div>

              {/* Info */}
              <div className="bg-gray-900 p-4">
                <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{template.description}</p>
                <div className="mt-3 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open in simulator
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
