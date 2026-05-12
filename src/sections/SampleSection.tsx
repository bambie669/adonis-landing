import { SectionHead } from './Features'
import { SceneArt } from '../webgl/SceneArt'
import { Arrow } from '../components/Icons'

const FRAME_TIMES = ['0:00', '0:02', '0:05', '0:09', '0:13', '0:17']

interface Props {
  onOpen: () => void
}

export function SampleSection({ onOpen }: Props) {
  const trigger = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen()
    }
  }

  return (
    <section id="sample" className="section grid-bg">
      <div className="wrap">
        <SectionHead label="see the output" title="One sample teardown. Click in." />
        <p className="sample__lede">
          Before you clone the repo. Before you trust the marketing copy. Look at what
          Adonis actually produces — a real playbook, every beat broken down, every signal tagged.
          This is the artifact your strategy meeting is missing.
        </p>

        <div
          className="sample__preview"
          onClick={onOpen}
          role="button"
          tabIndex={0}
          onKeyDown={trigger}
        >
          <div className="sample__previewLeft">
            <div className="sample__previewLabel">
              <span className="dot" />playbook · 18s reel · @nuverse
            </div>
            <div className="sample__previewTitle">Skincare reel — pattern-interrupt opener</div>
            <div className="sample__previewMeta">
              <span>6 scenes</span><span className="td__sep">·</span>
              <span className="mint">11.4% hook rate</span><span className="td__sep">·</span>
              <span className="orange">14 sibling ads mapped</span>
            </div>
            <p className="sample__previewBody">
              The teardown reads the silence in the opening frame, why the social-proof
              screenshot is held 2.4 seconds longer than any other beat, and what cut
              the top-performing variant is making instead.
            </p>
            <div className="sample__previewCta">
              <span className="btn btn--primary">
                Open sample teardown <Arrow />
              </span>
              <span className="sample__previewHint muted">no signup · in-browser</span>
            </div>
          </div>
          <div className="sample__previewRight">
            <div className="sample__previewFrames">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="sample__previewFrame" style={{ animationDelay: `${i * 0.1}s` }}>
                  <SceneArt idx={i} />
                  <div className="sample__previewFrameLabel">{FRAME_TIMES[i]}</div>
                </div>
              ))}
            </div>
            <div className="sample__previewBadge">
              <div className="sample__previewBadgeLabel">written playbook</div>
              <div className="sample__previewBadgeLines">
                <span /><span /><span /><span style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
