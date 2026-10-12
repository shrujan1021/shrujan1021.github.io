import { GraduationCap, CircleDot } from 'lucide-react'
import { education } from '../data.js'

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Education</p>
          <h2>
            Where I am <em>studying.</em>
          </h2>
        </div>

        <div className="timeline">
          {education.map((item) => (
            <article key={item.degree} className="timeline-entry">
              <div className="timeline-meta">
                <span className="timeline-period">{item.period}</span>
                {item.status && <span className="timeline-kind">{item.status}</span>}
              </div>

              <div className="timeline-content">
                <h3>{item.degree}</h3>
                <p className="timeline-org">
                  <GraduationCap size={15} aria-hidden="true" />
                  {item.org}
                </p>
                {item.focus && (
                  <p className="timeline-focus">
                    <CircleDot size={13} aria-hidden="true" />
                    Specialisation: {item.focus}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
