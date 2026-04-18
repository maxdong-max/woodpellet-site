import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

export default function PalmShellPage() {
  const t = translations.en;
  const { contact } = t;

  return (
    <>
      <Head>
        <title>Palm EFB Pellet Production Line - Macreat</title>
        <meta name="description" content="The empty fruit bunches from the residues and waste produced in the palm oil extraction process can be used as a good raw material for solid biomass fuel." />
      </Head>

      <Header />

      <main>
        <section className="page-hero">
          <div className="container">
            <h1>Palm EFB Pellet Production Line</h1>
            <p className="page-hero-subtitle">Macreat Biomass Pellet Machine Solution</p>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <h2>Overview</h2>
                <p>The empty fruit bunches from the residues and waste produced in the palm oil extraction process can be used as a good raw material for solid biomass fuel.</p>
                <p>As long as the moisture meets the requirements, the rice husk can be directly pressed into cylindrical particles with a pelletizer, and the diameter of the shaped particles can reach 6/8/10mm. Realize the reuse of waste materials and obtain more benefits at the same time.</p>

                <h3>Technique Introduction</h3>
                <p className="solution-flow">The Production Line Of Producing Pellet With Furniture Scrap Is Composed Of Five Sections:</p>
                <ul className="solution-features">
                  <li>Crushing Section</li>
                  <li>Pulverizing Section</li>
                  <li>Pelleting Section</li>
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
                  src="/images/palm-shell.jpg" 
                  alt="Palm EFB Pellet Production Line"
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