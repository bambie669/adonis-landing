import { Arrow } from '../components/Icons'

interface Props {
  onEnroll: () => void
}

export function Nav({ onEnroll }: Props) {
  return (
    <nav className="nav">
      <div className="nav__logo">
        Adonis<span className="mint">.</span>
      </div>
      <div className="nav__links">
        <a href="#features">features</a>
        <a href="#pipeline">how it works</a>
        <a href="#sample">sample</a>
        <a href="#why">why</a>
        <a href="https://github.com/cristidan94/adonis-smart-ads" target="_blank" rel="noreferrer">github</a>
      </div>
      <button className="btn btn--primary btn--small" onClick={onEnroll}>
        Enroll for launch <Arrow />
      </button>
    </nav>
  )
}
