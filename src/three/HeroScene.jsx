import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* -------------------------------------------------------------------------
   A slowly turning planet, built as an orrery:

     · a banded gas giant turning on a tilted axis
     · an open ring system sharing the planet's equator
     · two orbital paths, each carrying labelled moons — one language per
       moon, read straight from `orbitMoons` in src/data.js
     · a quiet field of stars behind it

   Nothing is downloaded. The planet's surface, the ring's alpha profile and
   the moon labels are all painted into canvases at runtime, and the
   reflections come from an emissive-card studio built locally.

   Motion is deliberately slow: the planet turns once every ~2 minutes, the
   moons orbit in ~85s and ~115s. Anything faster reads as a screensaver
   rather than an object.
   ------------------------------------------------------------------------- */

const PALETTE = {
  amber: '#e0a45c',
  slate: '#7f9bc9',
  clay: '#c4785a',
  bone: '#f2eee7',
}

/* Composition — kept in world units so the framing is easy to reason about.
   The camera sits at z = 12.8 with a 34° fov, giving ±3.91 of visible height;
   the outermost label still lands inside ±3.6. */
const PLANET_R = 1.45
const RING_IN = 1.72
const RING_OUT = 2.05
const BAND_A_R = 2.42
const BAND_B_R = 2.9

const SPIN_PLANET = 0.05 // rad/s — ~125s for a full turn
const SPIN_ORBIT_A = 0.075 // ~84s
const SPIN_ORBIT_B = 0.055 // ~114s

const LABEL_H = 0.4 // world height of a moon label
const LABEL_LIFT = 0.4 // how far it floats above its moon

/* Moon bodies are tinted from the same two accents the interface uses, plus
   two neutrals — so the artwork and the page read as one palette. */
const MOON_TINTS = [
  '#e0a45c',
  '#c4785a',
  '#7f9bc9',
  '#e8d7bd',
  '#a89178',
  '#d9b98a',
  '#8fa7cc',
  '#c99a6a',
]

/* Scratch vectors, hoisted out of useFrame so no allocation happens per frame. */
const scratchWorld = new THREE.Vector3()
const scratchNdc = new THREE.Vector3()

/* Deterministic noise — the planet must look identical on every reload. */
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* Build the procedural studio used for reflections. Cards wrap the object on
   every side so metal never picks up a dead-black reflection. The hues are
   the same amber / slate / clay as the rest of the design. */
function buildStudioScene() {
  const env = new THREE.Scene()
  // Not pure black: a warm floor keeps unlit metal reading as metal.
  env.background = new THREE.Color('#0e0d0b')

  const cards = [
    // color,        intensity, w,  h,  position,           rotation
    [PALETTE.amber, 5.0, 10, 10, [0, 0, -8], [0, 0, 0]],
    [PALETTE.slate, 4.2, 9, 7, [-7, 1, 2], [0, Math.PI / 2, 0]],
    [PALETTE.clay, 4.4, 7, 10, [7, 0, 1], [0, -Math.PI / 2, 0]],
    ['#f7ead6', 3.4, 8, 5, [3, 7, 1], [-Math.PI / 2, 0, 0]],
    ['#ffffff', 7.0, 5, 2.4, [-2.5, 6.5, 4], [-Math.PI / 2.6, 0, 0.3]],
    [PALETTE.amber, 3.4, 14, 4, [0, -7, 0], [Math.PI / 2, 0, 0]],
    [PALETTE.clay, 2.6, 8, 5, [-5, -4, -5], [0, Math.PI / 4, 0]],
    [PALETTE.slate, 2.2, 7, 4, [5, -4, -5], [0, -Math.PI / 4, 0]],
    // Two soft fill cards directly behind the camera axis: this is what
    // stops the near side of the planet from going black.
    ['#efe7db', 1.7, 16, 9, [0, 0, 9], [0, Math.PI, 0]],
    ['#e4dcd0', 1.2, 12, 8, [0, 9, 3], [Math.PI / 2.4, 0, 0]],
  ]

  cards.forEach(([color, intensity, w, h, pos, rot]) => {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(intensity),
      side: THREE.DoubleSide,
      toneMapped: false,
    })
    const card = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material)
    card.position.set(...pos)
    card.rotation.set(...rot)
    env.add(card)
  })

  return env
}

