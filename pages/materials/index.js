import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

export default function MaterialsPage() {
  const t = translations.en;
  const { materials, contact } = t;

  return (
    <>
      <Head>
        <title>Materials - Macreat</title>
        <meta name="description" content={materials.subtitle} />
      </Head>

      <Header />

      <main>
        <section className="page-hero">
          <div className="container">
            <h1>{materials.title}</h1>
            <p className="page-hero-subtitle">{materials.subtitle}</p>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="materials-grid">
              {materials.items.map((item, index) => (
                <Link href={item.href} key={index} className="material-card">
                  <div className="material-image">
                    <img 
                      src={`/images/${item.image}.jpg`} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = '/images/wood-waste.jpg';
                      }}
                    />
                  </div>
                  <h3 className="material-name">{item.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <h2>Need a customized solution?</h2>
            <p>Contact us with your raw materials and output requirements.</p>
            <div className="cta-buttons">
              <Link href="/contact/" className="btn btn-primary">
                Get a Quote
              </Link>
              {contact.whatsappLink && (
                <a href={contact.whatsappLink} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}