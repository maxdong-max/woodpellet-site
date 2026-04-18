import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

export default function StrawWastePage() {
  const t = translations.en;
  const { contact } = t;

  return (
    <>
      <Head>
        <title>Straw Waste Pellet Production Line - Macreat</title>
        <meta name="description" content="Straw pelletizing production line. A lot of waste materials are generated during the production of furniture, and they are good raw materials for the production of fuel pellets." />
      </Head>

      <Header />

      <main>
        <section className="page-hero">
          <div className="container">
            <h1>Straw Waste Pellet Production Line</h1>
            <p className="page-hero-subtitle">Macreat Biomass Pellet Machine Solution</p>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <h2>Overview</h2>
                <p>A lot of waste materials are generated during the production of furniture, and they are good raw materials for the production of fuel pellets.</p>
                <p>So as to realize the reuse of waste materials, and at the same time obtain more benefits.</p>

                <h3>Process Flow Chart</h3>
                <p className="solution-flow">Straw Pelletizing Production Line Mainly Includes 6 Sections:</p>
                <ul className="solution-features">
                  <li>Crushing Section</li>
                  <li>Hammer Section</li>
                  <li>Drying Section</li>
                  <li>Pelletizing Section</li>
                  <li>Cooling Section</li>
                  <li>Packing Section</li>
                </ul>

                <h3>Technique Introduction</h3>
                <p>The three-channel dryer is composed of inner, middle and outer three-layer cylinders. The wet material enters from one end of the inner cylinder.</p>

                <p className="solution-note">If moisture is higher, need to use dryer to reduce the water content before pelleting section.</p>

                <div className="cta-buttons">
                  <Link href="/contact/" className="btn btn-primary">
                    Get Quote
                  </Link>
                  {contact.whatsappLink && (
                    <a href={contact.whatsappLink} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                      Chat on WhatsApp
                    </a>
                  )}
                </div>
              </div>
              <div className="about-video">
                <img 
                  src="/images/straw-waste.jpg" 
                  alt="Straw Waste Pellet Production Line"
                  onError={(e) => e.target.style.display = 'none'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <h2>Interested in this solution?</h2>
            <p>Contact us for a customized quote and technical specifications.</p>
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