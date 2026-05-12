import { WebGLBackground } from './WebGLBackground'
import { Hero } from './sections/Hero'
import { Features } from './sections/Features'
import { Pipeline } from './sections/Pipeline'
import { Stack } from './sections/Stack'
import { Footer } from './sections/Footer'

export function App() {
  return (
    <>
      <WebGLBackground />
      <div className="relative scan-lines" style={{ zIndex: 1 }}>
        <Hero />
        <Features />
        <Pipeline />
        <Stack />
        <Footer />
      </div>
    </>
  )
}
