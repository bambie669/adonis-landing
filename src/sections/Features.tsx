const FEATURES = [
  { tag: 'decode', accent: 'mint' as const, title: 'Every word. Every beat.',
    body: "Drop a URL or upload an mp4 and get a clean, timestamped transcript of the whole ad. Searchable, copy-pasteable, ready to drop straight into your own brief." },
  { tag: 'see', accent: 'orange' as const, title: 'Read every scene like a script.',
    body: "Adonis carves the ad into individual scenes, then tells you exactly what's happening in each one — who's on screen, what they're doing, what's in their hands. The visual grammar of the ad, laid out in order." },
  { tag: 'understand', accent: 'mint' as const, title: 'Get the why, not just the what.',
    body: "After the breakdown lands, you get a written blueprint: where the hook is, where the tension peaks, which beat is the CTA, why the algorithm is rewarding this exact post." },
  { tag: 'map', accent: 'orange' as const, title: 'See every ad in their ecosystem.',
    body: "Studying one ad isn't enough. Adonis pulls every sponsored post around it — same advertiser, same niche — and rolls them up so you see the cadence, the variants, the patterns nobody publishes." },
  { tag: 'connect', accent: 'mint' as const, title: 'Plug in your own accounts.',
    body: "Connect your TikTok or Meta page and your top-performing content shows up next to the competitive intel. A/B yourself against the people you're chasing — without exporting a thing." },
  { tag: 'own', accent: 'orange' as const, title: 'Yours. On your machine. Forever.',
    body: "Adonis runs on your box — not in someone else's cloud, not behind someone else's paywall. Your research stays private, your data stays yours, no monthly per-seat fee." },
]

export function Features() {
  return (
    <section id="features" className="section grid-bg">
      <div className="wrap">
        <SectionHead label="what you get" title="Reverse-engineer any ad, in minutes." />
        <div className="features__grid">
          {FEATURES.map((f) => <FeatureCard key={f.tag} {...f} />)}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ tag, title, body, accent }: { tag: string; title: string; body: string; accent: 'mint' | 'orange' }) {
  return (
    <div className="card card--lift features__card">
      <div className={`features__tag font-mono ${accent === 'orange' ? 'orange' : 'mint'}`}>{tag}</div>
      <h3 className="features__title">{title}</h3>
      <p className="features__body">{body}</p>
    </div>
  )
}

export function SectionHead({ label, title }: { label: string; title: string }) {
  return (
    <div className="section-head">
      <div className="eyebrow">{label}</div>
      <h2>{title}</h2>
      <hr className="divider-dots" />
    </div>
  )
}
