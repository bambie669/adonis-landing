import { SectionHeader } from './Features'

const STAGES = [
  {
    n: '01',
    title: 'Ingest',
    sub: 'yt-dlp + ffmpeg',
    body: 'Download audio + video from YouTube / IG / FB / TikTok. Probe metadata. Persist the source row.',
  },
  {
    n: '02',
    title: 'Preprocess',
    sub: 'queue · video_preprocessing',
    body: 'FFmpeg scene detection (configurable threshold). Frame extraction per scene. Resize + cache.',
  },
  {
    n: '03',
    title: 'Stage-1 filter',
    sub: 'queue · stage1_filter',
    body: 'Cheap scoring: YOLO-nano, motion, face detection. Drop low-signal frames before the heavy stage runs.',
  },
  {
    n: '04',
    title: 'Stage-2 analyse',
    sub: 'queue · stage2_analysis · GPU',
    body: 'YOLOv8x, CLIP, VideoMAE, RetinaFace, EasyOCR. Per-scene aggregation → Hive-partitioned Parquet.',
  },
  {
    n: '05',
    title: 'Transcribe',
    sub: 'queue · audio_transcription',
    body: 'Whisper with word-timestamps. Warmth / brightness / pause / speaking-rate features per segment.',
  },
  {
    n: '06',
    title: 'Blueprint',
    sub: 'gemini-flash-latest',
    body: 'Per-role prompt + scene timeline + transcript → blueprint markdown. Cached, regeneratable.',
  },
]

export function Pipeline() {
  return (
    <section id="pipeline" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="the chain" title="How a video moves through" />

        <div className="mt-16 space-y-3">
          {STAGES.map((s, i) => (
            <Stage key={s.n} {...s} last={i === STAGES.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Stage({
  n,
  title,
  sub,
  body,
  last,
}: {
  n: string
  title: string
  sub: string
  body: string
  last: boolean
}) {
  return (
    <div className="relative">
      <div className="card-hud rounded-lg p-6 flex gap-6 items-start">
        <div className="flex-shrink-0 w-16">
          <div className="font-mono text-3xl text-mint-500/40 leading-none">{n}</div>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <h3 className="font-serif text-xl text-white/95">{title}</h3>
            <span className="text-xs font-mono text-accent-500 uppercase tracking-widest">
              {sub}
            </span>
          </div>
          <p className="text-sm text-white/55 leading-relaxed">{body}</p>
        </div>
      </div>
      {!last && (
        <div className="flex justify-center my-1">
          <div className="w-px h-4 bg-mint-500/30" />
        </div>
      )}
    </div>
  )
}
