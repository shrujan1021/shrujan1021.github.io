import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Work from './components/Work.jsx'
import CaseStudy from './components/CaseStudy.jsx'
import Skills from './components/Skills.jsx'
import Approach from './components/Approach.jsx'
import Experience from './components/Experience.jsx'
import Education from './components/Education.jsx'
import Certifications from './components/Certifications.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  // Gentle entrance transitions, respecting the user's motion preference.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('main > section'))
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || typeof IntersectionObserver === 'undefined') {
      sections.forEach((el) => el.classList.add('reveal', 'is-visible'))
      return
    }

    sections.forEach((el) => el.classList.add('reveal'))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.04, rootMargin: '0px 0px -60px 0px' }
    )

    sections.forEach((el) => observer.observe(el))

    // Safety net: never leave content hidden if the observer misfires.
    const failsafe = window.setTimeout(() => {
      sections.forEach((el) => el.classList.add('is-visible'))
    }, 4000)

    return () => {
      observer.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <About />
        <Work />
        <CaseStudy />
        <Skills />
        <Approach />
        <Experience />
        <Education />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