function disposeSceneObject(root) {
  const seen = new Set()
  root.traverse((obj) => {
    if (obj.geometry && !seen.has(obj.geometry)) {
      seen.add(obj.geometry)
      obj.geometry.dispose()
    }
    const mats = obj.material
    const list = Array.isArray(mats) ? mats : mats ? [mats] : []
    list.forEach((m) => {
      if (!seen.has(m)) {
        seen.add(m)
        m.dispose()
      }
    })
  })
  root.clear()
}

/* Procedural studio environment (built locally, zero network cost). */
function StudioEnvironment() {
  const { gl, scene } = useThree()

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const studio = buildStudioScene()

    const previousToneMapping = gl.toneMapping
    gl.toneMapping = THREE.NoToneMapping
    const target = pmrem.fromScene(studio, 0.02)
    gl.toneMapping = previousToneMapping

    scene.environment = target.texture

    return () => {
      scene.environment = null
      target.dispose()
      pmrem.dispose()
      disposeSceneObject(studio)
    }
  }, [gl, scene])

  return null
}

/* Warm key from one side, cool rim from the other — the classic way to give
   a sphere a readable terminator. The env map does the rest. */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.17} color="#8f93a6" />
      <directionalLight position={[7, 5, 9]} intensity={2.5} color="#fff3e3" />
      <pointLight
        position={[-7.5, -3, 5]}
        intensity={58}
        distance={34}
        decay={2}
        color={PALETTE.amber}
      />
      <pointLight
        position={[7, 4.5, -5]}
        intensity={72}
        distance={36}
        decay={2}
        color={PALETTE.slate}
      />
      <pointLight
        position={[0, -6, 4]}
        intensity={30}
        distance={26}
        decay={2}
        color={PALETTE.clay}
      />
    </>
  )
}

/* =========================================================================
   PROCEDURAL SURFACES
   ========================================================================= */

/* A warm gas-giant: latitude bands with wobbly edges, a handful of vortices
   and darker poles. Deterministic, so it never changes between reloads. */
