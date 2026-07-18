import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'

export function App() {
  return (
    <div className="rd">
      <div className="atmos" />
      <Nav />
      <main>
        <Hero />
      </main>
    </div>
  )
}
