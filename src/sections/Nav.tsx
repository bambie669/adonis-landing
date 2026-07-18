export function Nav() {
  return (
    <nav className="rnav">
      <div className="rnav__logo">Adonis<b>.</b></div>
      <div className="rnav__links">
        <a href="#platform">Platform</a>
        <a href="#pipeline">How it works</a>
        <a href="#publish">Publishing</a>
      </div>
      <a className="rnav__cta" href="https://use-adonis.com" target="_blank" rel="noreferrer">
        Start free →
      </a>
    </nav>
  )
}
