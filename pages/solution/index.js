import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { translations } from '../../lib/content';

const RECOMMENDATION_MATRIX = {
  materials: [
    { id: 'wood', name: 'Wood (Sawdust/Chips/Logs)', slug: 'wood-chips-sawdust' },
    { id: 'straw', name: 'Straw/Agricultural Waste', slug: 'straw-waste' },
    { id: 'husk', name: 'Rice Husk', slug: 'rice-husk' },
    { id: 'palm', name: 'Palm Shell', slug: 'palm-shell' },
    { id: 'feed', name: 'Animal Feed', slug: 'animal-feed' },
  ],
  moistureGuides: {
    'wood': [
      { id: 'low', desc: 'Dry to touch, light color, breaks easily', range: '10-15%' },
      { id: 'mid', desc: 'Slightly damp, typical air-dried wood', range: '15-25%' },
      { id: 'high', desc: 'Wet to touch, heavy, may feel spongy', range: '>25%' },
    ],
    'straw': [
      { id: 'low', desc: 'Crispy, rustles when touched', range: '10-15%' },
      { id: 'mid', desc: 'Flexible, slightly soft', range: '15-25%' },
      { id: 'high', desc: 'Damp, clumps together', range: '>25%' },
    ],
    'husk': [
      { id: 'low', desc: 'Free flowing, very dry', range: '10-15%' },
      { id: 'mid', desc: 'Slightly sticky', range: '15-25%' },
      { id: 'high', desc: 'Moist, clumps easily', range: '>25%' },
    ],
    'palm': [
      { id: 'low', desc: 'Clean, hard, dry surface', range: '10-15%' },
      { id: 'mid', desc: 'Slightly damp', range: '15-25%' },
      { id: 'high', desc: 'Wet, heavy shells', range: '>25%' },
    ],
    'feed': [
      { id: 'low', desc: 'Dry powder/grain', range: '10-15%' },
      { id: 'mid', desc: 'Slightly moist mixture', range: '15-25%' },
      { id: 'high', desc: 'Wet mash/paste', range: '>25%' },
    ],
  },
  capacity: [
    { id: 'small', name: 'Small Scale (< 1.5 t/h)', value: 1.5 },
    { id: 'medium', name: 'Medium Scale (1.5 - 4 t/h)', value: 4 },
    { id: 'large', name: 'Large Scale (> 4 t/h)', value: 12 },
  ],
};

const getRecommendation = (mat, moist, cap) => {
  let dryingNeeded = moist !== 'low';
  let dryerType = 'triple-pass-dryer';
  let prepEquipment = [];

  if (mat === 'wood') {
    prepEquipment.push('drum-wood-chipper');
    if (cap === 'small') prepEquipment.push('hammer-mill');
  } else if (mat === 'straw' || mat === 'husk' || mat === 'palm') {
    prepEquipment.push('hammer-mill');
  }

  let millSlug = cap === 'small' ? 'pellet-mill-rh-and-rv-series' : 'biomass-pellet-machine';
  let lineSlug = cap === 'small' ? '1-1-5t-h-pellet-production-line' : (cap === 'medium' ? '3-4t-h-pellet-production-line' : '8-12t-h-pellet-production-line');

  if (mat === 'feed') {
    return {
      line: 'fully-automatic-feed-pellet-production-line',
      equipment: ['hammer-mill', 'biomass-pellet-machine', 'cooler-machine'],
      note: 'Recommended: Fully Automatic Feed Pellet Production Line for optimized feed quality.'
    };
  }

  const matName = RECOMMENDATION_MATRIX.materials.find(m => m.id === mat)?.name;
  const moistRange = RECOMMENDATION_MATRIX.moistureGuides[mat]?.find(m => m.id === moist)?.range || '10-15%';
  const capName = RECOMMENDATION_MATRIX.capacity.find(m => m.id === cap)?.name;

  return {
    line: lineSlug,
    equipment: [...prepEquipment, millSlug, 'cooler-machine', 'packing-machine'],
    dryer: dryingNeeded ? dryerType : null,
    note: 'Based on ' + matName + ' (' + moistRange + ' moisture) and ' + capName + ', we recommend the following configuration.'
  };
};

