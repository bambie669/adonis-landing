/* Redesigned landing sections (Direction A base + Direction C publish). */
import { useI18n } from '../i18n'

function I({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

/* Language-independent structural data, zipped by index with the i18n arrays. */
const FEATURE_ICONS = [
  'M3 12h4l2 6 4-14 2 8h6',
  'M12 3v4m0 10v4m-9-9h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8M8.4 15.6l-2.8 2.8',
  'M4 6h16M4 12h16M4 18h10',
  'M4 20V10m5 10V4m5 16v-7m5 7V8',
  'M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6m11 10v-2a4 4 0 0 0-3-3.9',
]

const STAT_META = [{ v: '4', c: 'c' }, { v: '30+', c: '' }, { v: '~3 min', c: 'o' }, { v: '100%', c: 'c' }]

export function Platform() {
  const { c } = useI18n()
  return (
    <section className="rsection wrap-r" id="features">
      <div className="rhead">
        <div className="eyebrow"><span className="dot" />{c.platform.eyebrow}</div>
        <h2>{c.platform.h2pre}<span className="o">{c.platform.h2accent}</span></h2>
        <p>{c.platform.p}</p>
      </div>
      <div className="feat">
        {c.platform.features.map((f, i) => (
          <div className="card" key={f.h}>
            <div className="ic"><I d={FEATURE_ICONS[i]} /></div>
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
  const { c } = useI18n()
  return (
    <section className="rsection wrap-r" id="pipeline">
      <div className="rhead">
        <div className="eyebrow"><span className="dot" />{c.how.eyebrow}</div>
        <h2>{c.how.h2}</h2>
      </div>
      <div className="flow">
        <div className="flow__line" />
        {c.how.steps.map((s, i) => (
          <div className="step" key={s.h}>
            <div className="n">{i + 1}</div>
            <h4>{s.h}</h4>
            <p>{s.p}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PublishEverywhere() {
  const { c } = useI18n()
  const marq = (
    <div className="marq__t">
      {[0, 1].map((rep) =>
        c.publish.marquee.flatMap((w, i) => [
          <span key={rep + '-' + i}>{i === 2 ? <b>{w}</b> : w}</span>,
          <span key={rep + '-sep-' + i}>·</span>,
        ]),
      )}
    </div>
  )
  return (
    <section className="publishC" id="publish">
      <div className="marq">{marq}</div>
      <div className="wrap-r pubLay">
        <div>
          <h2>{c.publish.h2pre}<span className="g">{c.publish.h2accent}</span><br />{c.publish.h2post}</h2>
          <p>{c.publish.p}</p>
          <a className="btn-g" href="https://use-adonis.com" target="_blank" rel="noreferrer">{c.publish.cta}</a>
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
  const { c } = useI18n()
  return (
    <section className="rsection wrap-r">
      <div className="stats">
        {c.stats.map((s, i) => (
          <div className="stat-c" key={s.l}>
            <div className={`v ${STAT_META[i].c}`}>{STAT_META[i].v}</div>
            <div className="l">{s.l}</div>
            <div className="d">{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Closing() {
  const { c } = useI18n()
  return (
    <section className="rsection wrap-r closing">
      <h2>{c.closing.h2pre}<span className="o">{c.closing.h2accent}</span></h2>
      <p>{c.closing.p}</p>
      <a className="btn-o" href="https://use-adonis.com" target="_blank" rel="noreferrer">{c.closing.cta}</a>
      <div className="closing__assure">{c.closing.assure}</div>
    </section>
  )
}

export function TrustStrip() {
  const { c } = useI18n()
  return (
    <section className="trustsec">
      <div className="trust">
        {c.trust.map((a) => (
          <span className="trust__i" key={a}>
            <I d="M20 6 9 17l-5-5" />
            {a}
          </span>
        ))}
      </div>
    </section>
  )
}

export function SiteFooter() {
  const { c } = useI18n()
  const productHrefs = ['#features', '#pipeline', '#publish']
  return (
    <footer className="rfoot">
      <div className="wrap-r">
        <div className="rfoot__grid">
          <div className="rfoot__brand">
            <div className="logo">Adonis<b>.</b></div>
            <p>{c.footer.blurb}</p>
          </div>
          <div className="rfoot__col">
            <h5>{c.footer.productH}</h5>
            {c.footer.product.map((label, i) => (
              <a href={productHrefs[i]} key={productHrefs[i]}>{label}</a>
            ))}
            <a href="https://use-adonis.com" target="_blank" rel="noreferrer">{c.footer.openAdonis}</a>
          </div>
          <div className="rfoot__col">
            <h5>{c.footer.companyH}</h5>
            <a href="https://use-adonis.com" target="_blank" rel="noreferrer">{c.footer.company[0]}</a>
            <a href="mailto:bogdancovaci100@gmail.com">{c.footer.company[1]}</a>
          </div>
          <div className="rfoot__col">
            <h5>{c.footer.legalH}</h5>
            <a href="/privacy">{c.footer.legal[0]}</a>
            <a href="/terms">{c.footer.legal[1]}</a>
          </div>
        </div>
        <div className="rfoot__bottom">
          <span>{c.footer.bottom}</span>
          <span>use-adonis.com</span>
        </div>
      </div>
    </footer>
  )
}
