import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Platform, HowItWorks, PublishEverywhere, Stats, Closing, SiteFooter } from './sections/sections'

export function App() {
  return (
    <div className="rd">
      <div className="atmos" />
      <Nav />
      <main>
        <Hero />
        <Platform />
        <HowItWorks />
        <PublishEverywhere />
        <Stats />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  )
}
