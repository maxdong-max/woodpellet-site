import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

export default function WoodChipsPage() {
  const t = translations.en;
  const { contact } = t;

  return (
    <>
      <Head>
        <title>Wood Chips/Sawdust Pellet Production Line - Macreat</title>
        <meta name="description" content="Wood pellet machine, also known as sawdust pellet machine, pellet mill. It presses crushed trees, planks, bark, shavings into rod-shaped particles." />
      </Head>

      <Header />

      <main>
        <section className="page-hero">
          <div className="container">
            <h1>Wood Chips/Sawdust Pellet Production Line</h1>
            <p className="page-hero-subtitle">Macreat Biomass Pellet Machine Solution</p>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <h2>Overview</h2>
                <p>Wood pellet machine, also known as sawdust pellet machine, pellet mill, Granulator.</p>
                <p>It is a machine that presses crushed trees, planks, bark, shavings, scraps of furniture factories and other raw materials into rod-shaped particles with a diameter of 6/8/10 mm through mechanical physical extrusion.</p>

                <h3>Technique Introduction</h3>
                <p className="solution-flow">Wood Pellet Mill Production Line Mainly Includes 6 Sections:</p>
                <ul className="solution-features">
                  <li>Crushing Section</li>
                  <li>Hammer Section</li>
                  <li>Drying Section</li>
                  <li>Pelletizing Section</li>
                  <li>Cooling Section</li>
                  <li>Packing Section</li>
                </ul>

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
                  src="/images/wood-chips.jpg" 
                  alt="Wood Chips/Sawdust Pellet Production Line"
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