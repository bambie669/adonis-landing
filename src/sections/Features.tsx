const FEATURES = [
  {
    tag: 'decode',
    title: 'Every word. Every beat.',
    body:
      "Drop a URL or upload an mp4 and you get a clean, timestamped transcript of the whole ad. Searchable, copy-pasteable, ready to drop straight into your own brief.",
    accent: 'mint' as const,
  },
  {
    tag: 'see',
    title: 'Read every scene like a script.',
    body:
      "Adonis carves the ad into individual scenes, then tells you exactly what's happening in each one — who's on screen, what they're doing, what's in their hands, what's on the wall behind them. The visual grammar of the ad, laid out in order.",
    accent: 'orange' as const,
  },
  {
    tag: 'understand',
    title: 'Get the why, not just the what.',
    body:
      "After the breakdown lands, you get a written blueprint: where the hook is, where the tension peaks, which beat is the call to action, why the algorithm is rewarding this exact post. The kind of teardown a senior strategist would charge a few grand for.",
    accent: 'mint' as const,
  },
  {
    tag: 'map',
    title: 'See every ad in their ecosystem.',
    body:
      "Studying one ad isn't enough. Adonis pulls every sponsored post around it — same advertiser, same niche, same target audience — and rolls them up so you see the cadence, the variants, the patterns nobody publishes.",
    accent: 'orange' as const,
  },
  {
    tag: 'connect',
    title: 'Plug in your own accounts.',
    body:
      "Connect your TikTok or Meta page and your top-performing content shows up next to the competitive intel. Now you can A/B yourself against the people you're chasing — without exporting a thing.",
    accent: 'mint' as const,
  },
  {
    tag: 'own',
    title: 'Yours. On your machine. Forever.',
    body:
      "Adonis runs on your box — not in someone else's cloud, not behind someone else's paywall. Your research stays private, your data stays yours, and there's no monthly per-seat fee eating into your ad budget.",
    accent: 'orange' as const,
  },
]

export function Features() {
  return (
    <section className="py-24 px-6 grid-bg">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="what you get" title="Reverse-engineer any ad, in minutes." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {FEATURES.map((f) => (
            <FeatureCard key={f.tag} {...f} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  tag,
  title,
  body,
  accent,
}: {
  tag: string
  title: string
  body: string
  accent: 'mint' | 'orange'
}) {
  const accentColor = accent === 'mint' ? 'text-mint-500' : 'text-accent-500'
  return (
    <div className="card-hud rounded-lg p-6 h-full">
      <div className={`text-xs font-mono uppercase tracking-widest mb-3 ${accentColor}`}>
        {tag}
      </div>
      <h3 className="font-serif text-2xl text-white/95 mb-3">{title}</h3>
      <p className="text-sm text-white/65 leading-relaxed">{body}</p>
    </div>
  )
}

export function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="text-center">
      <div className="inline-block text-xs font-mono uppercase tracking-widest text-mint-500/70 mb-3">
        {label}
      </div>
      <h2 className="font-serif text-4xl md:text-5xl text-white/95">{title}</h2>
      <hr className="divider-dots max-w-xs mx-auto mt-6" />
    </div>
  )
}
