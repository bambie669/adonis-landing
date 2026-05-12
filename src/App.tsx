import { useState } from 'react'
import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Features } from './sections/Features'
import { Pipeline } from './sections/Pipeline'
import { SampleSection } from './sections/SampleSection'
import { Stack } from './sections/Stack'
import { ClosingCta } from './sections/ClosingCta'
import { Footer } from './sections/Footer'
import { SampleTeardownModal } from './components/SampleTeardownModal'
import { EnrollModal } from './components/EnrollModal'
import { StickyMobileCta } from './components/StickyMobileCta'

export function App() {
  const [sampleOpen, setSampleOpen] = useState(false)
  const [enrollOpen, setEnrollOpen] = useState(false)
  const openSample = () => setSampleOpen(true)
  const openEnroll = () => setEnrollOpen(true)

  return (
    <div className="relative scan-lines">
      <Nav onEnroll={openEnroll} />
      <Hero onEnroll={openEnroll} onOpenSample={openSample} />
      <Features />
      <Pipeline />
      <SampleSection onOpen={openSample} />
      <Stack />
      <ClosingCta onEnroll={openEnroll} onOpenSample={openSample} />
      <Footer />
      <StickyMobileCta onEnroll={openEnroll} />
      {sampleOpen && <SampleTeardownModal onClose={() => setSampleOpen(false)} />}
      {enrollOpen && <EnrollModal onClose={() => setEnrollOpen(false)} />}
    </div>
  )
}
