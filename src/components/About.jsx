import { about } from '../data.js'

export default function About() {
  return (
    <section id="about" className="section section-tint">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">About</p>
          <h2>{about.heading}</h2>
        </div>

        <div className="about-grid">
          <p className="about-lede">{about.lede}</p>

          <div className="about-copy">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <ul className="about-points">
          {about.points.map((point, i) => (
            <li key={point}>
              <span className="about-point-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p>{point}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
