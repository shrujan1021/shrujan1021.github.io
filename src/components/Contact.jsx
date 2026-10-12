import { Mail, ArrowUpRight, MapPin, FileText } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons.jsx'
import { profile, contact } from '../data.js'
import useResume from '../useResume.js'

function SocialIcon({ label }) {
  if (label === 'GitHub') return <GithubIcon width={18} height={18} />
  if (label === 'LinkedIn') return <LinkedinIcon width={18} height={18} />
  return null
}

export default function Contact() {
  const resumeAvailable = useResume()

  return (
    <section id="contact" className="section contact">
      {/* Restrained CSS-only 3D detail: perspective rings, no WebGL cost. */}
      <div className="contact-aura" aria-hidden="true">
        <span className="contact-orbit" />
        <span className="contact-orbit contact-orbit--b" />
        <span className="contact-orbit contact-orbit--c" />
        <span className="contact-core" />
      </div>

      <div className="container contact-grid">
        <div className="contact-copy">
          <p className="eyebrow">Contact</p>
          <h2>{contact.heading}</h2>
          <p className="contact-body">{contact.body}</p>

          <a className="contact-email" href={`mailto:${profile.email}`}>
            <Mail size={18} aria-hidden="true" />
            {profile.email}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>

          <p className="contact-location">
            <MapPin size={14} aria-hidden="true" />
            {profile.location}
          </p>
        </div>

        <div className="contact-side">
          <h3>Find me online</h3>
          <ul className="social-list">
            {profile.socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer noopener">
                  <SocialIcon label={social.label} />
                  <span className="social-text">
                    <strong>{social.label}</strong>
                    <em>{social.handle}</em>
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          {resumeAvailable && (
            <div className="contact-note">
              <h3>Résumé</h3>
              <a
                href={profile.resumeUrl}
                download="Shrujan_Mitbavkar_Resume.pdf"
                className="contact-resume"
              >
                <FileText size={15} aria-hidden="true" />
                Download my résumé
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
