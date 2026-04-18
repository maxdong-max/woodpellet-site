import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

export default function WoodWastePage() {
  const t = translations.en;
  const { contact } = t;

  return (
    <>
      <Head>
        <title>Wood Waste Pellet Production Line - Macreat</title>
        <meta name="description" content="Macreat Biomass Pellet Machine Solution for wood waste. This production line can process and granulate high-moisture biological raw materials." />
      </Head>

      <Header />

      <main>
        <section className="page-hero">
          <div className="container">
            <h1>Wood Waste Pellet Production Line</h1>
            <p className="page-hero-subtitle">Macreat Biomass Pellet Machine Solution</p>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <h2>Overview</h2>
                <p>This production line can process and granulate high-moisture biological raw materials.</p>
                <p>The overall production line consists of crushing section, grinding section, drying section, granulation section, cooling section, and packaging section. This production line can achieve fully automated operation, efficient and stable production, and reduce manual intervention. All sections use closed processing and transportation, and the dust removal system can effectively reduce dust pollution in the production workshop.</p>

                <h3>Process Flow</h3>
                <p className="solution-flow">Raw Material → 1. Crushing machine → 2. Drying machine → 3. Grinding machine → 4. Pelleting machine → 5. Cooling machine → 6. Packing machine → Pellets</p>

                <h3>Production Capacity</h3>
                <p>From 10T/h, to 100T/h, and even more, you have Macreat Engineering help you to make thorough design overall and guarantee smooth operation & optimal performance as always.</p>

                <h3>Applicable Materials</h3>
                <ul className="solution-features">
                  <li>Palm Kernel Shell</li>
                  <li>Palm EFB</li>
                  <li>Furfural residue</li>
                  <li>Agricultural straws</li>
                  <li>Animal Dumps</li>
                  <li>Wastes Papers</li>
                  <li>Wasted Furniture & Panels</li>
                  <li>Wastes from food industries</li>
                </ul>

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
                  src="/images/wood-waste.jpg" 
                  alt="Wood Waste Pellet Production Line"
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