import { SectionHeader } from './Features'

const STAGES = [
  {
    n: '01',
    title: 'Drop the link.',
    sub: 'any URL, any platform',
    body: "Paste a YouTube short, an Instagram reel, a Facebook video or a TikTok URL. Or drag in your own mp4. Adonis pulls down the source and notes the basics.",
  },
  {
    n: '02',
    title: 'Cut the tape.',
    sub: 'scene by scene',
    body: "It finds every cut, every beat, every moment the camera moves. Each scene becomes its own little card you can scrub through, frame by frame.",
  },
  {
    n: '03',
    title: 'Skip the dead air.',
    sub: 'keep what matters',
    body: "Empty frames, static shots, throwaway time — filtered out. What's left are the moments the ad is actually working on you.",
  },
  {
    n: '04',
    title: 'See everything in it.',
    sub: 'people · objects · text · mood',
    body: "Faces, products, on-screen captions, body language, the action beats. Every visual signal in the ad, tagged and searchable.",
  },
  {
    n: '05',
    title: 'Hear the script.',
    sub: 'word-perfect transcript',
    body: "Every line transcribed with timestamps. Plus the texture — when the pace speeds up, when the voice softens, where the pauses land.",
  },
  {
    n: '06',
    title: 'Read the playbook.',
    sub: 'the why, in plain English',
    body: "All of that, distilled into one written blueprint: hook, tension, payoff, call to action, and why this particular ad is converting in this particular ecosystem.",
  },
]

export function Pipeline() {
  return (
    <section id="pipeline" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="how it works" title="From a link to a playbook." />

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
          <p className="text-sm text-white/60 leading-relaxed">{body}</p>
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
