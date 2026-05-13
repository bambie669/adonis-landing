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

interface AnalysisCopy {
  structure: { highlight: string; body: string }
  algorithm: string
  steal: string[]
  ecosystem: string
}

interface Sample {
  id: string
  platform: string
  handle: string
  duration: string
  headline: string
  spend: string
  hookRate: string
  scenes: SceneDetail[]
  eco: Eco
  analysis: AnalysisCopy
}

const SAMPLES: Sample[] = [
  {
    id: 'nuverse',
    platform: 'instagram',
    handle: '@nuverse',
    duration: '0:18',
    headline: 'Skincare reel — pattern-interrupt opener',
    spend: '$28k est. monthly',
    hookRate: '11.4%',
    scenes: [
      { t: '0:00', tag: 'pattern interrupt', beat: 'hook',
        sig: ['static close-up', 'no face', 'product partially visible', 'low ambient'],
        say: '(silence)',
        why: "Stops the scroll by refusing to be a face-cam in the first frame. The audio gap is doing the work — viewers hover to figure out what they're looking at." },
      { t: '0:02', tag: 'whip pan to creator', beat: 'tension',
        sig: ['whip pan transition', 'creator on screen', 'eye contact', 'audio rise'],
        say: "Don't buy this until you've heard the thing nobody tells you about retinol.",
        why: 'A hook posed as a warning. The pace shift from static to whip-pan registers as a beat, not an ad cut.' },
      { t: '0:05', tag: 'product in hands', beat: 'demo',
        sig: ['hands', 'product label visible 1.2s', 'texture demo'],
        say: "This is the version most people are actually buying, and here's why it's the wrong one.",
        why: "The product is held but not framed — it lives in the corner. Lets viewers feel like they're being told something, not sold something." },
      { t: '0:09', tag: 'social proof screenshot', beat: 'proof',
        sig: ['caption screenshot', 'review held 2.4s', 'on-screen highlight'],
        say: '42,000 women have said the same thing.',
        why: 'Held longer than any other scene. The viewer has time to read it; the algorithm reads the linger as engagement.' },
      { t: '0:13', tag: 'before/after split', beat: 'reveal',
        sig: ['split frame', 'text overlay', 'zoom-in on right pane'],
        say: 'And this is what 6 weeks of the right version actually looks like.',
        why: 'Visual payoff. Side-by-side is the format the audience expects, but the zoom-in on the "after" frame redirects attention with a single motion cue.' },
      { t: '0:17', tag: 'price-anchored CTA', beat: 'cta',
        sig: ['CTA button graphic', 'price text', 'arrow motion'],
        say: "Link's in bio. $32 — about a single facial.",
        why: 'Price-anchored at the end, not the start. The whole spot earns the right to ask. Comparison anchor ("a single facial") reframes value.' },
    ],
    eco: { sibling: 14, reuse: 9, median: '17.6s', topVariant: 'cuts at 0:14 instead of 0:17', lift: '+34% completion' },
    analysis: {
      structure: {
        highlight: 'hook → tension → demo → proof → reveal → CTA',
        body: 'No beat exceeds 4 seconds except the social proof scene, which is given 2.4s of dwell time on purpose.',
      },
      algorithm: "Two engagement amplifiers stack: the opening silence creates the kind of hover the platform rewards as \"considered watch time,\" and the held social-proof scene is dense enough to invite a rewind.",
      steal: [
        'Static first frame with no face. The whip-pan only lands if the open is quiet.',
        'Hold any proof artifact for 2s+. The algorithm reads the linger; the viewer reads the words.',
        'Price the CTA against something tangible (a facial, a coffee, a movie ticket).',
      ],
      ecosystem: "If you're testing in this niche, run a 14s cut against the 17s control before anything else.",
    },
  },
  {
    id: 'gymsharp',
    platform: 'tiktok',
    handle: '@gymsharp',
    duration: '0:24',
    headline: 'Apparel ad — disguised as a clip-show',
    spend: '$54k est. monthly',
    hookRate: '14.8%',
    scenes: [
      { t: '0:00', tag: 'in-mirror reaction', beat: 'hook',
        sig: ['POV mirror', 'low room light', 'no caption', 'inhaled aside'],
        say: 'I should not have bought this.',
        why: 'Reads as a confession, not a sponsored haul. The "should not have" promises a complication — viewers stay for the punchline.' },
      { t: '0:04', tag: 'fabric close-up', beat: 'tension',
        sig: ['extreme close-up', 'fabric texture', 'no logo yet', 'soft focus'],
        say: 'The waistband is doing the thing I always complained about with the other brand.',
        why: 'A specific gripe (waistband, not "the fit") makes the praise feel earned. Logos withheld so the audience is still in the story, not the ad.' },
      { t: '0:08', tag: 'aside · outfit fail', beat: 'demo',
        sig: ['cutaway b-roll', 'discarded outfit', 'mirror angle change', 'mild laugh'],
        say: 'This was the one I tried first. We are not doing that.',
        why: 'A clip-show convention — the "blooper before the real one." Establishes the video is honest about taste, which gives the next pose authority.' },
      { t: '0:12', tag: 'full-length reveal', beat: 'reveal',
        sig: ['full-body shot', 'brand patch visible 0.8s', 'spin transition', 'mid-tempo cut'],
        say: "Okay, but this one. Tell me this isn't the play.",
        why: 'Logo is briefly visible but the prompt is "tell me" — invites comments rather than discloses sponsorship. The spin masks the brand reveal as choreography.' },
      { t: '0:18', tag: 'comment overlay', beat: 'proof',
        sig: ['three comment screenshots', 'usernames blurred', 'mint highlight ring', 'held 3.1s'],
        say: '(no voiceover · ambient music swells)',
        why: 'Held longer than any other scene at 3.1s. Comments aren\'t a creator review — they read as peer pressure. The longer hold gives time for the recommendation to feel collective.' },
      { t: '0:22', tag: 'soft CTA', beat: 'cta',
        sig: ['handle on screen', 'discount code overlay', 'no price', 'cut to black'],
        say: 'Use code FIT15 if you want it cheaper than I got it.',
        why: '"Cheaper than I got it" reframes the discount as insider access, not promo. The cut-to-black ends the spot on the code, not the brand.',
      },
    ],
    eco: { sibling: 21, reuse: 16, median: '23.2s', topVariant: 'leads with the outfit fail at 0:00', lift: '+41% complete view rate' },
    analysis: {
      structure: {
        highlight: 'confession → gripe → blooper → reveal → comments → coded CTA',
        body: 'Disguised as a get-ready-with-me clip-show. No beat names the brand for the first 12s. The logo flash at 0:12 is buffered by motion so disclosure feels accidental.',
      },
      algorithm: 'TikTok rewards loops; the 3.1s comment hold and the abrupt cut-to-black ending both push replay behavior. The withheld brand name in the first 12s also keeps the spot off "ad" classifiers that gate the For You distribution.',
      steal: [
        "Lead with a confession the audience expects to be a real opinion (\"I shouldn't have bought this\").",
        'Withhold the logo for the first half. Reveal it through motion (spin, swing) so it reads as styling, not disclosure.',
        'Use a coded discount instead of a sticker price — the code feels like access, the price feels like sales.',
      ],
      ecosystem: 'The 21-ad cluster from @gymsharp leans heavily on this structure. The top variant skips the in-mirror open and starts on the outfit fail — pulls in the audience that scrolls past pretty openings.',
    },
  },
  {
    id: 'caldera',
    platform: 'youtube short',
    handle: '@caldera-supply',
    duration: '0:42',
    headline: 'DTC cookware — "anti-demo" demo',
    spend: '$9k est. monthly',
    hookRate: '8.1%',
    scenes: [
      { t: '0:00', tag: 'anti-ad disclaimer', beat: 'hook',
        sig: ['talking head', 'kitchen set', 'no music', 'direct camera address'],
        say: "I hate cookware ads. I'm about to make one anyway. Here's the deal we're going to make.",
        why: 'Lampshades the genre to disarm cynicism. "Here\'s the deal" is a contract opener — promises the viewer something in exchange for staying.' },
      { t: '0:08', tag: 'the gripes montage', beat: 'tension',
        sig: ['cutaway montage', 'sticky pan', 'oil splatter', 'fast cuts 0.8s each'],
        say: 'Eggs stick. Handles get hot. You need three pans to make breakfast. We agree on this.',
        why: 'Lists shared frustrations before showing the product. Aligns with the audience first — the product is positioned as a fix, not a feature set.' },
      { t: '0:16', tag: 'mundane reveal', beat: 'reveal',
        sig: ['static shot', 'pan on counter', 'no lighting drama', 'price card 0.6s'],
        say: "This is it. I'm not going to pan around it. It's a pan.",
        why: 'Refuses the rotating-product-shot convention. The deadpan delivery is the brand voice. The brief price flash signals confidence — the spot does not depend on hiding the number.' },
      { t: '0:24', tag: 'single-take cook', beat: 'demo',
        sig: ['locked-off camera', 'no cuts 8s', 'egg slides clean', 'no voiceover'],
        say: '(ambient kitchen sound only)',
        why: 'The 8-second uncut take is the proof. Cuts in cooking demos usually hide failures; the absence of cuts says the product works the first time, on camera.' },
      { t: '0:34', tag: 'cleanup sequence', beat: 'proof',
        sig: ['wipe with paper towel', 'pan in dish rack', 'no soap shot', '4s hold'],
        say: 'Wiped clean with a paper towel. That is the entire dishwashing scene.',
        why: 'The wash is the second half of the cooking experience and the part competitor ads never show. Including it as proof is the differentiator.' },
      { t: '0:40', tag: 'comparison CTA', beat: 'cta',
        sig: ['price text', 'takeout receipt on screen', 'small URL', 'fade to brand mark'],
        say: 'Costs less than three takeout dinners. Link below. That\'s the whole pitch.',
        why: 'Anchors the price against a familiar weekly expense the audience already pays. "That\'s the whole pitch" closes the contract opened at 0:00 — viewers feel transacted-with, not sold-to.' },
    ],
    eco: { sibling: 7, reuse: 6, median: '40.4s', topVariant: 'opens directly on the egg slide', lift: '+22% click-through on watchpage' },
    analysis: {
      structure: {
        highlight: 'anti-ad disclaimer → shared gripes → mundane reveal → uncut demo → cleanup → comparison CTA',
        body: 'The whole spot is a contract with the viewer: I will not lie, I will not edit out the wash, I will not pan around the product. Each beat repays a piece of the opening promise.',
      },
      algorithm: 'YouTube Shorts rewards completion on longer 30s+ Shorts; the 8s uncut take and the 4s cleanup hold both push average view duration into the band that promotes Shorts to the main feed. The conversational direct-address makes the spot eligible for the "creator-style" cluster classifier.',
      steal: [
        'Open by naming the genre and the cynicism it produces. Disarming the viewer beats outrunning them.',
        'Show the cleanup. Most cookware competitors stop at the cook; the wash is the differentiator viewers actually care about.',
        'Price against a familiar weekly expense the audience already pays (takeout, a streaming sub, a coffee habit).',
      ],
      ecosystem: 'Only 7 sibling ads in the cluster — Caldera is running a tight test. The top variant skips the disclaimer and opens directly on the egg slide; works for retargeted audiences who already know the brand voice.',
    },
  },
]

