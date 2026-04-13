import Hero from '@/components/sections/Hero'
import TheFlat from '@/components/sections/TheFlat'
import Araki from '@/components/sections/Araki'
import GettingAround from '@/components/sections/GettingAround'
import Explore from '@/components/sections/Explore'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <TheFlat />
      <div className="section-divider" />
      <Araki />
      <div className="section-divider" />
      <GettingAround />
      <div className="section-divider" />
      <Explore />
      <Contact />
    </main>
  )
}
