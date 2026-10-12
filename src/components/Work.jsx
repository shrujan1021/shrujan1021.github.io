import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { GithubIcon } from './BrandIcons.jsx'
import { projects, profile } from '../data.js'
import { scrollToId } from './Nav.jsx'

function Stack({ items }) {
  return (
    <ul className="tag-list">
      {items.map((tech) => (
        <li key={tech}>{tech}</li>
      ))}
    </ul>
  )
}

/* Restrained typographic cover used when no genuine screenshot exists.
   Deliberately not a fake application screenshot. */
function TypeVisual({ project }) {
  return (
    <div className="pt-visual" aria-hidden="true">
      <span className="pt-grid" />
      <span className="pt-index">{project.index}</span>
      <span className="pt-kind">{project.category}</span>
      <strong className="pt-name">{project.name}</strong>
      <span className="pt-rule" />
      <span className="pt-stack">{project.stack.join('  ·  ')}</span>
    </div>
  )
}

/* Original diagram drawn for a project with no genuine screenshot.
   Rendered unframed so it can never be mistaken for a live capture. */
function DiagramVisual({ project }) {
  return (
    <div className="dgm-frame">
      <img
        src={project.thumbnail}
        alt={project.alt}
        width="1013"
        height="894"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

function BrowserFrame({ project, large = false }) {
  return (
    <div className={`shot-frame ${large ? 'shot-frame--lg' : ''}`}>
      <div className="shot-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <p>{project.liveUrl ? new URL(project.liveUrl).hostname : project.name}</p>
      </div>
      <div className="shot-body">
        <img
          src={project.thumbnail}
          alt={project.alt}
          width="1013"
          height="894"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  )
}

/* Genuine screenshot → framed as it appears in a browser; original diagram →
   shown unframed; neither → typographic cover. Never a fabricated screenshot. */
function ProjectVisual({ project, large = false }) {
  if (project.diagram) return <DiagramVisual project={project} />
  if (project.thumbnail) return <BrowserFrame project={project} large={large} />
  return <TypeVisual project={project} />
}

function ProjectLinks({ project, onCaseStudy }) {
  return (
    <div className="project-links">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-link"
        >
          View Live Project
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      )}
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-link"
        >
          <GithubIcon width={15} height={15} />
          Source code
        </a>
      )}
      {project.hasCaseStudy && (
        <button type="button" className="text-link" onClick={onCaseStudy}>
          Read the case study
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function ProjectFeature({ project, onCaseStudy }) {
  return (
    <article className="pfeature">
      <div className="pfeature-media tilt">
        <ProjectVisual project={project} large />
      </div>

      <div className="pfeature-copy">
        <p className="project-index">{project.index}</p>
        <p className="project-category">{project.category}</p>
        <h3>{project.name}</h3>
        <p className="project-description">{project.description}</p>

        <div className="project-contribution">
          <h4>My contribution</h4>
          <p>{project.contribution}</p>
        </div>

        <Stack items={project.stack} />

        <ProjectLinks project={project} onCaseStudy={onCaseStudy} />
      </div>
    </article>
  )
}

function GalleryItem({ project, variant, onCaseStudy }) {
  return (
    <article className={`gitem gitem--${variant}`}>
      <div className={`gitem-media tilt${project.diagram ? ' gitem-media--dgm' : ''}`}>
        <ProjectVisual project={project} />
      </div>

      <div className="gitem-body">
        <div className="gitem-head">
          <p className="project-index">{project.index}</p>
          <p className="project-category">{project.category}</p>
        </div>

        <h3>{project.name}</h3>
        <p className="project-description">{project.description}</p>

        <div className="project-contribution">
          <h4>My contribution</h4>
          <p>{project.contribution}</p>
        </div>

        <Stack items={project.stack} />

        <ProjectLinks project={project} onCaseStudy={onCaseStudy} />
      </div>
    </article>
  )
}

const VARIANTS = ['a', 'b', 'c']

export default function Work() {
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)
  const openCaseStudy = () => scrollToId('case-study')

  return (
    <section id="work" className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Selected work</p>
          <h2>
            Four projects, each one <em>built and used.</em>
          </h2>
          <p className="section-note">
            One internship project and three academic projects. Only what is genuinely mine is
            described here — no invented screenshots, links or outcomes.
          </p>
        </div>

        <div className="pfeature-list">
          {featured.map((p) => (
            <ProjectFeature key={p.id} project={p} onCaseStudy={openCaseStudy} />
          ))}
        </div>

        <div className="gallery">
          {others.map((p, i) => (
            <GalleryItem
              key={p.id}
              project={p}
              variant={VARIANTS[i % VARIANTS.length]}
              onCaseStudy={openCaseStudy}
            />
          ))}
        </div>

        <div className="work-more">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="text-link"
          >
            <GithubIcon width={15} height={15} />
            More projects on GitHub
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
