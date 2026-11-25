import { Breadcrumb } from '@/components/common/Breadcrumb';
import { JsonLd } from '@/components/common/JsonLd';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';

const canonicalPath = '/about/';

export const metadata = buildPageMetadata(
  'About HomeCalc Pro | GSVA Lab',
  'Learn about HomeCalc Pro by GSVA Lab—our zero-server architecture, deterministic renovation math engines, and commitment to fast, private material estimation.',
  canonicalPath
);

const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'About' }];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, canonicalPath)} />
      <Breadcrumb items={breadcrumbs} />

      <section className="page-hero">
        <h1>About HomeCalc Pro</h1>
        <p>
          Fast, transparent, zero-server renovation and landscaping material
          estimators built by GSVA Lab.
        </p>
      </section>

      <article className="editorial-section">
        <h2>Our Mission</h2>
        <p>
          <strong>HomeCalc Pro</strong> (<code>home.gsvalab.com</code>) was
          created by <strong>GSVA Lab</strong> to give homeowners, DIYers, and
          contractors a single, distraction-free drafting desk for estimating
          building and landscaping materials. Too many online calculators hide
          formulas behind lead-generation forms, clutter mobile screens with
          popups, or round up individual rooms so you overbuy at the hardware
          store.
        </p>

        <h2>Zero-Server Privacy by Design</h2>
        <p>
          Every calculation on HomeCalc Pro executes deterministically in your
          browser using pure TypeScript math modules. Your room dimensions,
          fence layouts, and multi-zone <strong>Project Bag</strong> never leave
          your device—they are stored strictly in your browser&apos;s{' '}
          <code>localStorage</code>.
        </p>

        <h2>Part of the GSVA Lab Ecosystem</h2>
        <p>
          HomeCalc Pro focuses exclusively on Home, Renovation, Yard, and
          Landscaping estimation (Paint, Concrete, Mulch, Tile, Fencing, and
          Gravel). For general developer, document, and media utilities, visit
          our sister suite at{' '}
          <a href="https://tools.gsvalab.com">tools.gsvalab.com</a>.
        </p>
      </article>
    </>
  );
}
