import Head from 'next/head';
import Link from 'next/link';

export default function ProjectMessage() {
  return (
    <>
      <Head>
        <title>SALE Coupons - Macreat</title>
      </Head>
      <div style={{ minHeight: '100vh', padding: '60px 20px', background: '#f5f7fa' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#1a1a2e' }}>
            🎉 SALE Coupons
          </h1>
          <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '30px', color: '#666' }}>
            We are offering special discount coupons for our pellet machine solutions!
          </p>
          <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#1a1a2e' }}>How to get coupons:</h3>
            <ul style={{ lineHeight: '1.8', color: '#555' }}>
              <li>Contact us via WhatsApp or Email</li>
              <li>Tell us about your project requirements</li>
              <li>Our team will provide you with exclusive discount coupons</li>
            </ul>
          </div>
          <div style={{ marginBottom: '30px' }}>
            <Link href="/contact" style={{ display: 'inline-block', padding: '14px 28px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '16px' }}>
              Contact Us for Coupons
            </Link>
          </div>
          <Link href="/" style={{ color: '#4f46e5', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </div>
    </>
  );
}