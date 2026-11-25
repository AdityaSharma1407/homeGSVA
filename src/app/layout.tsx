import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import '@/styles/tokens.css';
import '@/styles/global.css';
import '@/styles/calculator.css';
import '@/styles/print.css';
import { BrandLogo } from '@/components/common/BrandLogo';
import { HeaderNav } from '@/components/common/HeaderNav';
import { ProjectBagDrawer } from '@/components/common/ProjectBagDrawer';
import { JsonLd } from '@/components/common/JsonLd';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1E3A5F',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://home.gsvalab.com'),
  title: 'HomeCalc Pro — Home & Renovation Material Estimators Hub',
  description:
    'Free, zero-server home renovation and landscaping material estimators for Paint, Concrete, Mulch, Tile, Fencing, and Gravel.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  verification: {
    google: 'lsRaOmbxnKQtMOvI5oxsTVdtyBBuVHI7K-osBscbwds',
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GSVA Lab — HomeCalc Pro',
  url: 'https://gsvalab.com',
  sameAs: ['https://home.gsvalab.com'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HomeCalc Pro',
  url: 'https://home.gsvalab.com',
  description:
    'Zero-server Home & Renovation Material Estimators for Paint, Concrete, Mulch, Tile, Fencing, and Gravel.',
};

const footerTools = [
  { label: 'Paint', href: '/paint-calculator/' },
  { label: 'Concrete', href: '/concrete-calculator/' },
  { label: 'Mulch', href: '/mulch-calculator/' },
  { label: 'Tile', href: '/tile-wastage-calculator/' },
  { label: 'Fencing', href: '/fencing-calculator/' },
  { label: 'Gravel', href: '/gravel-calculator/' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={orgSchema} />
        <JsonLd data={websiteSchema} />

        <header className="site-header no-print">
          <div className="container header-inner">
            <Link href="/" className="brand-link">
              <BrandLogo size={34} />
              <span className="brand-wordmark">
                <span>HomeCalc Pro</span>
                <span className="brand-sub">GSVA Lab</span>
              </span>
            </Link>

            <HeaderNav />

            <div className="header-actions">
              <ProjectBagDrawer />
            </div>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="site-footer no-print">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-col">
                <h3>HomeCalc Pro</h3>
                <p style={{ margin: 0 }}>
                  Precision, zero-server renovation and landscaping material
                  estimators by <a href="https://gsvalab.com">GSVA Lab</a>.
                </p>
              </div>
              <div className="footer-col">
                <h3>Estimators</h3>
                <ul>
                  {footerTools.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.label} Calculator</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer-col">
                <h3>Methodology &amp; Trust</h3>
                <ul>
                  <li>
                    <Link href="/about/">About HomeCalc Pro</Link>
                  </li>
                  <li>
                    <Link href="/methodology/">Calculation Methodology</Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy/">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms/">Terms of Use</Link>
                  </li>
                  <li>
                    <Link href="/contact/">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 GSVA Lab · home.gsvalab.com</span>
              <span>100% Client-Side · Instant Local Storage</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
