/* Redesigned landing sections (Direction A base + Direction C publish). */

function I({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

const FEATURES = [
  { ic: 'M3 12h4l2 6 4-14 2 8h6', h: 'Analyze', tag: '30+ signals / ad',
    p: 'Reverse-engineer any winning ad — hook, cut, pacing, sentiment, scenes, audio. The playbook a strategist charges thousands for, in minutes.' },
  { ic: 'M12 3v4m0 10v4m-9-9h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8M8.4 15.6l-2.8 2.8', h: 'Generate', tag: 'scripts · captions · video',
    p: 'Turn the pattern into content that sounds like you — scripts, captions and rendered video, on-brand and ready to ship.' },
  { ic: 'M4 6h16M4 12h16M4 18h10', h: 'Publish', tag: 'IG · FB · TikTok',
    p: 'Feed, Stories and Carousels to Instagram, Facebook and TikTok — scheduled, AI-labelled, tracked. One post, every platform.' },
  { ic: 'M4 20V10m5 10V4m5 16v-7m5 7V8', h: 'Audit', tag: 'SEO · speed · tech',
    p: 'Score any landing page on SEO, speed, tech and trends — then fix what is quietly costing you conversions.' },
  { ic: 'M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6m11 10v-2a4 4 0 0 0-3-3.9', h: 'Warm leads', tag: 'already engaging',
    p: 'Surface the accounts already engaging in your niche — warm, scored, and ready before your competitors notice them.' },
]

const STEPS = [
  { n: '1', h: 'Analyze', p: 'Drop a URL. Get the teardown.' },
  { n: '2', h: 'Generate', p: 'Pattern becomes content.' },
  { n: '3', h: 'Publish', p: 'Everywhere, at once.' },
  { n: '4', h: 'Audit', p: 'Fix the leaks.' },
  { n: '5', h: 'Convert', p: 'Warm leads, surfaced.' },
]

const STATS = [
  { v: '4', c: 'c', l: 'Platforms', d: 'YouTube · Instagram · Facebook · TikTok' },
  { v: '30+', c: '', l: 'Signals / ad', d: 'hooks · cuts · faces · sentiment · audio' },
  { v: '~3 min', c: 'o', l: 'From URL to plan', d: 'a full written playbook per ad' },
  { v: '100%', c: 'c', l: 'Yours', d: 'your research and accounts stay yours' },
]

export function Platform() {
  return (
    <section className="rsection wrap-r" id="features">
      <div className="rhead">
        <div className="eyebrow"><span className="dot" />The platform</div>
        <h2>Everything your ad operation needs, <span className="o">in one deck.</span></h2>
        <p>From the ad that is already winning to the post that is live — Adonis runs the whole loop, so you stop stitching six tools together.</p>
      </div>
      <div className="feat">
        {FEATURES.map((f) => (
          <div className="card" key={f.h}>
            <div className="ic"><I d={f.ic} /></div>
            <h3>{f.h}</h3>
            <p>{f.p}</p>
            <div className="rtag">{f.tag}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section className="rsection wrap-r" id="pipeline">
      <div className="rhead">
        <div className="eyebrow"><span className="dot" />How it works</div>
        <h2>Five moves. One pipeline.</h2>
      </div>
      <div className="flow">
        <div className="flow__line" />
        {STEPS.map((s) => (
          <div className="step" key={s.n}>
            <div className="n">{s.n}</div>
            <h4>{s.h}</h4>
            <p>{s.p}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PublishEverywhere() {
  return (
    <section className="publishC" id="publish">
      <div className="marq">
        <div className="marq__t">
          <span>Analyze</span><span>·</span><span>Generate</span><span>·</span><span><b>Publish everywhere</b></span><span>·</span><span>Stories</span><span>·</span><span>Carousel</span><span>·</span><span>Reels</span><span>·</span>
          <span>Analyze</span><span>·</span><span>Generate</span><span>·</span><span><b>Publish everywhere</b></span><span>·</span><span>Stories</span><span>·</span><span>Carousel</span><span>·</span><span>Reels</span><span>·</span>
        </div>
      </div>
      <div className="wrap-r pubLay">
        <div>
          <h2>Publish <span className="g">everywhere.</span><br />All at once.</h2>
          <p>One post, every platform — Feed, Stories and Carousels to Instagram, Facebook and TikTok, with the AI-generated label handled for you.</p>
          <a className="btn-g" href="https://use-adonis.com" target="_blank" rel="noreferrer">Start publishing →</a>
        </div>
        <div className="pubStage">
          <div className="pcard pc1"><div className="top"><span>IG · STORY</span><span>◷</span></div><div className="media" /><div className="row"><span>♥ 2.4k</span><span>↗ 180</span></div></div>
          <div className="pcard pc2"><div className="top"><span>CAROUSEL</span><span>1 / 6</span></div><div className="media" /><div className="row"><span>♥ 5.1k</span><span>↗ 402</span></div></div>
          <div className="pcard pc3"><div className="top"><span>TT · REEL</span><span>◷</span></div><div className="media" /><div className="row"><span>♥ 9.8k</span><span>↗ 1.2k</span></div></div>
          <div className="plat"><b className="on">Instagram</b><b className="on">Facebook</b><b className="on">TikTok</b></div>
        </div>
      </div>
    </section>
  )
}

export function Stats() {
  return (
    <section className="rsection wrap-r">
      <div className="stats">
        {STATS.map((s) => (
          <div className="stat-c" key={s.l}>
            <div className={`v ${s.c}`}>{s.v}</div>
            <div className="l">{s.l}</div>
            <div className="d">{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Closing() {
  return (
    <section className="rsection wrap-r closing">
      <h2>Run your next campaign <span className="o">on Adonis.</span></h2>
      <p>The whole loop — analyze, generate, publish, audit, convert — in one deck. Open it and ship something today.</p>
      <a className="btn-o" href="https://use-adonis.com" target="_blank" rel="noreferrer">Open Adonis →</a>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="rfoot">
      <div className="wrap-r">
        <div className="rfoot__grid">
          <div className="rfoot__brand">
            <div className="logo">Adonis<b>.</b></div>
            <p>The intelligent ads platform for paid social — analyze, generate, publish, audit, convert.</p>
          </div>
          <div className="rfoot__col">
            <h5>Product</h5>
            <a href="#features">Platform</a>
            <a href="#pipeline">How it works</a>
            <a href="#publish">Publishing</a>
            <a href="https://use-adonis.com" target="_blank" rel="noreferrer">Open Adonis</a>
          </div>
          <div className="rfoot__col">
            <h5>Company</h5>
            <a href="https://use-adonis.com" target="_blank" rel="noreferrer">App</a>
            <a href="mailto:bogdancovaci100@gmail.com">Contact</a>
          </div>
          <div className="rfoot__col">
            <h5>Legal</h5>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
        <div className="rfoot__bottom">
          <span>© 2026 Adonis. Built for paid social.</span>
          <span>use-adonis.com</span>
        </div>
      </div>
    </footer>
  )
}
