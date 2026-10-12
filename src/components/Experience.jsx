import { Briefcase } from 'lucide-react'
import { experience } from '../data.js'

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Experience</p>
          <h2>
            Internship project <em>work.</em>
          </h2>
          <p className="section-note">
            Described as what it is: a collaborative internship project, with my own contribution
            kept separate from the team’s work.
          </p>
        </div>

        <div className="timeline">
          {experience.map((item) => (
            <article key={item.title} className="timeline-entry">
              <div className="timeline-meta">
                {item.period && <span className="timeline-period">{item.period}</span>}
                <span className="timeline-kind">{item.kind}</span>
              </div>

              <div className="timeline-content">
                <h3>{item.title}</h3>
                <p className="timeline-org">
                  <Briefcase size={15} aria-hidden="true" />
                  {item.org || 'Collaborative team project'}
                </p>
                <p className="timeline-intro">{item.intro}</p>
                <ul className="timeline-bullets">
                  {item.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
