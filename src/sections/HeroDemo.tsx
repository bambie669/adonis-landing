import { useEffect, useRef, useState } from 'react'
import { SceneArt } from '../webgl/SceneArt'

const DEMO_URL = 'instagram.com/reel/Cm9aF2pXq1k'

interface Scene {
  t: string
  tag: string
  sig: string
  beat: string
}

const DEMO_SCENES: Scene[] = [
  { t: '00:00', tag: 'pattern interrupt',   sig: 'face · close-up · static product reveal',  beat: 'hook' },
  { t: '00:02', tag: 'tension build',       sig: 'creator → camera · whip pan · audio rise', beat: 'tension' },
  { t: '00:05', tag: 'product in use',      sig: 'hands · texture · product label visible',  beat: 'demo' },
  { t: '00:09', tag: 'social proof',        sig: 'on-screen caption · review screenshot',    beat: 'proof' },
  { t: '00:13', tag: 'value spike',         sig: 'before/after · text overlay · zoom-in',    beat: 'reveal' },
  { t: '00:17', tag: 'call to action',      sig: 'CTA button graphic · arrow · price',       beat: 'cta' },
]

type LineKind = 'h' | 'm' | 'k' | 'p'
interface PlaybookLine {
  kind: LineKind
  text: string
}

const PLAYBOOK_LINES: PlaybookLine[] = [
  { kind: 'h', text: 'PLAYBOOK · 18s skincare reel · @nuverse' },
  { kind: 'm', text: '— why this is converting —' },
  { kind: 'k', text: 'HOOK (0:00–0:02)' },
  { kind: 'p', text: 'Pattern interrupt: static close-up of an unfamiliar object before any speech. Stops the scroll by refusing to be a face-cam in the first frame.' },
  { kind: 'k', text: 'TENSION (0:02–0:05)' },
  { kind: 'p', text: 'Whip pan to creator → unanswered question read at conversational pace. Audio rises with the cut to register as a beat, not an ad.' },
  { kind: 'k', text: 'PAYOFF (0:09–0:13)' },
  { kind: 'p', text: 'Social proof screenshot is held on screen 2.4s — longer than any other scene. The viewer has time to read it; the algorithm reads it as engagement.' },
  { kind: 'k', text: 'CTA (0:17)' },
  { kind: 'p', text: 'Price-anchored at the end, not the start. The whole spot earns the right to ask.' },
  { kind: 'm', text: '— ecosystem map —' },
  { kind: 'p', text: '14 sibling ads found from @nuverse in the last 30 days. 9 reuse this exact hook pattern. Median runtime 17.6s. Top-performing variant cuts at 0:14 instead of 0:17.' },
]

const PLAYBOOK_TOTAL_CHARS = PLAYBOOK_LINES.reduce((n, l) => n + l.text.length, 0)

type Phase = 'idle' | 'typing' | 'extracting' | 'scenes' | 'playbook' | 'done'