function makePlanetTexture(quality) {
  const w = quality === 'high' ? 1024 : 512
  const h = w >> 1
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const g = canvas.getContext('2d')
  const rnd = mulberry32(20230901)

  const palette = [
    '#f6e8d2',
    '#eed6b3',
    '#e3bd8b',
    '#dcae74',
    '#cf9a5e',
    '#c08a52',
    '#ac7343',
    '#94603a',
  ]

  g.fillStyle = '#dcb27d'
  g.fillRect(0, 0, w, h)

  // Latitude bands, each with a sine-perturbed top and bottom edge.
  let y = -h * 0.04
  while (y < h) {
    const bandH = (0.028 + rnd() * 0.075) * h
    g.fillStyle = palette[(rnd() * palette.length) | 0]
    const amp = bandH * 0.4
    const phase = rnd() * Math.PI * 2
    const freq = 2 + rnd() * 5

    g.beginPath()
    g.moveTo(0, y)
    for (let x = 0; x <= w; x += 8) {
      g.lineTo(x, y + Math.sin(phase + (x / w) * Math.PI * 2 * freq) * amp)
    }
    g.lineTo(w, y + bandH)
    for (let x = w; x >= 0; x -= 8) {
      g.lineTo(x, y + bandH + Math.sin(phase + (x / w) * Math.PI * 2 * freq) * amp)
    }
    g.closePath()
    g.fill()

    y += bandH
  }

  // Storms and vortices, soft-edged so they sit inside the banding.
  for (let i = 0; i < 18; i += 1) {
    const cx = rnd() * w
    const cy = h * (0.12 + rnd() * 0.76)
    const rx = (0.018 + rnd() * 0.05) * w
    const ry = rx * (0.3 + rnd() * 0.3)
    const light = rnd() > 0.5
    const grd = g.createRadialGradient(cx, cy, 0, cx, cy, rx)
    grd.addColorStop(0, light ? 'rgba(247,233,209,0.5)' : 'rgba(118,72,40,0.42)')
    grd.addColorStop(0.6, light ? 'rgba(247,233,209,0.18)' : 'rgba(118,72,40,0.14)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.beginPath()
    g.ellipse(cx, cy, rx, ry, rnd() * Math.PI, 0, Math.PI * 2)
    g.fill()
  }

  // Polar shading, so the axis reads even before the light hits it.
  const north = g.createLinearGradient(0, 0, 0, h * 0.22)
  north.addColorStop(0, 'rgba(70,44,26,0.5)')
  north.addColorStop(1, 'rgba(70,44,26,0)')
  g.fillStyle = north
  g.fillRect(0, 0, w, h * 0.22)

  const south = g.createLinearGradient(0, h, 0, h * 0.78)
  south.addColorStop(0, 'rgba(70,44,26,0.5)')
  south.addColorStop(1, 'rgba(70,44,26,0)')
  g.fillStyle = south
  g.fillRect(0, h * 0.78, w, h * 0.22)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  return texture
}

/* RingGeometry maps UVs over its bounding box, which would stretch a radial
   profile around the annulus. Remap them so u = distance from centre. */
function createRingGeometry(inner, outer, thetaSegments = 220) {
  const geometry = new THREE.RingGeometry(inner, outer, thetaSegments, 1)
  const pos = geometry.attributes.position
  const uv = geometry.attributes.uv
  const vertex = new THREE.Vector3()

  for (let i = 0; i < pos.count; i += 1) {
    vertex.fromBufferAttribute(pos, i)
    const radial = (vertex.length() - inner) / (outer - inner)
    const angle = Math.atan2(vertex.y, vertex.x) / (Math.PI * 2) + 0.5
    uv.setXY(i, radial, angle)
  }
  uv.needsUpdate = true
  return geometry
}

/* Ring alpha profile: banded density with a Cassini-style gap, drawn as a
   single strip and read radially. */
function makeRingTexture() {
  const w = 512
  const h = 8
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const g = canvas.getContext('2d')
  const rnd = mulberry32(9182)

  for (let x = 0; x < w; x += 1) {
    const t = x / (w - 1)

    // Overall envelope: bright near the planet, fading at the outer edge.
    // Deliberately high — at low alpha the rings composite to almost nothing
    // over a black background and read as a smudge instead of a ring.
    let a = 0.64 + 0.22 * Math.sin(t * 23) + 0.12 * Math.sin(t * 61 + 1.7)
    a *= Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0.02, t))), 0.35)

    if (t > 0.58 && t < 0.65) a *= 0.12 // the main division
    if (t > 0.27 && t < 0.31) a *= 0.48
    if (t < 0.08) a *= 0.6
    a += (rnd() - 0.5) * 0.06
    a = Math.min(0.92, Math.max(0, a))

    // Bone through to sand — never neutral grey, never saturated.
    const warm = 0.93 + 0.07 * Math.sin(t * 9 + 0.4)
    const r = Math.round(248 * warm)
    const gg = Math.round(234 * warm)
    const b = Math.round(208 * warm)

    g.fillStyle = `rgba(${r},${gg},${b},${a.toFixed(3)})`
    g.fillRect(x, 0, 1, h)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/* A moon's name, painted once into a small canvas and shown as a billboard.
   A dark plate sits behind the type so it stays readable where it crosses
   the planet. */