interface Props {
  onClose: () => void
}

export function SampleTeardownModal({ onClose }: Props) {
  const [sampleIdx, setSampleIdx] = useState(0)
  const [active, setActive] = useState(0)
  const sample = SAMPLES[sampleIdx]
  const sc = sample.scenes[active]

  const pickSample = (i: number) => {
    setSampleIdx(i)
    setActive(0)
  }

  return (
    <Modal onClose={onClose} className="td">
      <div className="td__head">
        <div className="td__headLeft">
          <div className="td__picker">
            {SAMPLES.map((s, i) => (
              <button
                key={s.id}
                className={`td__pickerItem ${i === sampleIdx ? 'is-active' : ''}`}
                onClick={() => pickSample(i)}
              >
                <span className="td__pickerHandle">{s.handle}</span>
                <span className="td__pickerSep">·</span>
                <span className="td__pickerPlat">{s.platform}</span>
              </button>
            ))}
          </div>
          <div className="td__title">{sample.headline}</div>
          <div className="td__meta">
            <span>{sample.platform}</span><span className="td__sep">·</span>
            <span>{sample.handle}</span><span className="td__sep">·</span>
            <span>{sample.duration}</span><span className="td__sep">·</span>
            <span className="mint">hook rate {sample.hookRate}</span><span className="td__sep">·</span>
            <span className="orange">{sample.spend}</span>
          </div>
        </div>
        <button className="td__close" onClick={onClose} aria-label="close"><Close /></button>
      </div>

      <div className="td__body">
        <div className="td__rail">
          <div className="td__colHead font-mono">scenes · {sample.scenes.length}</div>
          <div className="td__railList">
            {sample.scenes.map((scene, i) => (
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
              A clean six-beat anatomy: <span className="mint">{sample.analysis.structure.highlight}</span>.
              {' '}{sample.analysis.structure.body}
            </p>

            <div className="td__k">why the algorithm likes it</div>
            <p className="td__p">{sample.analysis.algorithm}</p>

            <div className="td__k">what to steal</div>
            <ul className="td__list">
              {sample.analysis.steal.map((s, i) => <li key={i}>{s}</li>)}
            </ul>

            <div className="td__k">ecosystem map</div>
            <div className="td__eco">
              <EcoStat label="sibling ads (30d)" value={String(sample.eco.sibling)} />
              <EcoStat label="reuse this pattern" value={`${sample.eco.reuse}/${sample.eco.sibling}`} />
              <EcoStat label="median runtime" value={sample.eco.median} />
              <EcoStat label="top variant" value={sample.eco.lift} accent />
            </div>
            <p className="td__p" style={{ marginTop: 14 }}>
              <span className="orange">Top-performing variant:</span> {sample.eco.topVariant}.{' '}
              {sample.analysis.ecosystem}
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
