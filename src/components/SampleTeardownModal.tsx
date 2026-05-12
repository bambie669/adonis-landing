import { useState } from 'react'
import { Modal } from './Modal'
import { Close } from './Icons'
import { SceneArt } from '../webgl/SceneArt'

interface SceneDetail {
  t: string
  tag: string
  beat: string
  sig: string[]
  say: string
  why: string
}

interface Eco {
  sibling: number
  reuse: number
  median: string
  topVariant: string
  lift: string
}

const NUVERSE_SCENES: SceneDetail[] = [
  {
    t: '0:00', tag: 'pattern interrupt', beat: 'hook',
    sig: ['static close-up', 'no face', 'product partially visible', 'low ambient'],
    say: '(silence)',
    why: "Stops the scroll by refusing to be a face-cam in the first frame. The audio gap is doing the work — viewers hover to figure out what they're looking at.",
  },
  {
    t: '0:02', tag: 'whip pan to creator', beat: 'tension',
    sig: ['whip pan transition', 'creator on screen', 'eye contact', 'audio rise'],
    say: "Don't buy this until you've heard the thing nobody tells you about retinol.",
    why: 'A hook posed as a warning. The pace shift from static to whip-pan registers as a beat, not an ad cut.',
  },
  {
    t: '0:05', tag: 'product in hands', beat: 'demo',
    sig: ['hands', 'product label visible 1.2s', 'texture demo'],
    say: "This is the version most people are actually buying, and here's why it's the wrong one.",
    why: 'The product is held but not framed — it lives in the corner. Lets viewers feel like they\'re being told something, not sold something.',
  },
  {
    t: '0:09', tag: 'social proof screenshot', beat: 'proof',
    sig: ['caption screenshot', 'review held 2.4s', 'on-screen highlight'],
    say: '42,000 women have said the same thing.',
    why: 'Held longer than any other scene. The viewer has time to read it; the algorithm reads the linger as engagement.',
  },
  {
    t: '0:13', tag: 'before/after split', beat: 'reveal',
    sig: ['split frame', 'text overlay', 'zoom-in on right pane'],
    say: 'And this is what 6 weeks of the right version actually looks like.',
    why: 'Visual payoff. Side-by-side is the format the audience expects, but the zoom-in on the "after" frame redirects attention with a single motion cue.',
  },
  {
    t: '0:17', tag: 'price-anchored CTA', beat: 'cta',
    sig: ['CTA button graphic', 'price text', 'arrow motion'],
    say: "Link's in bio. $32 — about a single facial.",
    why: 'Price-anchored at the end, not the start. The whole spot earns the right to ask. Comparison anchor ("a single facial") reframes value.',
  },
]

const NUVERSE_ECO: Eco = {
  sibling: 14,
  reuse: 9,
  median: '17.6s',
  topVariant: 'cuts at 0:14 instead of 0:17',
  lift: '+34% completion',
}

const SAMPLE = {
  platform: 'instagram',
  handle: '@nuverse',
  duration: '0:18',
  headline: 'Skincare reel — pattern-interrupt opener',
  spend: '$28k est. monthly',
  hookRate: '11.4%',
  scenes: NUVERSE_SCENES,
  eco: NUVERSE_ECO,
}

interface Props {
  onClose: () => void
}

