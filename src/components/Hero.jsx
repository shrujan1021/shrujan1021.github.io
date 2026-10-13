import { ArrowDown, ArrowRight, Download, MapPin } from 'lucide-react'
import { profile, hero } from '../data.js'
import { GithubIcon, LinkedinIcon } from './BrandIcons.jsx'
import { scrollToId } from './Nav.jsx'
import useResume from '../useResume.js'
import HeroCanvas from './HeroCanvas.jsx'

export default function Hero() {
  const resumeAvailable = useResume()

  return (
    <section id="top" className="hero">
      <div className="hero-aura" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-badge">
            <span className="hero-dot" aria-hidden="true" />
            {hero.badge}
          </p>

          <h1 className="hero-name">
            <span className="hero-name-line">Shrujan</span>
            <span className="hero-name-line hero-name-accent">Mitbavkar</span>
          </h1>

          <p className="hero-role">
            <span>{profile.roleLine}</span>
            <span className="hero-role-sep" aria-hidden="true" />
            <span>{profile.roleSub}</span>
          </p>

          <p className="hero-tagline">{profile.tagline}</p>

          <p className="hero-intro">{profile.intro}</p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => scrollToId(hero.ctaPrimary.target)}
            >
              {hero.ctaPrimary.label}
              <ArrowDown size={16} aria-hidden="true" />
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => scrollToId(hero.ctaSecondary.target)}
            >
              {hero.ctaSecondary.label}
              <ArrowRight size={16} aria-hidden="true" />
            </button>

            {resumeAvailable && (
              <a
                className="btn btn-ghost"
                href={profile.resumeUrl}
                download={profile.resumeFilename}
              >
                <Download size={16} aria-hidden="true" />
                {hero.ctaResume.label}
              </a>
            )}
          </div>

          <div className="hero-foot">
            <ul className="hero-socials">
              {profile.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${social.label} — ${social.handle}`}
                  >
                    {social.label === 'GitHub' ? (
                      <GithubIcon width={15} height={15} />
                    ) : (
                      <LinkedinIcon width={15} height={15} />
                    )}
                    <span>{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="hero-loc">
              <MapPin size={14} aria-hidden="true" />
              {profile.location}
            </p>
          </div>
        </div>

        <HeroCanvas />
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span className="hero-scroll-track" />
        <span>Scroll</span>
      </div>

      <div className="container">
        <dl className="hero-index">
          {hero.facts.map((fact, i) => (
            <div key={fact.label}>
              <span className="hero-index-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
