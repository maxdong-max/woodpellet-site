import { MessageCircle, Mail } from 'lucide-react';
import { translations } from '../lib/content';

export default function FloatingSocial() {
  const t = translations.en.floatingSocial;

  return (
    <div className="floating-social">
      <a href={t[0].href} className="floating-btn whatsapp" target="_blank" rel="noopener noreferrer">
        <MessageCircle size={24} />
        <span>{t[0].name}</span>
      </a>
      <a href={t[1].href} className="floating-btn quote">
        <Mail size={24} />
        <span>{t[1].name}</span>
      </a>
    </div>
  );
}