function makeLabelTexture(text) {
  const font = '600 56px "Space Grotesk", "Inter", system-ui, sans-serif'
  const padX = 30
  const h = 110

  const measure = document.createElement('canvas').getContext('2d')
  measure.font = font
  try {
    measure.letterSpacing = '0.06em'
  } catch {
    /* older engines simply draw tighter */
  }
  const w = Math.ceil(measure.measureText(text).width) + padX * 2

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(w, 64)
  canvas.height = h
  const g = canvas.getContext('2d')

  g.font = font
  try {
    g.letterSpacing = '0.06em'
  } catch {
    /* ignore */
  }
  g.textAlign = 'center'
  g.textBaseline = 'middle'

  const plateH = 68
  const plateY = (h - plateH) / 2
  g.fillStyle = 'rgba(10, 9, 8, 0.74)'
  g.beginPath()
  g.roundRect ? g.roundRect(6, plateY, w - 12, plateH, 12) : g.rect(6, plateY, w - 12, plateH)
  g.fill()

  g.fillStyle = '#f4f0e9'
  g.fillText(text, w / 2, h / 2 + 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  return { texture, aspect: canvas.width / canvas.height }
}

/* =========================================================================
   SUPPORTING PIECES
   ========================================================================= */

/* Starfield — one draw call, tinted with the same warm/cool accents. */
function Starfield({ quality }) {
  const ref = useRef()
  const count = quality === 'high' ? 380 : 150

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#f2eee7'),
      new THREE.Color('#f7ead6'),
      new THREE.Color(PALETTE.amber),
      new THREE.Color(PALETTE.slate),
      new THREE.Color('#c9c2b6'),
    ]
    const rnd = mulberry32(4477)

    for (let i = 0; i < count; i += 1) {
      const r = 4.4 + Math.pow(rnd(), 0.55) * 6.2
      const theta = rnd() * Math.PI * 2
      const phi = Math.acos(2 * rnd() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.78
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

      const c = palette[(rnd() * palette.length) | 0]
      const dim = 0.3 + rnd() * 0.7
      colors[i * 3] = c.r * dim
      colors[i * 3 + 1] = c.g * dim
      colors[i * 3 + 2] = c.b * dim
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [count])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += Math.min(delta, 0.05) * 0.022
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.14
  })

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={quality === 'high' ? 0.042 : 0.058}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

/* One shared soft-disc texture for every halo — created once, never
   per-instance, and deliberately not disposed with any single sprite. */
let sharedHaloTexture = null
function haloTexture() {
  if (sharedHaloTexture) return sharedHaloTexture
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.5)')
  gradient.addColorStop(0.55, 'rgba(255,255,255,0.12)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  sharedHaloTexture = tex
  return tex
}

/* Cheap additive halo — reads as bloom without a post-processing pass. */
function Halo({ radius, color, opacity = 0.4 }) {
  return (
    <sprite scale={[radius, radius, 1]}>
      <spriteMaterial
        map={haloTexture()}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  )
}

/* A moon's name. Painted as soon as the component mounts, then painted once
   more when the web fonts have actually arrived, so the label uses the
   display face rather than a system fallback. */
