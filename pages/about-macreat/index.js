import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

export default function About() {
  const t = translations.en;
  const { about } = t;

  return (
    <>
      <Head>
        <title>About Macreat - Biomass Pellet Machine Manufacturer</title>
        <meta name="description" content="Macreat - Founded in 1960, a leading manufacturer and supplier of pellet machines and biomass energy equipment." />
      </Head>

      <Header />

      <main>
        <section className="page-hero">
          <div className="container">
            <h1>{about.title}</h1>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <h2>About Macreat</h2>
                <p>{about.description}</p>
                <Link href="/contact/" className="btn btn-primary">
                  {about.cta}
                </Link>
              </div>
              <div className="about-video">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={about.videoUrl || "https://www.youtube.com/embed/UtQPMJT_1lQ"}
                  title="Factory Video"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-section">
          <div className="container">
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">62+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Global Clients</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Countries Served</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}