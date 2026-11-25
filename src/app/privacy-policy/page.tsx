import Link from 'next/link';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { JsonLd } from '@/components/common/JsonLd';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';

const canonicalPath = '/privacy-policy/';

export const metadata = buildPageMetadata(
  'Privacy Policy | HomeCalc Pro',
  'HomeCalc Pro privacy policy covering zero-server localStorage persistence, Google AdSense cookies, and EEA/UK/Switzerland consent readiness.',
  canonicalPath
);

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Privacy Policy' },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, canonicalPath)} />
      <Breadcrumb items={breadcrumbs} />

      <section className="page-hero">
        <h1>Privacy Policy</h1>
        <p>Effective Date: November 2026 · GSVA Lab (home.gsvalab.com)</p>
      </section>

      <article className="editorial-section">
        <h2>1. Local Browser Storage (Zero Server Collection)</h2>
        <p>
          HomeCalc Pro operates entirely as a static client-side web
          application. We do not operate user accounts, backend databases, or
          server-side tracking of your renovation dimensions. Your unit
          preferences and <strong>Project Bag</strong> zones are saved locally
          in your browser&apos;s <code>localStorage</code> under the key{' '}
          <code>homecalc_pro_project_bag_v1</code> and can be cleared at any
          time from the Project Bag drawer or your browser settings.
        </p>

        <h2>2. Advertising &amp; Google AdSense</h2>
        <p>
          To keep HomeCalc Pro free at $0 runtime cost, this site reserves
          advertising placements for Google AdSense. When enabled, third-party
          vendors, including Google, use cookies or device identifiers to serve
          ads based on your prior visits to this website or other websites.
        </p>
        <ul>
          <li>
            Google&apos;s use of advertising cookies enables it and its partners
            to serve ads based on your visit to <code>home.gsvalab.com</code>{' '}
            and/or other sites on the Internet.
          </li>
          <li>
            You may opt out of personalized advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>{' '}
            or{' '}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
            >
              aboutads.info
            </a>
            .
          </li>
        </ul>

        <h2>3. EEA, UK &amp; Switzerland Consent (CMP Readiness)</h2>
        <p>
          For visitors located in the European Economic Area (EEA), the United
          Kingdom, or Switzerland, personalized advertising cookies are only set
          in accordance with applicable consent signals provided through a
          Google Consent Management Platform (CMP) when AdSense units are
          active.
        </p>

        <h2>4. Contact</h2>
        <p>
          Questions about this Privacy Policy may be sent via our{' '}
          <Link href="/contact/">Contact page</Link>.
        </p>
      </article>
    </>
  );
}
