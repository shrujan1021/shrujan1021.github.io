import { useRef, useState } from 'react'
import { ArrowUpRight, AlertCircle } from 'lucide-react'
import { caseStudy } from '../data.js'

/* ---------- individual block renderers ---------- */

function Prose({ block }) {
  return (
    <>
      {block.paras.map((p, i) => (
        <p key={i} className="cs-prose">
          {p}
        </p>
      ))}
      {block.callout && (
        <div className="cs-callout">
          <h4>{block.callout.title}</h4>
          <p>{block.callout.body}</p>
        </div>
      )}
      {block.aside && (
        <p className="cs-aside">
          <AlertCircle size={15} aria-hidden="true" />
          {block.aside}
        </p>
      )}
    </>
  )
}

function Notes({ block }) {
  return (
    <>
      {block.intro && <p className="cs-prose">{block.intro}</p>}
      <ol className="cs-notes">
        {block.items.map((item, i) => (
          <li key={item.title}>
            <span className="cs-note-n">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}

function Cards({ block }) {
  return (
    <>
      <div className="cs-cards">
        {block.items.map((item) => (
          <article key={item.title} className="cs-card">
            <h4>{item.title}</h4>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      {block.aside && (
        <p className="cs-aside">
          <AlertCircle size={15} aria-hidden="true" />
          {block.aside}
        </p>
      )}
    </>
  )
}

function Role({ block }) {
  return (
    <div className="cs-role">
      <div className="cs-role-block">
        <h4 className="cs-role-label">{block.team.title}</h4>
        {block.team.paras.map((p, i) => (
          <p key={i} className="cs-prose">
            {p}
          </p>
        ))}
      </div>

      <div className="cs-role-block">
        <h4 className="cs-role-label is-mine">{block.mine.title}</h4>
        <ul className="cs-role-list">
          {block.mine.items.map((item) => (
            <li key={item.label} className={item.label.startsWith('[') ? 'is-placeholder' : ''}>
              <strong>{item.label}</strong>
              <span>{item.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Steps({ block }) {
  return (
    <>
      <ol className="cs-steps">
        {block.items.map((step) => (
          <li key={step.n}>
            <span className="cs-step-n">{step.n}</span>
            <h4>{step.title}</h4>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
      {block.aside && (
        <p className="cs-aside">
          <AlertCircle size={15} aria-hidden="true" />
          {block.aside}
        </p>
      )}
    </>
  )
}

function IA({ block }) {
  return (
    <>
      <div className="cs-ia">
        {block.items.map((item) => (
          <div key={item.title} className="cs-ia-item">
            <h4>{item.title}</h4>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
      <p className="cs-flow">
        <span>Key flow</span>
        {block.flow}
      </p>
    </>
  )
}

function Decisions({ block }) {
  const [active, setActive] = useState(0)
  const tablistRef = useRef(null)
  const current = block.items[active]

  // Move focus with the selection so repeated arrow presses keep working.
  const select = (index) => {
    setActive(index)
    tablistRef.current?.children[index]?.focus()
  }

  return (
    <>
      <p className="cs-prose">{block.intro}</p>
      <div className="cs-explorer">
        <div className="cs-explorer-side">
          <div className="cs-tabs" role="tablist" aria-label="Interface decisions" ref={tablistRef}>
            {block.items.map((item, i) => (
              <button
                key={item.screen}
                type="button"
                role="tab"
                id={`decision-tab-${i}`}
                aria-selected={active === i}
                aria-controls="decision-panel"
                tabIndex={active === i ? 0 : -1}
                className={active === i ? 'is-active' : ''}
                onClick={() => select(i)}
                onKeyDown={(e) => {
                  const last = block.items.length - 1
                  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault()
                    select(i === last ? 0 : i + 1)
                  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault()
                    select(i === 0 ? last : i - 1)
                  } else if (e.key === 'Home') {
                    e.preventDefault()
                    select(0)
                  } else if (e.key === 'End') {
                    e.preventDefault()
                    select(last)
                  }
                }}
              >
                <span className="cs-tab-n">{String(i + 1).padStart(2, '0')}</span>
                {item.screen}
              </button>
            ))}
          </div>
        </div>

        <div
          className="cs-explorer-main"
          id="decision-panel"
          role="tabpanel"
          aria-labelledby={`decision-tab-${active}`}
        >
          <div className="cs-frame">
            <div className="cs-frame-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <p>{current.screen}</p>
            </div>
            <div className="cs-frame-body">
              <img
                key={current.image}
                src={current.image}
                alt={`Reference used while deciding the ${current.screen.toLowerCase()} screen.`}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <p className="cs-decision">
            <strong>{current.screen}:</strong> {current.note}
          </p>
        </div>
      </div>
    </>
  )
}

function Gallery({ block }) {
  return (
    <>
      <p className="cs-prose">{block.intro}</p>
      <div className="cs-gallery">
        {block.shots.map((shot) => (
          <figure key={shot.title} className="cs-shot">
            <div className="cs-shot-frame">
              <img src={shot.image} alt={shot.alt} loading="lazy" decoding="async" />
            </div>
            <figcaption>
              <strong>{shot.title}</strong>
              <span>{shot.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  )
}

function Outcome({ block }) {
  return (
    <>
      {block.summary.map((p, i) => (
        <p key={i} className="cs-prose">
          {p}
        </p>
      ))}
      <h4 className="cs-subhead">Future improvements</h4>
      <ul className="cs-future">
        {block.future.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </>
  )
}

const RENDERERS = {
  prose: Prose,
  cards: Cards,
  role: Role,
  steps: Steps,
  ia: IA,
  decisions: Decisions,
  gallery: Gallery,
  notes: Notes,
  outcome: Outcome,
}

export default function CaseStudy() {
  return (
    <section id="case-study" className="section cs">
      <div className="container">
        <header className="cs-header">
          <p className="eyebrow">{caseStudy.tag}</p>
          <h2>{caseStudy.title}</h2>
          <p className="cs-subtitle">{caseStudy.subtitle}</p>

          <dl className="cs-meta">
            {caseStudy.meta.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>

          <a
            className="cs-live"
            href={caseStudy.liveHref}
            target="_blank"
            rel="noreferrer noopener"
          >
            View live application
            <span className="cs-live-url">{caseStudy.liveUrl}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </header>

        {caseStudy.blocks.map((block) => {
          const Renderer = RENDERERS[block.type]
          if (!Renderer) return null
          return (
            <article key={block.id} id={`cs-${block.id}`} className="cs-block">
              <div className="cs-block-head">
                <span className="cs-block-n">{block.n}</span>
                <h3>{block.title}</h3>
              </div>
              <div className="cs-block-body">
                <Renderer block={block} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
