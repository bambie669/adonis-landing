export function Hero() {
  return (
    <section className="rhero" id="platform">
      <div className="wrap-r rhero__inner">
        <div>
          <div className="eyebrow"><span className="dot" />Ad intelligence · live</div>
          <h1>Run your entire ad<br />operation from <span className="o">one deck.</span></h1>
          <p className="rhero__sub">
            Adonis reads the ads that are winning, turns the pattern into content, and
            publishes it across every platform — while it audits your pages and surfaces
            warm leads.
          </p>
          <div className="rhero__ctas">
            <a className="btn-o" href="https://use-adonis.com" target="_blank" rel="noreferrer">Analyze your first ad — free →</a>
            <a className="link-mono" href="#pipeline">see how it works</a>
          </div>
          <div className="rhero__assure">Free to start · no credit card · first teardown in ~3 min</div>
        </div>

        <div className="console">
          <div className="console__scan" />
          <div className="console__in">
            <div className="console__top"><span>◉ pipeline</span><span className="g">4 platforms · live</span></div>
            <div className="pipe">
              <div className="pipe__s on">ANALYZE</div>
              <div className="pipe__s on">CREATE</div>
              <div className="pipe__s on">PUBLISH</div>
              <div className="pipe__s">AUDIT</div>
            </div>
            <div className="cells">
              <div className="cell"><div className="k">Signals</div><div className="v c">30+</div></div>
              <div className="cell"><div className="k">Per ad</div><div className="v">~3<span style={{ fontSize: 13 }}> min</span></div></div>
              <div className="cell"><div className="k">Queued</div><div className="v o">12</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
