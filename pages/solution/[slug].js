import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations, siteContent } from '../../lib/content';

export default function SolutionDetail({ solution, contact }) {
  const images = solution.images || {};

  return (
    <>
      <Head>
        <title>{solution.title} - Macreat</title>
        <meta name="description" content={solution.description || solution.machines || 'Macreat Solution'} />
      </Head>

      <Header />

      <main>
        {/* Hero Section with Main Image */}
        <section className="page-hero" style={{ paddingBottom: '40px' }}>
          <div className="container">
            <h1>{solution.title}</h1>
            {solution.subtitle && <p className="page-hero-subtitle">{solution.subtitle}</p>}
          </div>
        </section>

        {/* Main Overview Image */}
        {images.overview && (
          <section className="solution-main-image">
            <div className="container">
              <img 
                src={images.overview} 
                alt={solution.title}
                style={{ width: '100%', borderRadius: '16px' }}
              />
            </div>
          </section>
        )}

        {/* Overview Section */}
        <section className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                {solution.description && (
                  <>
                    <h2>Overview</h2>
                    <p>{solution.description}</p>
                    {solution.description2 && <p>{solution.description2}</p>}
                  </>
                )}

                {solution.features && solution.features.length > 0 && (
                  <>
                    <h3>Key Features</h3>
                    <ul className="feature-list">
                      {solution.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </>
                )}

                {solution.flow && (
                  <>
                    <h3>Granulation Process</h3>
                    <p className="solution-flow">{solution.flow}</p>
                  </>
                )}
              </div>
              <div className="about-video">
                {images.features ? (
                  <img 
                    src={images.features} 
                    alt="Features"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }}
                  />
                ) : (
                  <img 
                    src={solution.image} 
                    alt={solution.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Granulation Process Image */}
        {images.process && (
          <section className="process-section">
            <div className="container">
              <img 
                src={images.process} 
                alt="Granulation Process"
                style={{ width: '100%', borderRadius: '16px' }}
              />
            </div>
          </section>
        )}

        {/* Customer Plant Section */}
        {solution.customerPlant && (
          <section className="customer-plant-section">
            <div className="container">
              <h2>Customer Plant</h2>
              <p>Fully Automatic Biomass Pellet Line, including but not limited:</p>
              
              <div className="plant-capacity">
                <h3>Unlimited Capacity</h3>
                <p>{solution.customerPlant.capacity}</p>
              </div>

              {/* Customer Plant Image */}
              {images.customerPlant && (
                <div className="plant-image">
                  <img 
                    src={images.customerPlant} 
                    alt="Customer Plant"
                    style={{ width: '100%', borderRadius: '16px', marginBottom: '30px' }}
                  />
                </div>
              )}

              {solution.customerPlant.features && (
                <div className="plant-features">
                  {solution.customerPlant.features.map((feature, index) => (
                    <div key={index} className="plant-feature-card">
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
              )}

              {solution.customerPlant.materials && (
                <div className="plant-materials">
                  <h3>Available materials</h3>
                  <p>{solution.customerPlant.materials}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Product Section */}
        {solution.product && (
          <section className="product-section">
            <div className="container">
              <h2>Customized Biomass Pellet Line</h2>
              <p>We proudly introduce you our High-End All Purpose Whole Pellet Production Solution designs. From here you can use MACREAT equipment to fulfill any forms or your ideal production demands,</p>
              
              {/* Product Image */}
              {images.productVideo && (
                <div className="product-image">
                  <img 
                    src={images.productVideo} 
                    alt={solution.product.name}
                    style={{ width: '100%', borderRadius: '16px', marginBottom: '30px' }}
                  />
                </div>
              )}

              <div className="product-card">
                <h3>{solution.product.name}</h3>
                <ul>
                  <li><strong>Power:</strong> {solution.product.power}</li>
                  <li><strong>Capacity:</strong> {solution.product.capacity}</li>
                  <li>{solution.product.description}</li>
                </ul>
                {solution.product.href && (
                  <Link href={solution.product.href} className="btn btn-primary">
                    View Details
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Process Steps Sections */}
        {solution.processSteps && solution.processSteps.map((step, index) => (
          <section key={index} className="process-step-section">
            <div className="container">
              <h2>{step.title}</h2>
              <p className="process-step-subtitle">Production Process</p>
              <p>{step.description}</p>
              {step.image && (
                <img 
                  src={step.image} 
                  alt={step.title}
                  style={{ width: '100%', borderRadius: '16px', marginTop: '20px' }}
                />
              )}
            </div>
          </section>
        ))}

        {/* Moisture Note Section */}
        {solution.moistureNote && (
          <section className="moisture-note-section" style={{ padding: '40px 0', background: '#f5f5f5', borderRadius: '16px', margin: '30px 0' }}>
            <div className="container">
              <h3 style={{ color: '#e67e22', marginBottom: '15px' }}>{solution.moistureNote.title}</h3>
              <p>{solution.moistureNote.description}</p>
            </div>
          </section>
        )}

        {/* Triple Pass Dryer Section */}
        {solution.triplePassDryer && (
          <section className="triple-pass-dryer-section" style={{ padding: '60px 0' }}>
            <div className="container">
              <h2>{solution.triplePassDryer.title}</h2>
              <p>{solution.triplePassDryer.description}</p>
              {solution.triplePassDryer.features && (
                <ul className="feature-list" style={{ marginTop: '20px' }}>
                  {solution.triplePassDryer.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}
              {solution.triplePassDryer.image && (
                <img 
                  src={solution.triplePassDryer.image} 
                  alt="Triple Pass Dryer"
                  style={{ width: '100%', borderRadius: '16px', marginTop: '30px' }}
                />
              )}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {solution.faq && solution.faq.length > 0 && (
          <section className="faq-section">
            <div className="container">
              <h2>FAQS</h2>
              <div className="faq-grid">
                {solution.faq.map((item, index) => (
                  <div key={index} className="faq-item">
                    <h4>Q: {item.q}</h4>
                    <p>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Find A Good Market Section */}
        {solution.findMarket && (
          <section className="find-market-section" style={{ padding: '60px 0' }}>
            <div className="container">
              <h2>{solution.findMarket.title}</h2>
              {solution.findMarket.description && (
                <p>{solution.findMarket.description}</p>
              )}
              {images.findMarket && (
                <div>
                  <img 
                    src={images.findMarket} 
                    alt="Find A Good Market For Pellets"
                    style={{ width: '100%', borderRadius: '16px', marginTop: '30px' }}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <h2>Get In Touch!</h2>
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

        {/* Equipment Section */}
        {solution.equipment && solution.equipment.length > 0 && (
          <section className="equipment-section" style={{ padding: '60px 0', background: '#f9f9f9' }}>
            <div className="container">
              <h2>Process required equipment</h2>
              <div className="equipment-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
                {solution.equipment.map((item, index) => (
                  <div key={index} className="equipment-card" style={{ background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }}
                      />
                    )}
                    <h3>{item.name}</h3>
                    <p style={{ color: '#666', fontSize: '14px' }}><strong>{item.model}</strong></p>
                    <p style={{ color: '#888', fontSize: '13px', marginTop: '10px' }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Customer Case Section */}
        {solution.customerCase && (
          <section className="customer-case-section" style={{ padding: '60px 0' }}>
            <div className="container">
              <h2>Customer Case</h2>
              {solution.customerCase.image && (
                <img 
                  src={solution.customerCase.image} 
                  alt="Customer Case"
                  style={{ width: '100%', borderRadius: '16px', marginTop: '30px' }}
                />
              )}
              <div style={{ marginTop: '20px' }}>
                <p><strong>Location:</strong> {solution.customerCase.location}</p>
                <p><strong>Capacity:</strong> {solution.customerCase.capacity}</p>
                <p><strong>Raw Material:</strong> {solution.customerCase.rawMaterial}</p>
                <p><strong>Moisture:</strong> {solution.customerCase.moisture}</p>
                <p style={{ marginTop: '15px' }}>{solution.customerCase.description}</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  const slugs = [
    'biomass-pellet-line',
    'wood-pellet-mill-production-line',
    'straw-pelletizing-production-line',
    'biomass-fuel-pellet-production-with-rice-husk',
    'sawdust-pellets-production-line',
    'palm-efb-pellet-production-line',
    'plywood-waste-pellet-making-solution',
    'furniture-scraps-pellet-production-solution',
    'peanut-shell-pelletizing-solution',
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
    fallback: false,
  };
}

export async function getStaticProps({ params, locale }) {
  const t = translations[locale] || translations.en;
  const { systemSolutions, contact } = t;
  
  // Find the solution that matches the slug
  const solution = systemSolutions.items.find(item => 
    item.href === `/solution/${params.slug}/`
  ) || systemSolutions.items[0];

  return {
    props: { 
      solution,
      contact
    }
  };
}