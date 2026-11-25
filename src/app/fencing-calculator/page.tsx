import Link from 'next/link';
import { AdSlot } from '@/components/common/AdSlot';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { JsonLd } from '@/components/common/JsonLd';
import { FenceCalculator } from '@/components/calculators/FenceCalculator';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
  buildPageMetadata,
} from '@/lib/seo';

const canonicalPath = '/fencing-calculator/';

export const metadata = buildPageMetadata(
  'Fencing Calculator — Posts, Rails, Pickets & Footing Concrete | HomeCalc Pro',
  'Calculate fence posts, rails, pickets, gate deductions, recommended post lengths, and post-hole concrete bags (subtracting buried wood volume) in one estimate.',
  canonicalPath
);

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Fencing Calculator' },
];

const fenceFaqs = [
  {
    question: 'Why does a straight fence run have 1 more post than sections?',
    answer:
      'An open line of 13 bays requires both a starting end post and a finishing end post (13 + 1 = 14 posts). A closed loop shares the start and end post (13 posts).',
  },
  {
    question: 'Why is 1×6 picket width 5.5 inches instead of 6 inches?',
    answer:
      'Nominal 1×6 lumber is planed to 5.5 inches actual width. Using 6 inches would undercount your pickets by nearly 9%.',
  },
  {
    question: 'Should I pour gravel at the bottom of each fence post hole?',
    answer:
      'Yes—4 to 6 inches of crushed stone at the bottom of the hole promotes drainage away from the end grain of pressure-treated wood posts.',
  },
];

const fenceHowTo = {
  name: 'How to Calculate Fence Posts, Pickets, and Concrete',
  description:
    'Size fence posts, rails, pickets, and post-hole concrete bags for any straight or closed run.',
  steps: [
    'Subtract total gate width from total fence run length to get net fence run.',
    'Divide net run by post spacing (typically 8 ft) and round up for sections; add 1 post for straight runs.',
    'Divide net run (in inches) by (picket width + gap) and add 5% waste.',
    'Compute cylindrical hole volume minus buried post volume, multiply by posts and 10% waste, and divide by bag yield.',
  ],
};

export default function FenceCalculatorPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, canonicalPath)} />
      <JsonLd data={buildFaqSchema(fenceFaqs)} />
      <JsonLd data={buildHowToSchema(fenceHowTo)} />

      <Breadcrumb items={breadcrumbs} />

      <section className="page-hero">
        <h1>Fencing Calculator</h1>
        <p>
          Generate a complete lumber and concrete bill of materials—including
          post spacing, gate deductions, picket waste, and exact footing
          concrete per post.
        </p>
      </section>

      <FenceCalculator />

      <AdSlot slotId="fence-below-fold" />

      <article className="editorial-section">
        <div className="aeo-answer-box">
          <span className="aeo-answer-label">Quick Answer</span>
          <p>
            A <strong>100 ft straight 6 ft privacy fence</strong> at 8 ft post
            spacing requires <strong>14 posts</strong> (9 ft length),{' '}
            <strong>39 rails</strong>, <strong>230 pickets</strong> (5.5 in
            actual 1×6 with 5% waste), and{' '}
            <strong>36 × 80 lb concrete bags</strong> for 12×24 in footings.
          </p>
        </div>

        <h2>Worked Example: 100 ft Straight 6 ft Privacy Fence</h2>
        <p>
          For a <strong>100 ft</strong> straight run, <strong>6 ft</strong>{' '}
          high, with <strong>8 ft</strong> post spacing, <strong>3 rails</strong>{' '}
          per section, <strong>5.5 in</strong> actual 1×6 pickets (0 in gap, 5%
          waste), and <strong>12 in × 24 in</strong> concrete footings around
          4×4 posts (3.5 × 3.5 in actual):
        </p>
        <ul>
          <li>
            <strong>Sections:</strong> ⌈100 ÷ 8⌉ = <strong>13 sections</strong>
          </li>
          <li>
            <strong>Posts (Straight Run):</strong> 13 + 1 ={' '}
            <strong>14 posts</strong> (recommended <strong>9 ft</strong> post
            length)
          </li>
          <li>
            <strong>Rails:</strong> 13 × 3 = <strong>39 rails</strong>
          </li>
          <li>
            <strong>Pickets:</strong> ⌈(1,200 ÷ 5.5) × 1.05⌉ ={' '}
            <strong>230 pickets</strong>
          </li>
          <li>
            <strong>Concrete (10% waste):</strong> 1.4007 cu ft net/post × 14 ×
            1.10 = <strong>21.57 cu ft</strong> → <strong>36 × 80 lb</strong>{' '}
            bags.
          </li>
        </ul>

        <h2>Recommended Post Burial Depth by Fence Height</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Above-Ground Height</th>
                <th>Minimum Burial Depth</th>
                <th>Recommended Post Length</th>
                <th>Rails per Section</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>4 ft (1.2 m)</td>
                <td>24 in (60 cm)</td>
                <td>6 ft (1.8 m)</td>
                <td>2 rails</td>
              </tr>
              <tr>
                <td>6 ft (1.8 m)</td>
                <td>24–30 in (60–75 cm)</td>
                <td>8–9 ft (2.4–2.7 m)</td>
                <td>3 rails</td>
              </tr>
              <tr>
                <td>8 ft (2.4 m)</td>
                <td>36–48 in (90–120 cm)</td>
                <td>12 ft (3.6 m)</td>
                <td>4 rails</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout-warn">
          <strong>Call Before You Dig (811):</strong> Always request underground
          utility locates (call 811 in the US) at least 2–3 business days before
          auguring post holes, and verify property-line setbacks with your HOA
          or municipality.
        </div>

        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {fenceFaqs.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          Need crushed stone for post-hole drainage or a concrete pad? Visit our{' '}
          <Link href="/gravel-calculator/">Gravel Calculator</Link> or{' '}
          <Link href="/concrete-calculator/">Concrete Calculator</Link>.
        </p>
      </article>
    </>
  );
}
