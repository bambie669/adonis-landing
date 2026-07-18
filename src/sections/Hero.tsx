import { useI18n } from '../i18n'

export function Hero() {
  const { c } = useI18n()
  return (
    <section className="rhero" id="platform">
      <div className="wrap-r rhero__inner">
        <div>
          <div className="eyebrow"><span className="dot" />{c.hero.eyebrow}</div>
          <h1>{c.hero.h1pre}<span className="o">{c.hero.h1accent}</span></h1>
          <p className="rhero__sub">{c.hero.sub}</p>
          <div className="rhero__ctas">
            <a className="btn-o" href="https://use-adonis.com" target="_blank" rel="noreferrer">{c.hero.cta}</a>
            <a className="link-mono" href="#pipeline">{c.hero.link}</a>
          </div>
          <div className="rhero__assure">{c.hero.assure}</div>
        </div>

        <div className="console">
          <div className="console__scan" />
          <div className="console__in">
            <div className="console__top"><span>◉ pipeline</span><span className="g">{c.hero.consoleLive}</span></div>
            <div className="pipe">
              <div className="pipe__s on">ANALYZE</div>
              <div className="pipe__s on">CREATE</div>
              <div className="pipe__s on">PUBLISH</div>
              <div className="pipe__s">AUDIT</div>
            </div>
            <div className="cells">
              <div className="cell"><div className="k">{c.hero.cells[0]}</div><div className="v c">30+</div></div>
              <div className="cell"><div className="k">{c.hero.cells[1]}</div><div className="v">~3<span style={{ fontSize: 13 }}> min</span></div></div>
              <div className="cell"><div className="k">{c.hero.cells[2]}</div><div className="v o">12</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
