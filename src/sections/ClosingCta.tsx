import { Arrow } from '../components/Icons'

interface Props {
  onEnroll: () => void
  onOpenSample: () => void
}

export function ClosingCta({ onEnroll, onOpenSample }: Props) {
  return (
    <section className="section section--tight">
      <div className="wrap closing__wrap">
        <div className="closing__inner card">
          <div className="eyebrow">last call</div>
          <h2 className="closing__h">
            The next ad you launch <span className="mint glow-mint">should already know what works.</span>
          </h2>
          <p className="closing__sub">
            Adonis ships in late Q2 2026. The first hundred enrollments get a free year of hosted
            playbook archival and the desktop binary before public release.
          </p>
          <div className="closing__ctas">
            <button className="btn btn--primary" onClick={onEnroll}>
              Enroll for launch <Arrow />
            </button>
            <button className="btn btn--ghost" onClick={onOpenSample}>See a sample first</button>
          </div>
          <div className="closing__meta muted">
            no credit card · single email · we tell you when it ships, nothing else
          </div>
        </div>
      </div>
    </section>
  )
}
