import { HeroDemoWrapped } from './HeroDemo'
import { Arrow, GhIcon } from '../components/Icons'

interface Props {
  onEnroll: () => void
  onOpenSample: () => void
}

export function Hero({ onEnroll, onOpenSample }: Props) {
  return (
    <section className="hero hud-frame">
      <div className="hero__bg" />

      <div className="wrap hero__inner">
        <div className="pill">
          <span className="dot" />
          competitive intel · for video ads · v0.4 live
        </div>

        <h1 className="hero__h1">
          <span className="hero__h1Top">Stop spending ten hours</span>
          <span className="hero__h1Top">on manual ad breakdowns.</span>
          <span className="hero__h1Bot glow-mint">Get the playbook in three minutes.</span>
        </h1>

        <p className="hero__sub">
          Adonis ingests any video ad — YouTube, Instagram, Facebook, TikTok — and writes
          the kind of teardown a senior strategist would charge a few grand for.
          Scene by scene. Hook by hook.{' '}
          <span className="mint">In the time it takes to refill your coffee.</span>
        </p>

        <div className="hero__ctas">
          <button className="btn btn--primary" onClick={onEnroll}>
            Enroll for launch <Arrow />
          </button>
          <button className="btn btn--ghost" onClick={onOpenSample}>
            See a sample teardown
          </button>
          <a
            className="hero__ghLink"
            href="https://github.com/cristidan94/adonis-smart-ads"
            target="_blank"
            rel="noreferrer"
          >
            <GhIcon /> source on github
          </a>
        </div>

        <div className="hero__demoWrap">
          <div className="hero__demoLabel font-mono">
            <span><span className="dot" /> live demo · runs in your browser · no upload required</span>
            <span className="muted">~3 min in production · sped up here</span>
          </div>
          <HeroDemoWrapped speed="normal" />
        </div>

        <div className="hero__stats">
          <Stat label="Platforms" value="4" detail="YouTube · Instagram · Facebook · TikTok" />
          <Stat label="Signals tracked" value="30+" detail="hooks · cuts · faces · sentiment · scenes · audio" />
          <Stat label="Time per ad" value="~3 min" detail="from URL to a written playbook" />
          <Stat label="Stays private" value="100% local" detail="your research never leaves your machine" />
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="stat hud-frame">
      <div className="stat__label">{label}</div>
      <div className="stat__value">{value}</div>
      <div className="stat__detail">{detail}</div>
    </div>
  )
}
