import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

export default function NewsDetail({ newsItem, contact }) {
  if (!newsItem) {
    return (
      <>
        <Head>
          <title>News Not Found - Macreat</title>
        </Head>
        <Header />
        <main>
          <div className="container">
            <h1>News Not Found</h1>
            <p>The requested news article could not be found.</p>
            <Link href="/news">← Back to News</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{newsItem.title} - Macreat</title>
        <meta name="description" content={newsItem.excerpt || newsItem.title} />
      </Head>

      <Header />

      <main>
        <section className="page-hero">
          <div className="container">
            <h1>{newsItem.title}</h1>
            {newsItem.date && <p className="page-hero-subtitle">{newsItem.date}</p>}
          </div>
        </section>

        <section className="news-detail-section">
          <div className="container">
            {newsItem.image && (
              <div className="news-detail-image">
                <img src={newsItem.image} alt={newsItem.title} />
              </div>
            )}
            
            <div className="news-detail-content">
              {newsItem.content && (
                <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
              )}
              
              {newsItem.sections && newsItem.sections.map((section, idx) => (
                <div key={idx} className="news-section">
                  {section.title && <h2>{section.title}</h2>}
                  {section.content && <p>{section.content}</p>}
                </div>
              ))}
            </div>

            <div className="news-back-link">
              <Link href="/news">← Back to News</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// Add locales like solution page
export async function getStaticPaths() {
  const slugs = [
    'macreat-makes-dual-expo-debut-in-thailand-vietnam',
    'macreat-welcomes-you-at-bbbsaf-aetd-2026-vietnam-booth-w12',
    'macreat-cordially-invites-you-to-the-2026-asean-biomass-energy-expo',
  ];
  const locales = ['en', 'zh', 'id'];
  
  const paths = [];
  for (const slug of slugs) {
    for (const locale of locales) {
      paths.push({
        params: { slug },
        locale,
      });
    }
  }

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { news } = translations.en;
  const slug = params.slug;
  
  const newsItem = news.items.find(item => {
    return item.href.includes(slug);
  });

  const contact = translations.en.contact;

  return {
    props: {
      newsItem: newsItem || null,
      contact
    }
  };
}