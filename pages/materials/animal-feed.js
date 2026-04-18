import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

export default function AnimalFeedPage() {
  const t = translations.en;
  const { contact } = t;

  return (
    <>
      <Head>
        <title>Fully Automatic Feed Pellet Production Line - Macreat</title>
        <meta name="description" content="Automatic dosing feed pellet line can be used for processing livestock and poultry feed pellets. It has good versatility of raw materials and is suitable for pelletizing corn, wheat, beans, oilseed meal, etc." />
      </Head>

      <Header />

      <main>
        <section className="page-hero">
          <div className="container">
            <h1>Fully Automatic Feed Pellet Production Line</h1>
            <p className="page-hero-subtitle">Macreat Biomass Pellet Machine Solution</p>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <h2>Feed Pellets Introduction</h2>
                <p>Automatic dosing feed pellet line can be used for processing livestock and poultry feed pellets, it has good versatility of raw materials and is suitable for pelletizing corn, wheat, beans, oilseed meal, etc. This line can simultaneously meet the powder processing and granule processing of two types of feed products.</p>
                <p>This animal feed production plant for livestock is suitable for large and medium-size farms and medium-sized feed mill plant. It can produce chicken feed, cattle feed, sheep feed and other kinds of pellet feed or powder feed.</p>

                <h3>Application</h3>
                <p>Used for one or more kinds of poultry feed production (also process multiple feeds at the same time, poultry & livestock, poultry & ruminant, poultry & aqua)</p>

                <h3>Flowchart of Animal Feed Production Plant</h3>
                <ol className="solution-features">
                  <li>Crushing Section</li>
                  <li>Mixing Section</li>
                  <li>Pelletizing Section</li>
                  <li>Cooling Section</li>
                  <li>Classifying Screen</li>
                  <li>Packing Section</li>
                </ol>

                <h3>Feed Mill Equipment Advantages</h3>
                <ul className="solution-features">
                  <li><strong>Automatic batching</strong> of multiple materials, controlled by PLC touch screen</li>
                  <li><strong>Continuous production</strong> with silos between sections</li>
                  <li><strong>Less human intervention</strong> - only 1-2 people for feeding and packaging</li>
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
                  src="/images/animal-feed.jpg" 
                  alt="Fully Automatic Feed Pellet Production Line"
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