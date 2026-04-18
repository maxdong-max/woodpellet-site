import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FloatingSocial from '../../components/FloatingSocial';
import { translations } from '../../lib/content';
import { seoConfig } from '../../lib/seo';

export default function Case() {
  const t = translations.en;
  const cases = t.cases;

  return (
    <>
      <Head>
        <title>Case Studies - Macreat Biomass Pellet Machine</title>
        <meta name="description" content="Explore our successful case studies of pellet machine installations worldwide." />
        <meta property="og:title" content="Case Studies - Macreat Biomass Pellet Machine" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/case/" />
      </Head>

      <Header />

      <main id="main">
        <section className="page-hero">
          <div className="container">
            <h1>{cases.title}</h1>
            <p>{cases.subtitle}</p>
          </div>
        </section>

        <section className="cases-section">
          <div className="container">
            <div className="cases-grid">
              {cases.items.map((item, idx) => (
                <Link key={idx} href={item.href} className="case-card">
                  <div 
                    className="case-image"
                    style={{
                      backgroundImage: item.image && (item.image.startsWith('http') || item.image.startsWith('/images')) ? `url(${item.image})` : undefined,
                      background: !item.image || (!item.image.startsWith('http') && !item.image.startsWith('/images')) ? `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {!item.image || (!item.image.startsWith('http') && !item.image.startsWith('/images')) ? (
                      <span style={{ color: 'white', fontSize: '4rem', opacity: 0.8 }}>🏭</span>
                    ) : null}
                  </div>
                  <div className="case-info">
                    <h3>{item.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <FloatingSocial />
      <Footer />
    </>
  );
}