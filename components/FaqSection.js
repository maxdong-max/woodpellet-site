'use client';

import { useState } from 'react';

export default function FaqSection({ faq }) {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <section className="faq-section">
      <div className="container">
        <h2>{faq.title}</h2>
        <div className="faq-list">
          {faq.items.map((item, idx) => (
            <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
              <button 
                className="faq-question" 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                type="button"
              >
                <span>{item.question}</span>
                <span className="faq-icon">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}