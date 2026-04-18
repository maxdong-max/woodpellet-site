/**
 * 公开社交链接 API (Vercel兼容版本)
 */
export default async function handler(req, res) {
  const socialLinks = [
    { icon: 'whatsapp', name: 'WhatsApp', href: 'https://wa.me/1234567890' },
    { icon: 'email', name: 'Email', href: 'mailto:info@macreat.com' },
    { icon: 'facebook', name: 'Facebook', href: 'https://facebook.com/macreat' },
    { icon: 'instagram', name: 'Instagram', href: 'https://instagram.com/macreat' },
    { icon: 'youtube', name: 'YouTube', href: 'https://youtube.com/macreat' }
  ];
  
  return res.status(200).json(socialLinks);
}
