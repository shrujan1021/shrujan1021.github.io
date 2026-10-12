import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { hero, orbitMoons } from '../data.js'

const HeroScene = lazy(() => import('../three/HeroScene.jsx'))

function supportsWebGL() {
  try {
    if (typeof window === 'undefined' || !window.WebGLRenderingContext) return false
    const c = document.createElement('canvas')
    return !!(
      c.getContext('webgl2') ||
      c.getContext('webgl') ||
      c.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

/* Only genuinely incapable hardware is refused. A laptop reporting a couple
   of cores still gets the sculpture — just at the lighter quality tier.
   Constrained devices are detected once the scene has actually struggled. */
function cannotRunWebGL() {
  if (typeof navigator === 'undefined') return false
  const memory = navigator.deviceMemory
  return typeof memory === 'number' && memory <= 1
}

function useMedia(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }
    mq.addListener(onChange)
    return () => mq.removeListener(onChange)
  }, [query])

  return matches
}

/* -------------------------------------------------------------------------
   Loading, capability and performance gate for the 3D hero.

   - Lazy-loads the Three.js chunk so first paint is never blocked.
   - Renders nothing but a CSS composition when WebGL is unavailable.
   - Pauses the render loop when the hero is off-screen or the tab hidden.
   - Reads pointer position on the window, so the canvas itself can keep
     `pointer-events: none` and never swallow clicks or scrolling.
   ------------------------------------------------------------------------- */
