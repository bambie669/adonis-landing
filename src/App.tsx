import { Hero } from './sections/Hero'
import { Features } from './sections/Features'
import { Pipeline } from './sections/Pipeline'
import { Stack } from './sections/Stack'
import { Footer } from './sections/Footer'

export function App() {
  return (
    <div className="relative scan-lines">
      <Hero />
      <Features />
      <Pipeline />
      <Stack />
      <Footer />
    </div>
  )
}
