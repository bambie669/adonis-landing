export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-mint-500/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-serif text-2xl text-white/95">
            Adonis — <span className="text-mint-500 glow-mint">Steal the Playbook</span>
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-white/35 mt-1">
            competitive intel · for video ads · stays on your box
          </div>
        </div>

        <div className="flex gap-6 text-sm font-mono">
          <a
            href="https://github.com/cristidan94/adonis-smart-ads"
            target="_blank"
            rel="noreferrer"
            className="text-white/55 hover:text-mint-500 transition-colors"
          >
            run it yourself
          </a>
          <a
            href="https://github.com/cristidan94/adonis-smart-ads/blob/main/README.md"
            target="_blank"
            rel="noreferrer"
            className="text-white/55 hover:text-mint-500 transition-colors"
          >
            read the manual
          </a>
        </div>
      </div>
      <div className="text-center text-xs font-mono text-white/25 mt-8">
        © 2026 — built late, by hand
      </div>
    </footer>
  )
}
