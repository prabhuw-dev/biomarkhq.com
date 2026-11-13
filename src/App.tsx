import './App.css'
import { SiteHeader } from './components/sections/SiteHeader'
import { Hero } from './components/sections/Hero'
import { HowItWorks } from './components/sections/HowItWorks'
import { Dashboard } from './components/sections/Dashboard'
import { Trends } from './components/sections/Trends'
import { Insights } from './components/sections/Insights'
import { PlansAndRetesting } from './components/sections/PlansAndRetesting'
import { Privacy } from './components/sections/Privacy'
import { AskBiomarkHQ } from './components/sections/AskBiomarkHQ'
import { ClosingCta } from './components/sections/ClosingCta'
import { SiteFooter } from './components/sections/SiteFooter'

function App() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Hero />
        <HowItWorks />
        <Dashboard />
        <Trends />
        <Insights />
        <PlansAndRetesting />
        <Privacy />
        <AskBiomarkHQ />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  )
}

export default App
