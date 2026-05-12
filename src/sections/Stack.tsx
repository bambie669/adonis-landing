import { SectionHeader } from './Features'

const VALUE_GROUPS = {
  'What you walk away with': [
    'A written playbook',
    'Scene-by-scene visual map',
    'Searchable transcript',
    'Ad ecosystem map',
    'Hook-by-hook timing',
    'CTA placement read',
  ],
  "What you don't deal with": [
    'No per-seat pricing',
    'No cloud lock-in',
    'No API rate limits',
    'No token budgets',
    'No leaked research',
    'No vendor roadmap drama',
  ],
  'Built for': [
    'Performance marketers',
    'Growth teams',
    'Indie founders',
    'Creative agencies',
    'Brand strategists',
    'Anyone tired of guessing',
  ],
  'The unfair part': [
    'Runs on your box',
    'Your data stays yours',
    'Yours forever',
    'Updates on your schedule',
    'Tune the voice yourself',
    'Open source, end to end',
  ],
}

export function Stack() {
  return (
    <section className="py-24 px-6 grid-bg">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="why adonis" title="Made for the people doing the work." />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(VALUE_GROUPS).map(([category, items]) => (
            <div key={category} className="card-hud rounded-lg p-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-mint-500/70 mb-4">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="text-sm font-mono text-white/80 bg-mint-500/5 border border-mint-500/15 rounded px-2 py-1"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm font-mono text-white/45 mt-12 max-w-2xl mx-auto leading-relaxed">
          One box, your box. Drop a URL, walk away, come back to a playbook.
          The research you do in Adonis is yours — not a SaaS provider's training data,
          not a competitor's audit log, not a number in someone else's pricing tier.
        </p>
      </div>
    </section>
  )
}
