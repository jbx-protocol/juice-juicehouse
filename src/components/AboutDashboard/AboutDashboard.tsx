import { Footer } from 'components/Footer'
import { AboutTheProtocolSection } from './components/AboutTheProtocolSection'
import { BuiltByTheBestSection } from './components/BuiltByTheBestSection'
import { FindOutMoreSection } from './components/FindOutMoreSection'
import { HeroSection } from './components/HeroSection'
import { JuiceboxDaoSection } from './components/JuiceboxDaoSection'
import { OurMissionSection } from './components/OurMissionSection'
import { WhatDoWeValueSection } from './components/WhatDoWeValueSection'

export const AboutDashboard = () => {
  return (
    <>
      <div className="[&>*:nth-child(even)]:bg-smoke-50 [&>*:nth-child(odd)]:bg-white">
        <HeroSection />
        <OurMissionSection />
        <AboutTheProtocolSection />
        <JuiceboxDaoSection />
        <WhatDoWeValueSection />
        <BuiltByTheBestSection />
        <FindOutMoreSection />
      </div>
      <Footer />
    </>
  )
}