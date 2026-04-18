import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, MessageCircle, Mail, Video, ExternalLink } from 'lucide-react';
import { translations } from '../lib/content';

// Map social icons - use alternatives for missing icons
const socialIconMap = {
  whatsapp: MessageCircle,
  email: Mail,
  facebook: ExternalLink,  // Alternative: Globe, User
  'x (twitter)': X,  // X icon exists
  youtube: Video,  // Alternative: FileVideo
  instagram: ExternalLink  // Alternative: Image
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const t = translations.en.nav;

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="logo-section">
              <Link href="/" className="logo">
                <img src="/images/macreat_logo-180.png" alt={t.logo.alt} />
                <span>{t.logo.text}</span>
              </Link>
            </div>
            <div className="header-social">
              {t.social.map((item, index) => {
                const IconComponent = socialIconMap[item.icon];
                return (
                  <a 
                    key={index} 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`social-icon ${item.icon}`}
                    title={item.name}
                  >
                    {IconComponent ? <IconComponent size={16} /> : item.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <nav className="main-nav">
        <div className="container">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {t.links.map((link, index) => (
              <li key={index} className={link.hasDropdown ? 'has-dropdown-item' : ''}>
                <Link href={link.href} className={link.hasDropdown ? 'has-dropdown' : ''}>
                  {link.text}
                </Link>
                {link.dropdownItems && link.dropdownItems.length > 0 && (
                  <ul className="dropdown-menu">
                    {link.dropdownItems.map((item, idx) => (
                      <li key={idx}>
                        <Link href={item.href}>{item.text}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}