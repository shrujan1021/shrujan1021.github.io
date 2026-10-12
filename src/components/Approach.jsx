import { approach } from '../data.js'

export default function Approach() {
  return (
    <section id="approach" className="section section-tint">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Design approach</p>
          <h2>How I work through a design problem.</h2>
          <p className="section-note">
            The workflow I aim to follow. It describes how I like to work, not every step completed
            on a single project.
          </p>
        </div>

        <ol className="approach-grid">
          {approach.map((step) => (
            <li key={step.n} className="approach-item">
              <span className="approach-n">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
