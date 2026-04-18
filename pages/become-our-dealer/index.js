import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

export default function BecomeDealer() {
  const t = translations.en;
  const { about, contact } = t;

  return (
    <>
      <Head>
        <title>Become Our Dealer - Macreat</title>
        <meta name="description" content="Join Macreat's global dealer network. Partner with a leading biomass pellet machine manufacturer since 1960." />
      </Head>

      <Header />

      <main>
        <section className="page-hero">
          <div className="container">
            <h1>Become Our Dealer</h1>
            <p>Join our global network of authorized distributors</p>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <h2>Why Partner With Macreat?</h2>
                <p>Macreat has been a leading manufacturer of biomass pellet machines since 1960. We are looking for qualified distributors to expand our global presence.</p>
                <ul>
                  <li>✅ 62+ Years Industry Experience</li>
                  <li>✅ 1000+ Global Clients</li>
                  <li>✅ 50+ Countries Served</li>
                  <li>✅ Professional Technical Support</li>
                  <li>✅ Competitive Commission Structure</li>
                </ul>
                <Link href={contact.whatsappLink} className="btn btn-primary">
                  Apply Now via WhatsApp
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
      </main>

      <Footer />
    </>
  );
}