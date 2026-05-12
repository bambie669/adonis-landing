import { SectionHeader } from './Features'

const STACK = {
  Backend: ['FastAPI', 'Celery 5', 'PostgreSQL 15', 'Redis 7', 'SQLAlchemy 2', 'Pydantic 2'],
  ML: ['PyTorch 2.5+cu121', 'OpenAI Whisper', 'YOLOv8x (Ultralytics)', 'CLIP (HF)', 'VideoMAE', 'RetinaFace', 'EasyOCR'],
  Frontend: ['React 19', 'Vite 6', 'TanStack Router', 'TanStack Query', 'Zustand', 'Tailwind v4', 'WebGL shaders'],
  Scraping: ['Patchright', 'ADB (Android automation)', 'Anti-detection profiles', 'Account pooling', 'Session warmup'],
  Integrations: ['TikTok Display API', 'TikTok Login Kit', 'Meta Graph API', 'Gemini (google-genai)', 'Cloudflare Tunnel'],
  Ops: ['Docker (Postgres + Redis)', 'Self-hosted Sentry', 'APScheduler', 'Hive-partitioned Parquet'],
}

export function Stack() {
  return (
    <section className="py-24 px-6 grid-bg">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="under the hood" title="The stack" />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(STACK).map(([category, items]) => (
            <div key={category} className="card-hud rounded-lg p-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-mint-500/70 mb-4">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="text-sm font-mono text-white/75 bg-mint-500/5 border border-mint-500/15 rounded px-2 py-1"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm font-mono text-white/40 mt-12 max-w-2xl mx-auto leading-relaxed">
          Everything runs on a single Windows / Linux box. Docker for Postgres + Redis,
          Python venv for the rest. Optional cluster mode splits CPU / GPU / coordinator
          duties across machines via the built-in node registry.
        </p>
      </div>
    </section>
  )
}
