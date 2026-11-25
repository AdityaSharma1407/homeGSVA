import Link from 'next/link';
import { AdSlot } from '@/components/common/AdSlot';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { JsonLd } from '@/components/common/JsonLd';
import { MulchCalculator } from '@/components/calculators/MulchCalculator';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
  buildPageMetadata,
} from '@/lib/seo';

const canonicalPath = '/mulch-calculator/';

export const metadata = buildPageMetadata(
  'Mulch Calculator — Cubic Yards, Meters & Bag Counts | HomeCalc Pro',
  'Calculate bulk cubic yards, cubic meters, and 2 cu ft / 3 cu ft retail mulch bags for rectangular beds, circular tree rings, and irregular garden areas.',
  canonicalPath
);

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Mulch Calculator' },
];

const mulchFaqs = [
  {
    question: 'How many 2 cu ft bags of mulch equal 1 cubic yard?',
    answer:
      '1 cubic yard equals 27 cubic feet, which is 13.5 bags (rounded up to 14 bags) of 2 cu ft mulch, or exactly 9 bags of 3 cu ft mulch.',
  },
  {
    question: 'Is bulk mulch delivery cheaper than bagged mulch?',
    answer:
      'Typically, once you need 3 or more cubic yards (40+ bags), bulk delivery is noticeably cheaper even after a delivery fee.',
  },
  {
    question: 'Should I add a settling buffer to my mulch estimate?',
    answer:
      'Freshly shredded bark settles by 10–15% over the first few weeks of rain; adding a 5% buffer helps maintain your target depth.',
  },
];

const mulchHowTo = {
  name: 'How to Calculate Cubic Yards and Bags of Mulch',
  description:
    'Convert garden bed area and depth into cubic yards and 2 cu ft / 3 cu ft retail bags.',
  steps: [
    'Calculate bed area in square feet (length × width, or π × radius² for circular tree rings).',
    'Multiply area by depth in inches divided by 12 to get cubic feet.',
    'Divide cubic feet by 27 for bulk cubic yards, or by 2 for 2 cu ft bags.',
  ],
};

export default function MulchCalculatorPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, canonicalPath)} />
      <JsonLd data={buildFaqSchema(mulchFaqs)} />
      <JsonLd data={buildHowToSchema(mulchHowTo)} />

      <Breadcrumb items={breadcrumbs} />

      <section className="page-hero">
        <h1>Mulch Calculator</h1>
        <p>
          Convert garden bed dimensions and desired depth into bulk cubic yards,
          cubic meters, and 2 cu ft or 3 cu ft bagged mulch quantities.
        </p>
      </section>

      <MulchCalculator />

      <AdSlot slotId="mulch-below-fold" />

      <article className="editorial-section">
        <div className="aeo-answer-box">
          <span className="aeo-answer-label">Quick Answer</span>
          <p>
            One cubic yard of mulch covers{' '}
            <strong>162 sq ft at 2 inches deep</strong> or{' '}
            <strong>108 sq ft at 3 inches deep</strong>, and equals{' '}
            <strong>14 bags (2 cu ft)</strong> or{' '}
            <strong>9 bags (3 cu ft)</strong>.
          </p>
        </div>

        <h2>Worked Example: 18 ft × 9 ft Garden Bed at 2 in Depth</h2>
        <p>
          Suppose you are top-dressing an <strong>18 ft × 9 ft</strong>{' '}
          perennial bed with <strong>2 inches</strong> of fine shredded hardwood
          mulch:
        </p>
        <ul>
          <li>
            <strong>Bed Area:</strong> 18 × 9 = <strong>162 sq ft</strong>
          </li>
          <li>
            <strong>Volume in Cubic Feet:</strong> 162 × (2 ÷ 12) ={' '}
            <strong>27.00 cu ft</strong>
          </li>
          <li>
            <strong>Bulk Cubic Yards:</strong> 27 ÷ 27 ={' '}
            <strong>1.00 cu yd</strong>
          </li>
          <li>
            <strong>Bagged Equivalents:</strong> <strong>14 × 2 cu ft</strong>{' '}
            bags or <strong>9 × 3 cu ft</strong> bags.
          </li>
        </ul>

        <h2>Mulch Coverage &amp; Bag Conversion Reference</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mulch Depth</th>
                <th>1 Cubic Yard Covers</th>
                <th>One 2 cu ft Bag Covers</th>
                <th>Recommended Application</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 inch (2.5 cm)</td>
                <td>324 sq ft</td>
                <td>24 sq ft</td>
                <td>Annual color refresh over existing mulch</td>
              </tr>
              <tr>
                <td>2 inches (5 cm)</td>
                <td>162 sq ft</td>
                <td>12 sq ft</td>
                <td>Fine hardwood / shredded bark</td>
              </tr>
              <tr>
                <td>3 inches (7.5 cm)</td>
                <td>108 sq ft</td>
                <td>8 sq ft</td>
                <td>Coarse bark, pine nuggets, weed suppression</td>
              </tr>
              <tr>
                <td>4 inches (10 cm)</td>
                <td>81 sq ft</td>
                <td>6 sq ft</td>
                <td>Playgrounds / heavy weed barrier</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout-warn">
          <strong>Horticulture Warning:</strong> Avoid &ldquo;mulch
          volcanoes&rdquo; piled against tree trunks, and be cautious with dyed
          black mulch near tender annuals in full sun—dark mulch absorbs extra
          heat and can scorch shallow roots.
        </div>

        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {mulchFaqs.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          Installing stone borders or drainage beds alongside your mulch? Check
          our <Link href="/gravel-calculator/">Gravel Calculator</Link>.
        </p>
      </article>
    </>
  );
}