interface Props {
  paused?: boolean
  speed?: 'slow' | 'normal' | 'fast'
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const STATUS: Record<Phase, string> = {
  idle: 'standby',
  typing: 'receiving url',
  extracting: 'extracting frames',
  scenes: 'parsing scenes',
  playbook: 'writing playbook',
  done: 'playbook ready',
}

export function HeroDemo({ paused = false, speed = 'normal' }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [urlTyped, setUrlTyped] = useState(0)
  const [scenesShown, setScenesShown] = useState(0)
  const [pbChars, setPbChars] = useState(0)
  const [activeScene, setActiveScene] = useState(0)

  useEffect(() => {
    if (paused) {
      setPhase('done')
      setUrlTyped(DEMO_URL.length)
      setScenesShown(DEMO_SCENES.length)
      setPbChars(PLAYBOOK_TOTAL_CHARS)
      setActiveScene(DEMO_SCENES.length - 1)
      return
    }

    const mult = speed === 'fast' ? 0.55 : speed === 'slow' ? 1.6 : 1
    let cancelled = false

    const cycle = async () => {
      while (!cancelled) {
        setPhase('typing'); setUrlTyped(0); setScenesShown(0); setPbChars(0); setActiveScene(0)
        for (let i = 0; i <= DEMO_URL.length; i++) {
          await wait(60 * mult); if (cancelled) return; setUrlTyped(i)
        }
        await wait(400 * mult); if (cancelled) return

        setPhase('extracting'); await wait(1200 * mult); if (cancelled) return

        setPhase('scenes')
        for (let i = 1; i <= DEMO_SCENES.length; i++) {
          await wait(450 * mult); if (cancelled) return
          setScenesShown(i); setActiveScene(i - 1)
        }
        await wait(400 * mult); if (cancelled) return

        setPhase('playbook')
        const STREAM_MS = 9500 * mult
        const start = performance.now()
        await new Promise<void>((resolve) => {
          const tick = () => {
            if (cancelled) { resolve(); return }
            const elapsed = performance.now() - start
            const ratio = Math.min(1, elapsed / STREAM_MS)
            setPbChars(Math.floor(ratio * PLAYBOOK_TOTAL_CHARS))
            const sceneIdx = Math.min(DEMO_SCENES.length - 1, Math.floor(ratio * DEMO_SCENES.length))
            setActiveScene(sceneIdx)
            if (ratio < 1) requestAnimationFrame(tick)
            else resolve()
          }
          requestAnimationFrame(tick)
        })
        if (cancelled) return

        setPhase('done')
        await wait(3500 * mult); if (cancelled) return
      }
    }

    cycle()
    return () => { cancelled = true }
  }, [paused, speed])

  return (
    <div className="demo">
      <div className="demo__chrome">
        <div className="demo__dots"><span /><span /><span /></div>
        <div className="demo__title font-mono">adonis · live extract</div>
        <div className="demo__status">
          <span className="dot" />
          <span>{STATUS[phase]}</span>
        </div>
      </div>

      <div className="demo__body">
        <div className="demo__url">
          <div className="demo__urlLabel font-mono">paste url</div>
          <div className="demo__urlInput">
            <span className="font-mono demo__protocol">https://</span>
            <span className="font-mono demo__urlText">{DEMO_URL.slice(0, urlTyped)}</span>
            {phase === 'typing' && <span className="demo__caret" />}
          </div>
          <div className="demo__urlBtn font-mono">
            {phase === 'idle' || phase === 'typing' ? 'extract →' :
             phase === 'extracting' ? <span className="demo__spinner" /> :
             '✓ ready'}
          </div>
        </div>

        <div className="demo__split">
          <div className="demo__scenes">
            <div className="demo__colHead font-mono">
              <span>scenes</span>
              <span className="muted">{scenesShown}/{DEMO_SCENES.length}</span>
            </div>
            <div className="demo__sceneList">
              {DEMO_SCENES.map((s, i) => (
                <SceneCard
                  key={i}
                  idx={i}
                  scene={s}
                  visible={i < scenesShown}
                  active={i === activeScene && phase === 'playbook'}
                />
              ))}
              {(phase === 'typing' || phase === 'idle') && (
                <div className="demo__empty font-mono">awaiting url</div>
              )}
              {phase === 'extracting' && scenesShown === 0 && (
                <div className="demo__empty font-mono">extracting frames…</div>
              )}
            </div>
          </div>

          <div className="demo__playbook">
            <div className="demo__colHead font-mono">
              <span>playbook</span>
              <span className="muted">{phase === 'playbook' || phase === 'done' ? 'streaming' : 'queued'}</span>
            </div>
            <div className="demo__pbBody">
              {phase === 'playbook' || phase === 'done' ? (
                <StreamedPlaybook chars={pbChars} streaming={phase === 'playbook'} />
              ) : (
                <div className="demo__pbWait">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="demo__skel" style={{ width: `${30 + (i * 9) % 55}%` }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SceneCardProps {
  idx: number
  scene: Scene
  visible: boolean
  active: boolean
}

function SceneCard({ idx, scene, visible, active }: SceneCardProps) {
  return (
    <div className={`scene ${visible ? 'scene--in' : ''} ${active ? 'scene--active' : ''}`}>
      <div className="scene__frame">
        <SceneArt idx={idx} />
        <div className="scene__time font-mono">{scene.t}</div>
        <div className="scene__beat font-mono">{scene.beat}</div>
      </div>
      <div className="scene__meta">
        <div className="scene__tag font-mono">{scene.tag}</div>
        <div className="scene__sig">{scene.sig}</div>
      </div>
    </div>
  )
}

interface StreamedPlaybookProps {
  chars: number
  streaming: boolean
}

function StreamedPlaybook({ chars, streaming }: StreamedPlaybookProps) {
  let remaining = chars
  return (
    <div className="pb">
      {PLAYBOOK_LINES.map((line, i) => {
        if (remaining <= 0) return null
        const take = Math.min(remaining, line.text.length)
        const isLast = remaining - take <= 0 && take < line.text.length
        remaining -= take
        const text = line.text.slice(0, take)
        const cls =
          line.kind === 'h' ? 'pb__h' :
          line.kind === 'm' ? 'pb__m' :
          line.kind === 'k' ? 'pb__k' :
          'pb__p'
        return (
          <div key={i} className={cls}>
            {text}
            {isLast && streaming && <span className="pb__caret" />}
          </div>
        )
      })}
    </div>
  )
}

/** Wraps HeroDemo with viewport + reduced-motion gating. */
export function HeroDemoWrapped({ speed = 'normal' as 'slow' | 'normal' | 'fast' }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [pausedByViewport, setPausedByViewport] = useState(false)
  const [pausedByMotion, setPausedByMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPausedByMotion(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setPausedByMotion(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry) setPausedByViewport(entry.intersectionRatio === 0)
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef}>
      <HeroDemo paused={pausedByViewport || pausedByMotion} speed={speed} />
    </div>
  )
}
