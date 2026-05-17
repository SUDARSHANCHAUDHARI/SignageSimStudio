import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight text-white">
          SignageSimStudio
        </span>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/templates" className="hover:text-white transition-colors">
            Templates
          </Link>
          <Link
            href="/simulator"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md font-medium transition-colors"
          >
            Open Simulator
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-widest">
            Phase 1 MVP — 2D Simulator
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Preview your signage
            <br />
            <span className="text-indigo-400">before you deploy.</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Upload content, pick a room, adjust the display — see exactly how it will look in the
            real environment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/simulator"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-lg font-semibold text-lg transition-colors"
            >
              Open Simulator
            </Link>
            <Link
              href="/templates"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-lg font-semibold text-lg transition-colors"
            >
              View Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="border-t border-white/10 px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon="🏪"
            title="10 Room Templates"
            description="Retail stores, restaurants, offices, airports, hospitals, gyms, hotels, and more — each with distinct lighting and colour environments."
          />
          <FeatureCard
            icon="🤖"
            title="AI Readability Review"
            description="Get a 0-100 score, specific issues, and actionable recommendations from an AI signage expert. Works with Claude or GPT-4o."
          />
          <FeatureCard
            icon="📸"
            title="Export Preview Image"
            description="Capture the simulation as a PNG and share it with your client or team. Perfect for pitch decks and sign-off before production."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-gray-600">
        SignageSimStudio — Phase 1 MVP. Phase 2 will add Three.js 3D environments.
      </footer>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-indigo-500/40 transition-colors">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}
