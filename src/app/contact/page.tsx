import { Breadcrumb } from '@/components/common/Breadcrumb';
import { JsonLd } from '@/components/common/JsonLd';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';

const canonicalPath = '/contact/';

export const metadata = buildPageMetadata(
  'Contact Us | HomeCalc Pro',
  'Contact GSVA Lab regarding HomeCalc Pro material calculators, bug reports, formula feedback, or compliance inquiries.',
  canonicalPath
);

const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Contact' }];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, canonicalPath)} />
      <Breadcrumb items={breadcrumbs} />

      <section className="page-hero">
        <h1>Contact GSVA Lab</h1>
        <p>
          Found a formula edge case, want to suggest a new renovation estimator,
          or have a compliance question? Reach out directly.
        </p>
      </section>

      <article className="editorial-section">
        <h2>Direct Email</h2>
        <p>
          Because HomeCalc Pro runs with zero backend servers, we do not process
          server-side contact forms. You can email our team directly at:
        </p>
        <p>
          <a
            href="mailto:support@gsvalab.com?subject=HomeCalc%20Pro%20Inquiry"
            className="btn btn-primary"
          >
            Email support@gsvalab.com
          </a>
        </p>

        <h2>What to Include in Bug Reports</h2>
        <ul>
          <li>
            The calculator URL (e.g., <code>/fencing-calculator/</code>)
          </li>
          <li>Whether you were using US Imperial or Metric units</li>
          <li>The exact input dimensions and expected vs. observed result</li>
        </ul>
      </article>
    </>
  );
}
