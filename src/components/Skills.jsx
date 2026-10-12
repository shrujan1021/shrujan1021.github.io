import { skillGroups } from '../data.js'

export default function Skills() {
  return (
    <section id="skills" className="section section-tint">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Skills</p>
          <h2>
            The tools I actually <em>use.</em>
          </h2>
          <p className="section-note">
            Taken from my resume and from the projects listed above. No proficiency percentages —
            just the technologies I have worked with.
          </p>
        </div>

        <div className="skill-grid">
          {skillGroups.map((group, i) => (
            <div key={group.title} className="skill-group">
              <span className="skill-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
