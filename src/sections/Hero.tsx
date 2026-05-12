import { useCallback, useRef } from 'react'
import { NebulaShader, type NebulaFrameState } from '../webgl/NebulaShader'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const h1Ref   = useRef<HTMLHeadingElement>(null)
  const subRef  = useRef<HTMLParagraphElement>(null)

  const handleFrame = useCallback((s: NebulaFrameState) => {
    if (h1Ref.current) {
      h1Ref.current.style.transform =
        `translate3d(${s.mouseX * 8}px, ${s.mouseY * 8}px, 0)`
    }
    if (subRef.current) {
      subRef.current.style.transform =
        `translate3d(${s.mouseX * 4}px, ${s.mouseY * 4}px, 0)`
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden hud-frame"
    >
      <NebulaShader heroRef={heroRef} onFrame={handleFrame} />

      <div className="relative z-10 max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-mint-500/30 text-mint-500 text-xs font-mono uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-mint-500 status-live" />
          competitive intel · for video ads
        </div>

        <h1
          ref={h1Ref}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 will-change-transform"
        >
          <span className="block text-white/95">Steal the playbook</span>
          <span className="block glow-mint text-mint-500">behind every viral ad.</span>
        </h1>

        <p
          ref={subRef}
          className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed mb-10 will-change-transform"
        >
          Drop in any video ad from YouTube, Instagram, Facebook or TikTok.
          Adonis breaks it down hook by hook, scene by scene, and writes you
          the blueprint of why it converts. Then it shows you every ad in the
          same ecosystem — so you know exactly what you're up against.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <a
            href="https://github.com/cristidan94/adonis-smart-ads"
            target="_blank"
            rel="noreferrer"
            className="btn-hud px-6 py-3 rounded-md bg-accent-500 hover:bg-accent-600 text-white font-medium tracking-wide"
          >
            Run it yourself →
          </a>
          <a
            href="#pipeline"
            className="btn-hud px-6 py-3 rounded-md border border-mint-500/30 text-mint-500 hover:bg-mint-500/10 font-medium tracking-wide"
          >
            See how it works
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-left">
          <Stat label="Platforms"       value="4"           detail="YouTube · Instagram · Facebook · TikTok" />
          <Stat label="Signals tracked" value="30+"         detail="hooks · cuts · faces · sentiment · scenes · audio" />
          <Stat label="Time per ad"     value="~3 min"      detail="from URL to a written playbook" />
          <Stat label="Stays private"   value="100% local"  detail="your research never leaves your machine" />
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="hud-frame p-4 bg-void-900/40 backdrop-blur-sm">
      <div className="text-xs font-mono uppercase tracking-widest text-mint-500/70 mb-1">{label}</div>
      <div className="font-serif text-3xl text-white/95 mb-1">{value}</div>
      <div className="text-xs text-white/45 leading-snug">{detail}</div>
    </div>
  )
}
