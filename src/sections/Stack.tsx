import { SectionHead } from './Features'

const VALUE_GROUPS: Record<string, string[]> = {
  'What you walk away with': ['A written playbook', 'Scene-by-scene visual map', 'Searchable transcript', 'Ad ecosystem map', 'Hook-by-hook timing', 'CTA placement read'],
  "What you don't deal with": ['No per-seat pricing', 'No cloud lock-in', 'No API rate limits', 'No token budgets', 'No leaked research', 'No vendor roadmap drama'],
  'Built for': ['Performance marketers', 'Growth teams', 'Indie founders', 'Creative agencies', 'Brand strategists', 'Anyone tired of guessing'],
  'The unfair part': ['Runs on your box', 'Your data stays yours', 'Yours forever', 'Updates on your schedule', 'Tune the voice yourself', 'Open source, end to end'],
}

export function Stack() {
  return (
    <section id="why" className="section">
      <div className="wrap stack__wrap">
        <SectionHead label="why adonis" title="Made for the people doing the work." />
        <div className="stack__grid">
          {Object.entries(VALUE_GROUPS).map(([category, items]) => (
            <div key={category} className="card stack__card">
              <h3 className="stack__cat">{category}</h3>
              <div className="stack__items">
                {items.map((item) => <span key={item} className="tag tag--neutral">{item}</span>)}
              </div>
            </div>
          ))}
        </div>
        <p className="stack__closer">
          One box, your box. Drop a URL, walk away, come back to a playbook.
          The research you do in Adonis is yours — not a SaaS provider's training data,
          not a competitor's audit log, not a number in someone else's pricing tier.
        </p>
      </div>
    </section>
  )
}
