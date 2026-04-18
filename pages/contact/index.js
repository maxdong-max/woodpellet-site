import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

export default function Contact() {
  const t = translations.en;
  const { contact } = t;

  return (
    <>
      <Head>
        <title>Contact Us - Macreat</title>
        <meta name="description" content="Contact Macreat for biomass pellet machine inquiries. Reach us via WhatsApp, email, or phone." />
      </Head>

      <Header />

      <main>
        <section className="page-hero">
          <div className="container">
            <h1>{contact.title}</h1>
          </div>
        </section>

        <section className="contact-section">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-item">
                <a href={contact.whatsappLink} className="contact-icon">📱</a>
                <h4>WhatsApp</h4>
                <a href={contact.whatsappLink}>{contact.whatsapp}</a>
              </div>
              <div className="contact-item">
                <a href={contact.emailLink} className="contact-icon">✉️</a>
                <h4>Email</h4>
                <a href={contact.emailLink}>{contact.email}</a>
              </div>
              <div className="contact-item">
                <a href={contact.phoneLink} className="contact-icon">📞</a>
                <h4>Phone</h4>
                <a href={contact.phoneLink}>{contact.phone}</a>
              </div>
              <div className="contact-item">
                <a href="/" className="contact-icon">🌐</a>
                <h4>Website</h4>
                <a href="/">workspace-shrimp-publish.vercel.app</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}