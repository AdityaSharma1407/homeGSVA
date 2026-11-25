import { Breadcrumb } from '@/components/common/Breadcrumb';
import { JsonLd } from '@/components/common/JsonLd';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';

const canonicalPath = '/methodology/';

export const metadata = buildPageMetadata(
  'Calculation Methodology & Assumptions | HomeCalc Pro',
  'Review the exact engineering formulas, ASTM/manufacturer yield assumptions, IEEE-754 rounding safeguards, and estimation disclaimers used by HomeCalc Pro.',
  canonicalPath
);

const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Methodology' }];

export default function MethodologyPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, canonicalPath)} />
      <Breadcrumb items={breadcrumbs} />

      <section className="page-hero">
        <h1>Calculation Methodology &amp; Assumptions</h1>
        <p>
          Every HomeCalc Pro estimator is backed by unit-tested TypeScript math
          engines and documented retail/industry yield standards.
        </p>
      </section>

      <article className="editorial-section">
        <h2>1. IEEE-754 Safe Rounding</h2>
        <p>
          JavaScript floating-point arithmetic can introduce tiny representation
          errors (for example, <code>55.00000000000001 / 0.5</code> evaluating
          to <code>110.00000000000001</code>, which naive{' '}
          <code>Math.ceil()</code> would round up to <code>111</code>). All
          discrete package counts on HomeCalc Pro use{' '}
          <code>safeCeil(value) = Math.ceil(value - 1e-9)</code> so exact
          boundary quantities never over-order an extra bag, box, or can.
        </p>

        <h2>2. Standard Retail &amp; Industry Yield Assumptions</h2>
        <ul>
          <li>
            <strong>Paint:</strong> 350 sq ft/gal (10 m²/L) default topcoat
            coverage; 250 sq ft/gal (7 m²/L) primer; 21 sq ft standard door
            (3×7 ft) and 15 sq ft standard window (3×5 ft).
          </li>
          <li>
            <strong>Concrete:</strong> Quikrete No. 1101 pre-mixed bag yields:
            0.30 cu ft per 40 lb bag, 0.45 cu ft per 60 lb bag, and 0.60 cu ft
            per 80 lb bag; normal-weight concrete density 150 lb/cu ft (2,400
            kg/m³).
          </li>
          <li>
            <strong>Mulch:</strong> 27 cu ft per cubic yard; standard retail
            bags evaluated at 2 cu ft and 3 cu ft (or 50 L and 75 L in Metric).
          </li>
          <li>
            <strong>Tile &amp; Grout:</strong> Effective tile pitch equals{' '}
            <code>(L + gap) × (W + gap)</code>. Grout weight uses standard
            cementitious grout density of 1.9 kg/L.
          </li>
          <li>
            <strong>Fencing:</strong> Actual planed lumber dimensions (3.5×3.5
            in for 4×4 posts, 5.5 in for 1×6 pickets) and subtracts buried post
            volume from cylindrical hole volume before applying concrete waste.
          </li>
          <li>
            <strong>Gravel:</strong> Bulk aggregate densities range from 2,403
            lb/cu yd (river rock) to 2,970 lb/cu yd (compacted crusher run),
            with 2,000 lb per US ton.
          </li>
        </ul>

        <h2>3. Estimation Disclaimer</h2>
        <p>
          Material estimates are provided for planning and budgeting purposes.
          Actual job-site consumption varies with subgrade unevenness, wood
          moisture, trowel notch depth, and applicator technique. Always verify
          manufacturer specifications on the product label and consult a
          licensed structural engineer for load-bearing footings, retaining
          walls, or commercial slabs.
        </p>
      </article>
    </>
  );
}
