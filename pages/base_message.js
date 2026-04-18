import Head from 'next/head';
import Link from 'next/link';
import { translations } from '../lib/content';

export default function BaseMessage() {
  const t = translations.en;

  return (
    <>
      <Head>
        <title>Get Your Free E-book - Macreat</title>
      </Head>
      <div style={{ minHeight: '100vh', padding: '60px 20px', background: '#f5f7fa' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#1a1a2e' }}>
            📖 Your Guide How to Setup a Pellet Factory - 2025
          </h1>
          <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '30px', color: '#666' }}>
            This comprehensive e-book covers everything you need to know about setting up a pellet factory, including:
          </p>
          <ul style={{ marginBottom: '30px', lineHeight: '1.8', color: '#555' }}>
            <li>Equipment selection and configuration</li>
            <li>Raw material preparation best practices</li>
            <li>Production line layout planning</li>
            <li>Cost analysis and ROI calculation</li>
            <li>Maintenance and troubleshooting guide</li>
          </ul>
          <div style={{ marginBottom: '30px' }}>
            <Link href="/contact" style={{ display: 'inline-block', padding: '14px 28px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '16px' }}>
              Contact Us to Get Free E-book
            </Link>
          </div>
          <Link href="/" style={{ color: '#4f46e5', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </div>
    </>
  );
}