function MoonLabel({ text, slot, register }) {
  const initial = useMemo(() => makeLabelTexture(text), [text])
  const [label, setLabel] = useState(initial)

  // Textures referenced by the material must outlive the render that sets
  // them, so each one is released only after its replacement has committed.
  useEffect(() => () => label.texture.dispose(), [label])

  useEffect(() => {
    let alive = true
    const fonts = typeof document !== 'undefined' ? document.fonts : null
    if (!fonts || !fonts.ready) return undefined
    fonts.ready
      .then(() => {
        if (alive) setLabel(makeLabelTexture(text))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [text])

  return (
    <sprite
      ref={(el) => register(slot, el)}
      scale={[LABEL_H * label.aspect, LABEL_H, 1]}
      renderOrder={12}
    >
      <spriteMaterial
        map={label.texture}
        transparent
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        opacity={0.62}
      />
    </sprite>
  )
}

/* =========================================================================
   THE SYSTEM
   ========================================================================= */

function PlanetSystem({ quality, pointerRef, dragRef, invalidateRef, moons = [] }) {
  const parallax = useRef()
  const dragGroup = useRef()
  const planetSpin = useRef()
  const bandA = useRef()
  const bandB = useRef()
  const moonRefs = useRef([])
  const labelRefs = useRef([])

  const surface = useMemo(() => makePlanetTexture(quality), [quality])
  const ringTexture = useMemo(() => makeRingTexture(), [])
  const ringGeometry = useMemo(() => createRingGeometry(RING_IN, RING_OUT, 220), [])

  useEffect(
    () => () => {
      surface.dispose()
      ringTexture.dispose()
      ringGeometry.dispose()
    },
    [surface, ringTexture, ringGeometry]
  )

  /* Split the stack into two orbits. Evenly spaced within a band, staggered
     between bands, so no two labels ever sit on top of each other. */
  const orbits = useMemo(() => {
    const inner = moons.filter((m) => m.band !== 1)
    const outer = moons.filter((m) => m.band === 1)
    let slot = 0

    const layout = (list, radius, offset) =>
      list.map((m, i) => ({
        ...m,
        radius,
        angle: offset + (i / Math.max(list.length, 1)) * Math.PI * 2,
        tint: MOON_TINTS[(i + (radius > BAND_A_R ? 3 : 0)) % MOON_TINTS.length],
        size: i % 2 === 0 ? 0.17 : 0.145,
        slot: slot++,
      }))

    const stagger = Math.PI / Math.max(inner.length, 1)
    return {
      a: layout(inner, BAND_A_R, 0.42),
      b: layout(outer, BAND_B_R, 0.42 + stagger),
      total: slot,
    }
  }, [moons])

  const registerMoon = (slot, el) => {
    moonRefs.current[slot] = el
  }
  const registerLabel = (slot, el) => {
    labelRefs.current[slot] = el
  }

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const p = parallax.current
    const ptr = pointerRef ? pointerRef.current : null

    /* --- automatic motion ------------------------------------------------
       The slow turn of the planet and the drift of its moons. This runs
       unconditionally, deliberately: the orbit IS the piece — a still
       orrery reads as a broken image rather than as an artwork.

       prefers-reduced-motion is still honoured everywhere it belongs: every
       CSS transition and keyframe in styles.css, and the scroll-linked
       parallax below. What it does not do is stop a planet that turns once
       every couple of minutes. Each rate here is slow enough to follow with
       the eye without any sense of being moved at — the guidance is about
       motion that races, spins or simulates travel, which none of this does. */
    if (planetSpin.current) planetSpin.current.rotation.y += d * SPIN_PLANET
    if (bandA.current) bandA.current.rotation.y += d * SPIN_ORBIT_A
    if (bandB.current) bandB.current.rotation.y -= d * SPIN_ORBIT_B

    /* --- user-driven motion ------------------------------------------------
       Pointer parallax, hover lift and scroll. Always live, including under
       reduced motion: this only moves because the visitor asked it to, which
       is the kind of motion that preference permits. */
    if (p && ptr) {
      /* A single malformed pointer event — a synthetic one without
         clientX, say — would otherwise poison a transform for good, since
         lerp(NaN, …) stays NaN forever and the whole artwork quietly
         vanishes. So the input is sanitised where it is read rather than
         trusted because it is usually fine. */
      const finite = (n, fallback = 0) => (Number.isFinite(n) ? n : fallback)
      /* The pointer is watched across the whole window but normalised against
         the stage, so it routinely lands well outside [-1, 1]. These two feed
         a designed deflection, not an angle in their own right — clamped here
         so a cursor parked at the far edge of a wide screen tilts the artwork
         by its maximum intended amount instead of by hundreds of radians. */
      const unit = (n) => (n < -1 ? -1 : n > 1 ? 1 : n)
      const hover = finite(ptr.hover)
      const sc = finite(ptr.scroll)
      const px = unit(finite(ptr.x))
      const py = unit(finite(ptr.y))

      /* Amplitude grows while the pointer is over the stage, so approaching
         the planet visibly wakes it up instead of doing nothing until you
         happen to hit the sweet spot. */
      const reach = 0.26 + hover * 0.34
      const targetX = -py * reach - sc * 0.22
      const targetY = px * (reach + 0.12) + sc * 0.34

      const ease = 0.055 + hover * 0.05

      p.rotation.x = THREE.MathUtils.lerp(p.rotation.x, targetX, ease)
      p.rotation.y = THREE.MathUtils.lerp(p.rotation.y, targetY, ease)

      /* Same ambient family as the orbit above: a slow bob, always on. */
      const float = Math.sin(t * 0.5) * 0.11
      p.position.y = float + sc * 0.85 + hover * 0.09

      const targetScale = 1 + hover * 0.045 - sc * 0.16
      p.scale.setScalar(THREE.MathUtils.lerp(p.scale.x || 1, targetScale, 0.07))
    }

    /* --- drag-to-spin -----------------------------------------------------
       The accumulator is written 1:1 by the pointer handler, so the artwork
       tracks the hand exactly — no easing, because easing a drag feels like
       lag rather than polish. */
    if (dragGroup.current && dragRef && dragRef.current) {
      dragGroup.current.rotation.y = dragRef.current.rotY
      dragGroup.current.rotation.x = dragRef.current.rotX
    }

    /* --- labels ------------------------------------------------------------
       Sprites keep their own orientation, but their position has to be
       written each frame: they sit at the scene root so the type stays
       upright and level no matter where the orbit carries the moon. Each
       label is also brightened as the pointer comes near its moon. */
    if (ptr) {
      const camera = state.camera
      /* Labels only brighten for a real pointer. With none present the
         coordinates read as the stage centre, which would otherwise light
         up whichever moon happened to be passing closest to it. */
      const hasPointer = ptr.active === true
      const pointerX = Number.isFinite(ptr.x) ? ptr.x : 0
      const pointerY = Number.isFinite(ptr.y) ? ptr.y : 0

      for (let i = 0; i < orbits.total; i += 1) {
        const moon = moonRefs.current[i]
        const label = labelRefs.current[i]
        if (!moon || !label) continue

        moon.getWorldPosition(scratchWorld)
        label.position.set(scratchWorld.x, scratchWorld.y + LABEL_LIFT, scratchWorld.z)

        scratchNdc.copy(scratchWorld).project(camera)
        const dist = Math.hypot(scratchNdc.x - pointerX, scratchNdc.y - pointerY)
        const near = hasPointer ? Math.max(0, 1 - dist / 0.45) : 0

        const material = label.material
        if (material) {
          material.opacity = THREE.MathUtils.lerp(material.opacity, 0.55 + 0.45 * near, 0.14)
        }
        moon.scale.setScalar(THREE.MathUtils.lerp(moon.scale.x || 1, 1 + 0.3 * near, 0.14))
      }
    }
  })

  const renderBand = (list) =>
    list.map((m) => (
      <group key={m.label} rotation={[0, m.angle, 0]}>
        <group position={[m.radius, 0, 0]}>
          <group ref={(el) => registerMoon(m.slot, el)}>
            <mesh>
              <sphereGeometry args={[m.size, 32, 32]} />
              <meshStandardMaterial
                color={m.tint}
                roughness={0.72}
                metalness={0.06}
                emissive={m.tint}
                emissiveIntensity={0.16}
                envMapIntensity={0.8}
              />
            </mesh>
            <Halo radius={m.size * 5} color={m.tint} opacity={0.13} />
          </group>
        </group>
      </group>
    ))

  const renderLabels = (list) =>
    list.map((m) => (
      <MoonLabel key={`label-${m.label}`} text={m.label} slot={m.slot} register={registerLabel} />
    ))

  return (
    <>
      <group ref={parallax}>
        <group ref={dragGroup}>
          {/* Whole system carried on a diagonal, the way a planet is usually
              photographed — flat-on reads as a diagram, tilted reads as an
              object in space. */}
          <group rotation={[0, 0, -0.3]}>
            {/* The orbital plane. The planet's axis, the rings and both moon
                orbits all share it, so the composition stays coherent. */}
            <group rotation={[0.95, 0, 0]}>
              <group ref={planetSpin}>
                <mesh>
                  <sphereGeometry args={[PLANET_R, quality === 'high' ? 96 : 64, 64]} />
                  <meshStandardMaterial
                    map={surface}
                    roughness={0.66}
                    metalness={0.05}
                    envMapIntensity={0.55}
                  />
                </mesh>
                {/* Atmosphere: a slightly larger back-facing shell, visible
                    only outside the silhouette, so the planet gets a rim. */}
                <mesh scale={1.045} renderOrder={0}>
                  <sphereGeometry args={[PLANET_R, 48, 48]} />
                  <meshBasicMaterial
                    color={PALETTE.amber}
                    transparent
                    opacity={0.11}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                  />
                </mesh>
              </group>

              {/* Rings, in the planet's equatorial plane. */}
              <mesh geometry={ringGeometry} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
                <meshStandardMaterial
                  map={ringTexture}
                  transparent
                  side={THREE.DoubleSide}
                  depthWrite={false}
                  roughness={0.8}
                  metalness={0}
                  envMapIntensity={1.35}
                />
              </mesh>

              <group rotation={[0.1, 0, 0]}>
                <group ref={bandA}>{renderBand(orbits.a)}</group>
              </group>
              <group rotation={[-0.15, 0, 0]}>
                <group ref={bandB}>{renderBand(orbits.b)}</group>
              </group>
            </group>
          </group>
        </group>

        <Starfield quality={quality} />
      </group>

      {/* Labels live outside every transform above: their positions are
          written in world space each frame, so the type never tilts. */}
      {renderLabels(orbits.a)}
      {renderLabels(orbits.b)}
    </>
  )
}

/* Publishes invalidate() to the parent, so pointer and scroll input can ask
   for a repaint while the loop is running on demand. */
function InvalidateBridge({ target }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    target.current = invalidate
    return () => {
      target.current = null
    }
  }, [invalidate, target])
  return null
}

