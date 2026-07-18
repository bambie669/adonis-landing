import { useI18n, type Lang } from '../i18n'

const HREFS = ['#platform', '#pipeline', '#publish']

export function Nav() {
  const { lang, setLang, c } = useI18n()
  return (
    <nav className="rnav">
      <div className="rnav__logo">Adonis<b>.</b></div>
      <div className="rnav__links">
        {c.nav.links.map((label, i) => (
          <a href={HREFS[i]} key={HREFS[i]}>{label}</a>
        ))}
      </div>
      <div className="rnav__right">
        <div className="langtog" role="group" aria-label="Language">
          {(['en', 'ro'] as Lang[]).map((l) => (
            <button
              key={l}
              className={'langtog__b' + (lang === l ? ' on' : '')}
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <a className="rnav__cta" href="https://use-adonis.com" target="_blank" rel="noreferrer">
          {c.nav.cta}
        </a>
      </div>
    </nav>
  )
}
