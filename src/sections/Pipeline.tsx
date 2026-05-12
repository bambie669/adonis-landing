import { SectionHead } from './Features'

const STAGES = [
  { n: '01', title: 'Drop the link.', sub: 'any url, any platform',
    body: "Paste a YouTube short, an Instagram reel, a Facebook video or a TikTok URL. Or drag in your own mp4. Adonis pulls down the source and notes the basics." },
  { n: '02', title: 'Cut the tape.', sub: 'scene by scene',
    body: "It finds every cut, every beat, every moment the camera moves. Each scene becomes its own little card you can scrub through, frame by frame." },
  { n: '03', title: 'Skip the dead air.', sub: 'keep what matters',
    body: "Empty frames, static shots, throwaway time — filtered out. What's left are the moments the ad is actually working on you." },
  { n: '04', title: 'See everything in it.', sub: 'people · objects · text · mood',
    body: "Faces, products, on-screen captions, body language, the action beats. Every visual signal in the ad, tagged and searchable." },
  { n: '05', title: 'Hear the script.', sub: 'word-perfect transcript',
    body: "Every line transcribed with timestamps. Plus the texture — when the pace speeds up, when the voice softens, where the pauses land." },
  { n: '06', title: 'Read the playbook.', sub: 'the why, in plain english',
    body: "All of that, distilled into one written blueprint: hook, tension, payoff, CTA, and why this particular ad is converting in this particular ecosystem." },
]

export function Pipeline() {
  return (
    <section id="pipeline" className="section">
      <div className="wrap pipeline__wrap">
        <SectionHead label="how it works" title="From a link to a playbook." />
        <div className="pipeline__list">
          {STAGES.map((s, i) => <Stage key={s.n} {...s} last={i === STAGES.length - 1} />)}
        </div>
      </div>
    </section>
  )
}

function Stage({ n, title, sub, body, last }: { n: string; title: string; sub: string; body: string; last: boolean }) {
  return (
    <div className="pipeline__stage">
      <div className="card pipeline__card">
        <div className="pipeline__n">{n}</div>
        <div>
          <div className="pipeline__head">
            <h3 className="pipeline__title">{title}</h3>
            <span className="pipeline__sub orange">{sub}</span>
          </div>
          <p className="pipeline__body">{body}</p>
        </div>
      </div>
      {!last && <div className="pipeline__connector" />}
    </div>
  )
}
