import { profile, navLinks, footer } from '../data.js'
import { scrollToId } from './Nav.jsx'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            SM
          </span>
          <div>
            <p className="footer-name">{profile.name}</p>
            <p className="footer-note">{footer.note}</p>
          </div>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          {navLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={(e) => { e.preventDefault(); scrollToId(link.id) }}>
              {link.label}
            </a>
          ))}
        </nav>

        <p className="footer-copy">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  )
}
