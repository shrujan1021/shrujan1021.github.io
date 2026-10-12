import { Award } from 'lucide-react'
import { certifications } from '../data.js'

export default function Certifications() {
  return (
    <section id="certifications" className="section section-tint">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Certifications &amp; activities</p>
          <h2>
            Outside the <em>coursework.</em>
          </h2>
        </div>

        <ul className="cert-list">
          {certifications.map((c) => (
            <li key={c.title} className="cert">
              <span className="cert-kind">{c.kind}</span>
              <div className="cert-main">
                <h3>{c.title}</h3>
                <p>
                  <Award size={14} aria-hidden="true" />
                  {c.org}
                </p>
              </div>
              <span className="cert-year">{c.year}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
