const FEATURES = [
  {
    tag: 'transcribe',
    title: 'Whisper, on your card',
    body:
      'Drop a YouTube short, an IG reel, a TikTok URL or upload an mp4. Whisper-small/medium/large transcribes it locally on your GPU. No third-party round-trip, no token budget, no rate limits.',
    accent: 'mint' as const,
  },
  {
    tag: 'see',
    title: 'Scene-by-scene visual analysis',
    body:
      'FFmpeg detects scene boundaries; the 4-stage Celery chain runs YOLOv8x (objects), CLIP (semantic similarity), VideoMAE (action), RetinaFace (people) and EasyOCR (on-screen text) on every keyframe. Results land in Hive-partitioned Parquet.',
    accent: 'orange' as const,
  },
  {
    tag: 'understand',
    title: 'AI blueprints',
    body:
      "After the pipeline lands, Gemini reads the transcript + scene timeline and writes a 'Blueprint' — what's the hook, what's the visual rhythm, which beat is the CTA, why does the post pull engagement. Override the prompt per role to match your voice.",
    accent: 'mint' as const,
  },
  {
    tag: 'scrape',
    title: 'Ad intelligence pool',
    body:
      'The same box hosts an ADB-driven Facebook / Instagram / TikTok scraper with anti-detection, session warmup, and a workspace-scoped account pool. Sponsored posts get fingerprinted, deduped, and rolled up by advertiser frequency.',
    accent: 'orange' as const,
  },
  {
    tag: 'connect',
    title: 'TikTok Display + Meta Graph',
    body:
      'OAuth flows for read-only TikTok own-content (user.info.basic + video.list) and Meta Page sync via Graph API. Encrypted at rest (Fernet). Quad-source ground-truth validated against ADB and TikHub.',
    accent: 'mint' as const,
  },
  {
    tag: 'orchestrate',
    title: 'Self-hosted, modular monolith',
    body:
      'FastAPI + Celery + PostgreSQL + Redis on one machine — or split across CPU / GPU / coordinator nodes via the cluster controller. Five subsystems (connectors, identity, pipeline, creative, signals) with narrow public surfaces, fast per-subsystem tests.',
    accent: 'orange' as const,
  },
]

export function Features() {
  return (
    <section className="py-24 px-6 grid-bg">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="capabilities" title="What it does" />
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
      <p className="text-sm text-white/60 leading-relaxed">{body}</p>
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