export default function HeroCanvas() {
  const hostRef = useRef(null)
  const stageRef = useRef(null)
  const invalidateRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0, scroll: 0, hover: 0 })
  /* Raw pointer coordinates, read inside rAF rather than stored in React
     state — no re-render per mouse move. */
  const pointer = useRef({ x: -1e5, y: -1e5 })
  /* Drag-to-spin accumulator. Persisted across frames and handed to the
     scene, so the visitor can physically turn the sculpture. */
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0, rotX: 0, rotY: 0 })

  const [webgl, setWebgl] = useState(null)
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)

  const coarse = useMedia('(pointer: coarse)')

  /* Probe for capability only once the page has finished loading AND the
     browser is idle. This keeps the Three.js download and its parse off the
     critical path, so first paint and web fonts always win. */
  useEffect(() => {
    let cancelled = false

    const start = () => {
      const schedule = (fn) => {
        if (typeof window.requestIdleCallback === 'function') {
          const id = window.requestIdleCallback(fn, { timeout: 2500 })
          return () => window.cancelIdleCallback(id)
        }
        const id = window.setTimeout(fn, 200)
        return () => window.clearTimeout(id)
      }
      cancelIdle = schedule(() => {
        if (!cancelled) setWebgl(supportsWebGL() && !cannotRunWebGL())
      })
    }

    let cancelIdle = null
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })

    return () => {
      cancelled = true
      window.removeEventListener('load', start)
      if (cancelIdle) cancelIdle()
    }
  }, [])

  // Stop rendering once the hero scrolls out of view.
  useEffect(() => {
    const el = hostRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { threshold: 0.01 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Stop rendering while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  /* Pointer, hover and scroll input — attached to the window, never to the
     canvas, so the canvas keeps `pointer-events: none` and can never swallow
     a click, a tap or a scroll gesture.

     Deliberately NOT gated on prefers-reduced-motion: this motion only
     happens because the visitor caused it. Reduced motion suppresses the
     idle spin, not the response to input. */
  useEffect(() => {
    if (webgl !== true) return

    let frame = 0

    const apply = () => {
      frame = 0
      const host = hostRef.current
      const stage = stageRef.current
      if (!host || !stage) return

      const hostRect = host.getBoundingClientRect()
      const stageRect = stage.getBoundingClientRect()

      const x = pointer.x
      const y = pointer.y

      /* Before the first pointer event, and again once the pointer leaves
         the document, the raw coordinate is the -1e5 sentinel (or a missing
         clientX). Normalising that would aim the parallax at a huge,
         layout-dependent angle and leave the artwork resting in whatever
         arbitrary pose that happens to produce. No pointer means no input,
         so the scene relaxes to its designed composition instead. */
      const noPointer =
        !Number.isFinite(x) || !Number.isFinite(y) || x < -1e4 || y < -1e4

      /* Hoisted above the branch: `inside` also feeds setHovered() below.
         Scoped to the else-block it would leave that call reading a binding
         that does not exist, which throws before the frame is invalidated —
         and the artwork then stops responding to the pointer entirely. */
      const inside =
        !noPointer &&
        x >= stageRect.left &&
        x <= stageRect.right &&
        y >= stageRect.top &&
        y <= stageRect.bottom

      // Normalised against the STAGE (the artwork), not the whole block, so
      // the parallax feels attached to the object.
      if (noPointer) {
        pointerRef.current.x = 0
        pointerRef.current.y = 0
        pointerRef.current.hover = 0
        pointerRef.current.active = false
      } else {
        pointerRef.current.active = true
        pointerRef.current.x = (x - stageRect.left) / Math.max(stageRect.width, 1) * 2 - 1
        pointerRef.current.y = (y - stageRect.top) / Math.max(stageRect.height, 1) * 2 - 1

        // Hover is a soft 0→1 value measured by proximity to the stage centre
        // in both axes, so approaching the sculpture ramps the response up.
        pointerRef.current.hover = inside
          ? 1
          : Math.max(
              0,
              1 -
                Math.max(
                  (stageRect.left - x) / Math.max(stageRect.width, 0.5),
                  (x - stageRect.right) / Math.max(stageRect.width, 0.5),
                  (stageRect.top - y) / Math.max(stageRect.height, 0.5),
                  (y - stageRect.bottom) / Math.max(stageRect.height, 0.5)
                ) * 2.4
            )
      }

      const h = Math.max(hostRect.height, 1)
      pointerRef.current.scroll = Math.min(Math.max(-hostRect.top / h, 0), 1)

      setHovered(inside)
      invalidateRef.current?.()
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(apply)
    }

    const onMove = (e) => {
      // Keep the last good coordinate rather than importing an undefined one.
      if (Number.isFinite(e.clientX)) pointer.x = e.clientX
      if (Number.isFinite(e.clientY)) pointer.y = e.clientY
      schedule()
    }

    const onLeave = () => {
      pointer.x = -1e5
      pointer.y = -1e5
      schedule()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('pointerdown', schedule, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    schedule()

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('pointerdown', schedule)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [webgl])

  /* Drag-to-spin. Bound to the stage element itself (not the window), so
     dragging over the artwork rotates it while the rest of the page —
     including the hero copy and buttons — behaves completely normally.
     `touch-action: pan-y` on the stage means vertical swipes still scroll
     the page on a phone; only a horizontal drag is claimed for rotation. */
  useEffect(() => {
    if (webgl !== true) return
    const stage = stageRef.current
    if (!stage) return

    const onDown = (e) => {
      dragRef.current.active = true
      dragRef.current.lastX = e.clientX
      dragRef.current.lastY = e.clientY
      stage.setPointerCapture?.(e.pointerId)
      stage.classList.add('is-dragging')
      setDragging(true)
    }

    const onDragMove = (e) => {
      const d = dragRef.current
      if (!d.active) return
      const dx = e.clientX - d.lastX
      const dy = e.clientY - d.lastY
      d.lastX = e.clientX
      d.lastY = e.clientY
      d.rotY += dx * 0.0062
      d.rotX += dy * 0.0052
      invalidateRef.current?.()
    }

    const finish = (e) => {
      if (!dragRef.current.active) return
      dragRef.current.active = false
      stage.releasePointerCapture?.(e.pointerId)
      stage.classList.remove('is-dragging')
      setDragging(false)
    }

    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onDragMove)
    stage.addEventListener('pointerup', finish)
    stage.addEventListener('pointercancel', finish)

    return () => {
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onDragMove)
      stage.removeEventListener('pointerup', finish)
      stage.removeEventListener('pointercancel', finish)
      stage.classList.remove('is-dragging')
    }
  }, [webgl])

  /* Quality tier: touch devices and light hardware get the cheaper core
     material and fewer particles, not a switched-off scene. */
  const lowPower =
    coarse ||
    (typeof navigator !== 'undefined' &&
      ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        (navigator.deviceMemory && navigator.deviceMemory <= 4)))

  const showFallback = webgl !== true || !ready

  /* The caption promises an interaction, so it has to describe one that
     actually exists — and it changes once you're inside the stage. */
  const caption =
    webgl !== true
      ? '3D unavailable on this device — showing a still'
      : dragging
        ? 'Spinning · release to let go'
        : hovered
          ? 'Move your pointer to look around · drag to spin'
          : hero.visualCaption

  return (
    <div
      className={[
        'hero-visual',
        hovered ? 'is-hovered' : '',
        dragging ? 'is-dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      ref={hostRef}
      data-scene={ready ? 'live' : 'pending'}
      data-hover={hovered ? 'in' : 'out'}
    >
      <div className="hero-stage" ref={stageRef} aria-hidden="true">
        {/* Ambient light behind the object — always present, costs nothing. */}
        <span className="hero-glow hero-glow--warm" />
        <span className="hero-glow hero-glow--cool" />
        <span className="hero-glow hero-glow--deep" />
        <span className="hero-glow hero-glow--rim" />
        <span className="hero-grid" />
        <span className="hero-reticle" />

        {showFallback && (
          <div className="hero-fallback">
            <span className="hf-ring" />
            <span className="hf-ring hf-ring--b" />
            <span className="hf-core" />
          </div>
        )}

        {webgl === true && (
          <Suspense fallback={null}>
            <HeroScene
              active={inView && pageVisible}
              quality={lowPower ? 'low' : 'high'}
              pointerRef={pointerRef}
              dragRef={dragRef}
              invalidateRef={invalidateRef}
              moons={orbitMoons}
              onReady={() => setReady(true)}
            />
          </Suspense>
        )}
      </div>

      <p className="hero-visual-cap" aria-hidden="true">
        {caption}
      </p>
    </div>
  )
}