export function SampleTeardownModal({ onClose }: Props) {
  const [active, setActive] = useState(0)
  const sc = SAMPLE.scenes[active]

  return (
    <Modal onClose={onClose} className="td">
      <div className="td__head">
        <div className="td__headLeft">
          <div className="pill"><span className="dot" /> playbook · sample</div>
          <div className="td__title">{SAMPLE.headline}</div>
          <div className="td__meta">
            <span>{SAMPLE.platform}</span><span className="td__sep">·</span>
            <span>{SAMPLE.handle}</span><span className="td__sep">·</span>
            <span>{SAMPLE.duration}</span><span className="td__sep">·</span>
            <span className="mint">hook rate {SAMPLE.hookRate}</span><span className="td__sep">·</span>
            <span className="orange">{SAMPLE.spend}</span>
          </div>
        </div>
        <button className="td__close" onClick={onClose} aria-label="close"><Close /></button>
      </div>

      <div className="td__body">
        <div className="td__rail">
          <div className="td__colHead font-mono">scenes · {SAMPLE.scenes.length}</div>
          <div className="td__railList">
            {SAMPLE.scenes.map((scene, i) => (
              <button
                key={i}
                className={`td__railItem ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <div className="td__railNum font-mono">{String(i + 1).padStart(2, '0')}</div>
                <div className="td__railThumb"><SceneArt idx={i} /></div>
                <div className="td__railText">
                  <div className="td__railTime font-mono">{scene.t}</div>
                  <div className="td__railTag">{scene.tag}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="td__detail">
          <div className="td__colHead font-mono">
            <span>scene {String(active + 1).padStart(2, '0')} · {sc.t}</span>
            <span className="orange">{sc.beat}</span>
          </div>
          <div className="td__frame"><SceneArt idx={active} /></div>
          <div className="td__detailBlock">
            <div className="td__label">visual signals</div>
            <div className="td__chips">
              {sc.sig.map((x) => <span key={x} className="tag">{x}</span>)}
            </div>
          </div>
          <div className="td__detailBlock">
            <div className="td__label">transcript</div>
            <div className="td__transcript">
              <span className="td__quote">"</span>{sc.say}<span className="td__quote">"</span>
            </div>
          </div>
          <div className="td__detailBlock">
            <div className="td__label">why this beat works</div>
            <div className="td__why">{sc.why}</div>
          </div>
        </div>

        <div className="td__analysis">
          <div className="td__colHead font-mono">written playbook</div>
          <div className="td__analysisBody">
            <div className="td__k">structure</div>
            <p className="td__p">
              A clean six-beat anatomy: <span className="mint">hook → tension → demo → proof → reveal → CTA</span>.
              No beat exceeds 4 seconds except the social proof scene, which is given 2.4s of dwell time on purpose.
            </p>

            <div className="td__k">why the algorithm likes it</div>
            <p className="td__p">
              Two engagement amplifiers stack: the opening silence creates the kind of hover the platform rewards
              as "considered watch time," and the held social-proof scene is dense enough to invite a rewind.
            </p>

            <div className="td__k">what to steal</div>
            <ul className="td__list">
              <li>Static first frame with no face. The whip-pan only lands if the open is quiet.</li>
              <li>Hold any proof artifact for 2s+. The algorithm reads the linger; the viewer reads the words.</li>
              <li>Price the CTA against something tangible (a facial, a coffee, a movie ticket).</li>
            </ul>

            <div className="td__k">ecosystem map</div>
            <div className="td__eco">
              <EcoStat label="sibling ads (30d)" value={String(SAMPLE.eco.sibling)} />
              <EcoStat label="reuse this pattern" value={`${SAMPLE.eco.reuse}/${SAMPLE.eco.sibling}`} />
              <EcoStat label="median runtime" value={SAMPLE.eco.median} />
              <EcoStat label="top variant" value={SAMPLE.eco.lift} accent />
            </div>
            <p className="td__p" style={{ marginTop: 14 }}>
              <span className="orange">Top-performing variant:</span> {SAMPLE.eco.topVariant}.
              If you're testing in this niche, run a 14s cut against the 17s control before anything else.
            </p>
          </div>
        </div>
      </div>

      <div className="td__foot">
        <div className="td__footLeft">
          <span>generated locally · 2m 41s</span>
          <span className="td__sep">·</span>
          <span className="muted">no data left your machine</span>
        </div>
        <div>
          <a
            className="btn btn--ghost btn--mono"
            href="https://github.com/cristidan94/adonis-smart-ads"
            target="_blank"
            rel="noreferrer"
          >
            run it yourself →
          </a>
        </div>
      </div>
    </Modal>
  )
}

interface EcoStatProps {
  label: string
  value: string
  accent?: boolean
}

function EcoStat({ label, value, accent }: EcoStatProps) {
  return (
    <div className={`td__ecoStat ${accent ? 'td__ecoStat--accent' : ''}`}>
      <div className="td__ecoLabel">{label}</div>
      <div className="td__ecoValue">{value}</div>
    </div>
  )
}
