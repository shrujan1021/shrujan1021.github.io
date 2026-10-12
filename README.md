# Shrujan Mitbavkar — Portfolio

A single-page, editorial-style product design portfolio built with **React + Vite**.
It presents one real case study (SupportSense AI) with genuine screenshots from the
deployed application.

---

## 1. Requirements

- Node.js 18+ (or 20+)
- npm 9+

## 2. Setup

```bash
npm install
```

## 3. Development server

```bash
npm run dev
```

Opens at `http://localhost:5173`.

## 4. Production build

```bash
npm run build
```

Output is written to `dist/`.

Result of the last build run in this project:

```
dist/index.html                    3.18 kB │ gzip:   1.06 kB
dist/assets/index-*.css           40.49 kB │ gzip:   8.69 kB
dist/assets/HeroScene-*.js       146.68 kB │ gzip:  48.77 kB
dist/assets/index-*.js           204.42 kB │ gzip:  63.92 kB
dist/assets/three-*.js           745.99 kB │ gzip: 191.97 kB
✓ built in 17.87s
```

The Three.js bundle is split into its own chunk by `manualChunks` in
`vite.config.js`, and the 3D scene is loaded lazily after first paint, so none
of it blocks the page from rendering.

Preview the production build locally:

```bash
npm run preview
```

## 5. What to edit

Almost everything lives in **`src/data.js`** — no component changes are needed for
content edits.

| Section | Key |
| --- | --- |
| Name, role, location, email, résumé path, social links | `profile` |
| Nav labels | `navLinks` |
| Hero badge, buttons, preview screenshot | `hero` |
| About copy | `about` |
| Project cards | `projects` |
| Skills | `skillGroups` |
| Internship / experience | `experience` |
| Education | `education` |
| Design approach steps | `approach` |
| Contact copy | `contact` |
| Footer note | `footer` |
| Full 11-part case study | `caseStudy` |

Anything set to `null` (for example `repoUrl`, `profile.socials[].href`) is treated as
"not configured" and is hidden rather than rendered as a broken link. There are no
bracketed placeholders left in the file — profile links, education and experience
are all filled in.

### Adding your résumé

Drop the PDF at:

```
public/resume.pdf
```

The navigation button appears automatically once the file exists (it is checked with a
`HEAD` request on load). If the file is missing the button is not rendered at all, so
the site never shows a dead action.

### Images

Put images in `public/images/` and reference them as `/images/your-file.png`.

Currently used by the case study:

- `live-dashboard.png`
- `live-ticket-queue.png`
- `live-new-ticket.png`
- `live-ticket-detail.png`
- `ticket-details-ui.png`
- `dashboard-reference.png`
- `create-ticket-reference.png`
- `ai-panel-reference.png`
- `login-reference-3.png`
- `color-palette.png`

`public/og.png` (1200×630) is the social preview image referenced by the Open Graph
tags in `index.html`.

---

## 6. Deployment

**Live at:** https://shrujan1021.github.io/

Deployment is automatic. Every push to `main` runs `.github/workflows/deploy.yml`,
which executes `npm ci && npm run build` and publishes `dist/` to GitHub Pages —
so the live site is always a build of the committed source, never a folder copied
over by hand.

The repo is named `shrujan1021.github.io`, which GitHub serves from the **domain
root**. That is why the build keeps `base: '/'` and the absolute `/assets/...`
paths resolve correctly.

If the site ever moves under a sub-path (e.g. `https://user.github.io/portfolio/`),
two things must change together:

1. `base: '/portfolio/'` in `vite.config.js`
2. the absolute `og:image` / `twitter:image` / `og:url` URLs in `index.html`

### Any other static host

The output is static, so any host works — build command `npm run build`, publish
directory `dist`:

```bash
# Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# Vercel
npm install -g vercel
vercel --prod
```

---

## 7. Project structure

```
portfolio/
├── index.html                 SEO shell: title, description, OG tags, favicon, fonts
├── public/
│   ├── favicon.svg            ringed-planet mark
│   ├── apple-touch-icon.png   180×180 iOS home-screen icon
│   ├── og.png                 1200×630 social preview
│   ├── resume.pdf             ← drop your PDF here
│   ├── robots.txt
│   └── images/                screenshots and reference captures
├── src/
│   ├── main.jsx
│   ├── App.jsx                skip link, landmarks, section order, scroll reveals
│   ├── data.js                ← all editable content lives here
│   ├── styles.css             design tokens, layout, responsive rules
│   └── components/
│       ├── Nav.jsx            sticky header, mobile menu, résumé availability check
│       ├── Hero.jsx
│       ├── About.jsx
│       ├── Work.jsx
│       ├── CaseStudy.jsx      renders all 11 case study blocks
│       ├── Skills.jsx
│       ├── Approach.jsx
│       ├── Experience.jsx
│       ├── Education.jsx
│       ├── Contact.jsx
│       ├── Footer.jsx
│       └── BrandIcons.jsx     GitHub / LinkedIn marks (Lucide dropped brand icons)
└── package.json
```

---

## 8. Notes on content

The site deliberately does **not** claim:

- user interviews or usability testing
- personas derived from real research
- usability findings or user feedback
- conversion, handling-time or business metrics
- a formal design system
- additional projects beyond SupportSense AI

The **Design approach** section is labelled as a way of working, not as stages completed
on one project, and the case study states where research was pattern analysis rather
than a user study.

Placeholder content that still needs your input is marked in `src/data.js`. There
are no bracketed placeholders left; the remaining `null` values are deliberate and
mean "not configured", so nothing renders as a broken link:

- `liveUrl` / `repoUrl` on the three academic projects — no public repository or
  deployment is claimed for them
- `thumbnail: null` — renders a typographic project card instead of an image
- `period: null` on the experience entry — the organisation and dates are not
  asserted, so the card shows the collaboration *kind* in place of a date
