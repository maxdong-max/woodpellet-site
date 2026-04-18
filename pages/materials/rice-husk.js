import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

export default function RiceHuskPage() {
  const t = translations.en;
  const { contact } = t;

  return (
    <>
      <Head>
        <title>Rice Husk Pellet Production Line - Macreat</title>
        <meta name="description" content="Rice husk is a good raw material for the production of biomass fuel in agricultural waste. The rice husk can be pressed into cylindrical pellets directly with a pellet making machine." />
      </Head>

      <Header />

      <main>
        <section className="page-hero">
          <div className="container">
            <h1>Biomass Fuel Pellet Production with Rice Husk</h1>
            <p className="page-hero-subtitle">Macreat Biomass Pellet Machine Solution</p>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <h2>Overview</h2>
                <p>Rice husk is a good raw material for the production of biomass fuel in agricultural waste.</p>
                <p>As long as the moisture meets the requirements, the rice husk can be pressed into cylindrical pellets directly with a pellet making machine, and the diameter of the formed pellets can be 6/8/10 mm.</p>

                <h3>Technique Introduction</h3>
                <p className="solution-flow">Generally Speaking, Using Rice Husk To Produce Pellets Requires A Total Of Four Steps:</p>
                <ul className="solution-features">
                  <li>Drying</li>
                  <li>Pelleting</li>
                  <li>Cooling</li>
                  <li>Packaging</li>
                </ul>

                <h3>Required Equipment</h3>
                <ul className="solution-features">
                  <li>Triple Pass Dryer</li>
                  <li>Pellet Machine</li>
                  <li>Cooler Machine</li>
                  <li>Packing Machine</li>
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
                  src="/images/rice-husk.jpg" 
                  alt="Rice Husk Pellet Production"
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