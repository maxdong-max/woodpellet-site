import Link from 'next/link';
import { translations } from '../lib/content';

export default function Footer() {
  const t = translations.en.footer;
  const contact = translations.en.contact;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {t.menu.map((section, idx) => (
            <div key={idx} className="footer-section">
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link href={link.href}>{link.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="footer-section">
            <h3>{contact.title}</h3>
            <div className="contact-info">
              <p><strong>WhatsApp:</strong> <a href={contact.whatsappLink}>{contact.whatsapp}</a></p>
              <p><strong>Email:</strong> <a href={contact.emailLink}>{contact.email}</a></p>
              <p><strong>Phone:</strong> <a href={contact.phoneLink}>{contact.phone}</a></p>
            </div>
            <div className="footer-social">
              {contact.social.map((item, idx) => (
                <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {t.copyright}</p>
          <Link href={t.privacyLink}>Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}