/* Fires once the scene subtree is genuinely mounted, so the CSS fallback can
   be swapped out without relying on renderer callbacks. */
function ReadySignal({ onReady }) {
  const cb = useRef(onReady)
  cb.current = onReady
  useEffect(() => {
    cb.current?.()
  }, [])
  return null
}

export default function HeroScene({
  active = true,
  quality = 'high',
  pointerRef,
  dragRef,
  invalidateRef,
  moons = [],
  onReady,
}) {
  /* The loop runs continuously while the hero is on screen, and stops
     completely when it is not. The off-screen switch is where the real
     saving lives: scrolling past the hero costs zero frames, so there is
     nothing left to buy by also stalling the loop while it is visible —
     which would only freeze a scene whose whole purpose is to turn. */
  const frameloop = active ? 'always' : 'never'

  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, quality === 'high' ? 2 : 1.5]}
      camera={{ fov: 34, position: [0, 0, 12.8] }}
      frameloop={frameloop}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.12
      }}
      /* The canvas never intercepts input: parallax is driven by a window
         listener in the parent, so links, scrolling and taps stay untouched. */
      style={{ pointerEvents: 'none', touchAction: 'pan-y' }}
      aria-hidden="true"
    >
      <StudioEnvironment />
      <Lights />
      <PlanetSystem
        quality={quality}
        pointerRef={pointerRef}
        dragRef={dragRef}
        invalidateRef={invalidateRef}
        moons={moons}
      />
      {invalidateRef ? <InvalidateBridge target={invalidateRef} /> : null}
      <ReadySignal onReady={onReady} />
    </Canvas>
  )
}
