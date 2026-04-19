import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
    note: `Based on ${matName} (${moistRange} moisture) and ${capName}, we recommend the following configuration.`
  };
};

export default function Configurator() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({ mat: '', moist: '', cap: '' });
  const [result, setResult] = useState(null);

  const handleNext = (key, value) => {
    setConfig({ ...config, [key]: value });
    if (step < 2) {
      setStep(step + 1);
    } else {
      setResult(getRecommendation(config.mat, config.moist, config.cap));
    }
  };

  const reset = () => {
    setStep(0);
    setConfig({ mat: '', moist: '', cap: '' });
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Smart Configuration Guide | Macreat Biomass Solutions</title>
      </Head>
      <Header />
      <main className="configurator-page">
        <section className="config-hero">
          <div className="container">
            <h1>Smart Configuration Guide</h1>
            <p>Let our expert system guide you to the right equipment configuration.</p>
          </div>
        </section>

        <section className="config-stepper">
          <div className="container">
            <div className="config-card">
              {!result ? (
                <div className="config-flow">
                  <div className="step-indicator">
                    <span>Step {step + 1} of 3</span>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${((step + 1) / 3) * 100}%` }}></div></div>
                  </div>

                  {step === 0 && (
                    <div className="config-step">
                      <h2>What is your raw material?</h2>
                      <div className="config-options">
                        {RECOMMENDATION_MATRIX.materials.map(m => (
                          <button key={m.id} className={`option-btn ${config.mat === m.id ? 'active' : ''}`} onClick={() => handleNext('mat', m.id)}>{m.name}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="config-step">
                      <h2>Guide: Determine your moisture content</h2>
                      <p className="guide-text">Select the description that best matches your material's current state:</p>
                      <div className="config-options">
                        {RECOMMENDATION_MATRIX.moistureGuides[config.mat]?.map(m => (
                          <button key={m.id} className={`option-btn ${config.moist === m.id ? 'active' : ''}`} onClick={() => handleNext('moist', m.id)}>
                            <span className="desc">{m.desc}</span>
                            <span className="range">{m.range}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="config-step">
                      <h2>Desired production capacity?</h2>
                      <div className="config-options">
                        {RECOMMENDATION_MATRIX.capacity.map(m => (
                          <button key={m.id} className={`option-btn ${config.cap === m.id ? 'active' : ''}`} onClick={() => handleNext('cap', m.id)}>{m.name}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="config-result">
                  <h2>Your Recommended Solution</h2>
                  <div className="result-highlight">
                    <p className="result-note">{result.note}</p>
                    <Link href={`/product/${result.line}`} className="btn btn-primary">View Production Line →</Link>
                  </div>
                  <div className="equipment-list">
                    <h3>Key Components:</h3>
                    <div className="equipment-grid">
                      {result.equipment.map((eq, idx) => (
                        <Link key={idx} href={`/product/${eq}`} className="eq-item">
                          <span className="eq-icon">⚙️</span>
                          <span className="eq-name">{eq.replace(/-/g, ' ').toUpperCase()}</span>
                        </Link>
                      ))}
                      {result.dryer && (
                        <Link href={`/product/${result.dryer}`} className="eq-item eq-dryer">
                          <span className="eq-icon">🔥</span>
                          <span className="eq-name">TRIPLE PASS DRYER</span>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="result-actions">
                    <button onClick={reset} className="btn btn-secondary">Start Over</button>
                    <Link href="/contact" className="btn btn-primary">Get Detailed Quote</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <style jsx>{`
          .configurator-page { background: #f8f9fa; min-height: 100vh; }
          .config-hero { text-align: center; padding: 60px 0; background: linear-gradient(135deg, #1a3a3a 0%, #2d5a5a 100%); color: white; }
          .config-stepper { padding: 40px 0; margin-top: -40px; }
          .config-card { background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 40px; max-width: 800px; margin: 0 auto; }
          .step-indicator { margin-bottom: 30px; text-align: center; }
          .progress-bar { height: 8px; background: #eee; border-radius: 4px; margin-top: 10px; overflow: hidden; }
          .progress-fill { height: 100%; background: #2ecc71; transition: width 0.3s ease; }
          .config-step h2 { text-align: center; margin-bottom: 10px; font-size: 1.5rem; color: #333; }
          .guide-text { text-align: center; margin-bottom: 20px; color: #666; }
          .config-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
          .option-btn { padding: 20px; border: 2px solid #eee; background: white; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; text-align: left; display: flex; flex-direction: column; }
          .option-btn:hover { border-color: #2ecc71; background: #f0fff4; }
          .option-btn.active { border-color: #2ecc71; background: #2ecc71; color: white; }
          .option-btn .desc { font-weight: 500; margin-bottom: 5px; }
          .option-btn .range { font-size: 0.85rem; opacity: 0.8; }
          .config-result { text-align: center; }
          .result-highlight { background: #f0fff4; border: 1px solid #c6f6d0; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
          .result-note { font-size: 1.2rem; margin-bottom: 20px; color: #2d5a5a; }
          .equipment-list { text-align: left; margin-bottom: 40px; }
          .equipment-list h3 { margin-bottom: 20px; border-left: 4px solid #2ecc71; padding-left: 15px; }
          .equipment-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 15px; }
          .eq-item { display: flex; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; text-decoration: none; color: #555; border: 1px solid #eee; }
          .eq-item:hover { background: #eef2f3; color: #000; }
          .eq-icon { margin-right: 15px; font-size: 1.5rem; }
          .eq-name { font-weight: 500; font-size: 0.9rem; }
          .eq-dryer { background: #fff5f5; border-color: #feb2b2; }
          .result-actions { display: flex; justify-content: center; gap: 20px; margin-top: 30px; }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
