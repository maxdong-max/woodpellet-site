import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

export default function Solution() {
  const t = translations.en;
  const { systemSolutions, materials } = t;

  return (
    <>
      <Head>
        <title>Biomass Pellet Machine Solutions - Macreat</title>
        <meta name="description" content="Complete biomass pellet production solutions. From raw material processing to final pellet packaging, Macreat provides professional pellet machine solutions." />
      </Head>

      <Header />

      <main>
        {/* Hero */}
        <section className="page-hero">
          <div className="container">
            <h1>System Solutions</h1>
            <p>Delivering comprehensive, reliable, and professional biomass new energy and environmental protection equipment tailored to your needs.</p>
          </div>
        </section>

        {/* Solutions */}
        <section className="solutions-section">
          <div className="container">
            <div className="solutions-grid">
              {systemSolutions.items.map((item, idx) => (
                <div key={idx} className="solution-card">
                  <div 
                    className="solution-image"
                    style={item.image ? {
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    } : {}}
                  />
                  <div className="solution-content">
                    <h3>{item.title}</h3>
                    <p className="solution-machines">{item.machines}</p>
                    <p className="solution-technique">{item.technique}</p>
                    <Link href={item.href} className="solution-link">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Materials */}
        <section className="materials-section">
          <div className="container">
            <h2>{materials.title}</h2>
            <p className="section-subtitle">{materials.subtitle}</p>
            <div className="materials-grid">
              {materials.items.map((item, idx) => (
                <Link key={idx} href={item.href} className="material-card">
                  <div 
                    className="material-image"
                    style={item.image ? {
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    } : {}}
                  />
                  <div className="material-content">
                    <h3>{item.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <h2>Need a Custom Solution?</h2>
            <p>Contact our expert team for personalized biomass pellet production line recommendations.</p>
            <Link href={t.contact.whatsappLink} className="btn btn-primary">
              Get Free Consultation
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}