export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-mint-500/30 text-mint-500 text-xs font-mono uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-mint-500 status-live" />
          on-device · GPU-accelerated · self-hosted
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6">
          <span className="block text-white/95">Video intelligence,</span>
          <span className="block glow-mint text-mint-500">on your box.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-10">
          Adonis ingests YouTube, Instagram, Facebook and TikTok videos, transcribes
          them with Whisper on your GPU, dissects every scene with YOLOv8x + CLIP +
          VideoMAE, and writes a Gemini-authored blueprint of why the post works.
          Then it scrapes the ad ecosystem they live in.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <a
            href="https://github.com/cristidan94/adonis-smart-ads"
            target="_blank"
            rel="noreferrer"
            className="btn-hud px-6 py-3 rounded-md bg-accent-500 hover:bg-accent-600 text-white font-medium tracking-wide"
          >
            View on GitHub →
          </a>
          <a
            href="#pipeline"
            className="btn-hud px-6 py-3 rounded-md border border-mint-500/30 text-mint-500 hover:bg-mint-500/10 font-medium tracking-wide"
          >
            How it works
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-left">
          <Stat label="Models" value="6+" detail="Whisper · YOLOv8x · CLIP · VideoMAE · MTCNN · Gemini" />
          <Stat label="Platforms" value="4" detail="YouTube · Instagram · Facebook · TikTok" />
          <Stat label="Queues" value="5" detail="Celery: preprocess · extract · filter · analyse · transcribe" />
          <Stat label="Storage" value="Local" detail="Postgres · Parquet · jobs.json — no cloud" />
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="hud-frame p-4">
      <div className="text-xs font-mono uppercase tracking-widest text-mint-500/70 mb-1">{label}</div>
      <div className="font-serif text-3xl text-white/95 mb-1">{value}</div>
      <div className="text-xs text-white/45 leading-snug">{detail}</div>
    </div>
  )
}
