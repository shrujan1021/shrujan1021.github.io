import { useEffect, useRef, useState } from 'react'
import { Menu, X, FileText, ArrowUpRight } from 'lucide-react'
import { profile, navLinks } from '../data.js'
import useResume from '../useResume.js'

export function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const toggleRef = useRef(null)
  const panelRef = useRef(null)
  const resumeAvailable = useResume()

  // Header background once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Deep links (/#skills, /#contact).

     The in-page anchors call preventDefault() to run their own smooth
     scroll, so the browser never performs its native jump — which left a
     shared link landing at the top of the page. Re-runs the jump after
     layout settles (fonts and lazy content shift the offsets) and uses an
     instant scroll, since the visitor did not ask for a long animation. */
  useEffect(() => {
    let id = ''
    try {
      id = decodeURIComponent(window.location.hash.slice(1))
    } catch {
      return
    }
    if (!id || !document.getElementById(id)) return

    let cancelled = false
    const jump = () => {
      if (cancelled) return
      document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' })
    }

    const raf = window.requestAnimationFrame(jump)
    const timer = window.setTimeout(jump, 600)
    document.fonts?.ready.then(jump)

    return () => {
      cancelled = true
      window.cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [])

  // Highlight the section currently in view.
  useEffect(() => {
    const onScroll = () => {
      let current = ''
      for (const link of navLinks) {
        const el = document.getElementById(link.id)
        if (el && window.scrollY >= el.offsetTop - 160) current = link.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on Escape and return focus to the toggle.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Prevent background scrolling while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close when tapping anywhere outside the menu panel.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (panelRef.current?.contains(e.target) || toggleRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const handleNavigate = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#top" className="brand" onClick={handleNavigate('top')}>
          <span className="brand-mark">SM</span>
          <span className="brand-name">{profile.name}</span>
          <span className="sr-only">— back to top</span>
        </a>

        <nav
          id="site-nav"
          ref={panelRef}
          className={`nav ${open ? 'is-open' : ''}`}
          aria-label="Main"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={active === link.id ? 'is-active' : ''}
              aria-current={active === link.id ? 'true' : undefined}
              onClick={handleNavigate(link.id)}
            >
              {link.label}
            </a>
          ))}

          {resumeAvailable && (
            <a
              className="btn btn-primary nav-resume"
              href={profile.resumeUrl}
              download={profile.resumeFilename}
            >
              <FileText size={16} aria-hidden="true" />
              Résumé
            </a>
          )}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}