export default function Solution() {
  const [configStep, setConfigStep] = useState(0);
  const [config, setConfig] = useState({ mat: '', moist: '', cap: '' });
  const [result, setResult] = useState(null);

  const t = translations.en;
  const { systemSolutions, materials } = t;

  const handleNext = (key, value) => {
    setConfig({ ...config, [key]: value });
    if (configStep < 2) {
      setConfigStep(configStep + 1);
    } else {
      setResult(getRecommendation(config.mat, config.moist, config.cap));
    }
  };

  const resetConfig = () => {
    setConfigStep(0);
    setConfig({ mat: '', moist: '', cap: '' });
    setResult(null);
  };

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

        {/* Smart Configurator Integrated Section */}
        <section className="config-integrated-section">
          <div className="container">
            <div className="config-card">
              {!result ? (
                <div className="config-flow">
                  <div className="step-indicator">
                    <span>Guided Configuration: Step {configStep + 1} of 3</span>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: ((configStep + 1) / 3) * 100 + '%' }}></div></div>
                  </div>

                  {configStep === 0 && (
                    <div className="config-step">
                      <h2 style={{textAlign: 'center', marginBottom: '15px'}}>What is your raw material?</h2>
                      <div className="config-options">
                        {RECOMMENDATION_MATRIX.materials.map(m => (
                          <button key={m.id} className={"option-btn " + (config.mat === m.id ? 'active' : '')} onClick={() => handleNext('mat', m.id)}>{m.name}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {configStep === 1 && (
                    <div className="config-step">
                      <h2 style={{textAlign: 'center', marginBottom: '10px'}}>Determine your moisture content</h2>
                      <p className="guide-text" style={{textAlign: 'center', color: '#666', marginBottom: '20px'}}>Select the description that best matches your material's current state:</p>
                      <div className="config-options">
                        {RECOMMENDATION_MATRIX.moistureGuides[config.mat]?.map(m => (
                          <button key={m.id} className={"option-btn " + (config.moist === m.id ? 'active' : '')} onClick={() => handleNext('moist', m.id)}>
                            <span className="desc">{m.desc}</span>
                            <span className="range">{m.range}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {configStep === 2 && (
                    <div className="config-step">
                      <h2 style={{textAlign: 'center', marginBottom: '15px'}}>Desired production capacity?</h2>
                      <div className="config-options">
                        {RECOMMENDATION_MATRIX.capacity.map(m => (
                          <button key={m.id} className={"option-btn " + (config.cap === m.id ? 'active' : '')} onClick={() => handleNext('cap', m.id)}>{m.name}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="config-result">
                  <h2 style={{textAlign: 'center'}}>Your Recommended Solution</h2>
                  <div className="result-highlight" style={{ background: '#f0fff4', border: '1px solid #c6f6d0', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '20px' }}>
                    <p className="result-note" style={{ fontSize: '1.1rem', marginBottom: '15px' }}>{result.note}</p>
                    <Link href={"/product/" + result.line} className="btn btn-primary">View Production Line →</Link>
                  </div>
                  <div className="equipment-list" style={{ textAlign: 'left', marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '10px', borderLeft: '4px solid #2ecc71', paddingLeft: '10px' }}>Key Components:</h3>
                    <div className="equipment-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      {result.equipment.map((eq, idx) => (
                        <Link key={idx} href={"/product/" + eq} className="eq-item" style={{ display: 'flex', alignItems: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '8px', textDecoration: 'none', color: '#555', border: '1px solid #eee', fontSize: '0.85rem' }}>
                          <span style={{ marginRight: '10px' }}>⚙️</span>
                          <span>{eq.replace(/-/g, ' ').toUpperCase()}</span>
                        </Link>
                      ))}
                      {result.dryer && (
                        <Link href={"/product/" + result.dryer} className="eq-item" style={{ display: 'flex', alignItems: 'center', padding: '10px', background: '#fff5f5', borderRadius: '8px', textDecoration: 'none', color: '#c53030', border: '1px solid #feb2b2', fontSize: '0.85rem' }}>
                          <span style={{ marginRight: '10px' }}>🔥</span>
                          <span>TRIPLE PASS DRYER</span>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="result-actions" style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <button onClick={resetConfig} className="btn btn-secondary">Start Over</button>
                    <Link href="/contact" className="btn btn-primary">Get Detailed Quote</Link>
                  </div>
                </div>
              )}
            </div>
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
                      backgroundImage: 'url(' + item.image + ')',
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
                      backgroundImage: 'url(' + item.image + ')',
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

      <style jsx>{`
        .config-integrated-section { padding: 40px 0; background: #fcfcfc; }
        .config-card { background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; max-width: 800px; margin: 0 auto; }
        .step-indicator { margin-bottom: 25px; text-align: center; font-size: 0.9rem; color: #666; }
        .progress-bar { height: 6px; background: #eee; border-radius: 3px; margin-top: 8px; overflow: hidden; }
        .progress-fill { height: 100%; background: #2ecc71; transition: width 0.3s ease; }
        .config-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
        .option-btn { padding: 15px; border: 2px solid #eee; background: white; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; text-align: left; display: flex; flex-direction: column; font-size: 0.9rem; }
        .option-btn:hover { border-color: #2ecc71; background: #f0fff4; }
        .option-btn.active { border-color: #2ecc71; background: #2ecc71; color: white; }
        .option-btn .desc { font-weight: 500; margin-bottom: 3px; }
        .option-btn .range { font-size: 0.8rem; opacity: 0.8; }
        .guide-text { font-size: 0.95rem; }
      `}</style>
    </>
  );
}