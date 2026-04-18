import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FloatingSocial from '../../components/FloatingSocial';
import { translations } from '../../lib/content';
import { seoConfig } from '../../lib/seo';

export default function Products() {
  const t = translations.en;
  const products = t.products;

  return (
    <>
      <Head>
        <title>Machines - Macreat Biomass Pellet Machine</title>
        <meta name="description" content="Browse our range of pellet machines including biomass pellet machines, hammer mills, wood chippers, and more." />
        <meta property="og:title" content="Machines - Macreat Biomass Pellet Machine" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/machine/products/" />
      </Head>

      <Header />

      <main id="main">
        <section className="page-hero">
          <div className="container">
            <h1>{products.title}</h1>
            <p>{products.subtitle}</p>
          </div>
        </section>

        <section className="products-section">
          <div className="container">
            <div className="products-grid">
              {products.items.map((item, idx) => (
                <Link key={idx} href={item.href} className="product-card">
                  <div 
                    className="product-image"
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
                      <span style={{ color: 'white', fontSize: '4rem', opacity: 0.8 }}>⚙️</span>
                    ) : null}
                  </div>
                  <div className="product-info">
                    <h3>{item.name}</h3>
                    <p>{item.spec}</p>
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