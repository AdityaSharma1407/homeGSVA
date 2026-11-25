import Link from 'next/link';
import { AdSlot } from '@/components/common/AdSlot';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { JsonLd } from '@/components/common/JsonLd';
import { GravelCalculator } from '@/components/calculators/GravelCalculator';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
  buildPageMetadata,
} from '@/lib/seo';

const canonicalPath = '/gravel-calculator/';

export const metadata = buildPageMetadata(
  'Gravel Calculator — Tons, Cubic Yards & Compaction Buffer | HomeCalc Pro',
  'Estimate gravel and crushed stone weight in US tons or metric tonnes, cubic yards, and compaction buffers for driveways, walkways, and French drains.',
  canonicalPath
);

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Gravel Calculator' },
];

const gravelFaqs = [
  {
    question: 'Should I order gravel by the ton or by the cubic yard?',
    answer:
      'Quarries and landscape yards almost always weigh dump-truck loads on a scale and bill by the US ton (2,000 lb) or metric tonne. HomeCalc Pro calculates both.',
  },
  {
    question: 'Why add a 10% compaction buffer to gravel?',
    answer:
      'Angular crushed stone and crusher run settle and lock together by 10–15% when tamped with a plate compactor.',
  },
  {
    question: 'How deep should a gravel driveway be?',
    answer:
      'A new driveway typically needs 4 inches of compacted crusher run base topped with 2–3 inches of #57 crushed stone.',
  },
];

const gravelHowTo = {
  name: 'How to Calculate Gravel Tons and Cubic Yards',
  description:
    'Convert driveway or walkway dimensions and depth into cubic yards and US tons.',
  steps: [
    'Multiply area (sq ft) by depth (inches ÷ 12) to get net cubic feet.',
    'Add 10% compaction buffer and divide by 27 to get cubic yards.',
    'Multiply cubic yards by stone density (2,700 lb/yd³ for #57 stone) and divide by 2,000 for US tons.',
  ],
};

export default function GravelCalculatorPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, canonicalPath)} />
      <JsonLd data={buildFaqSchema(gravelFaqs)} />
      <JsonLd data={buildHowToSchema(gravelHowTo)} />

      <Breadcrumb items={breadcrumbs} />

      <section className="page-hero">
        <h1>Gravel Calculator</h1>
        <p>
          Calculate exact stone tonnage, cubic yards, and compaction buffers
          across #57 crushed stone, pea gravel, crusher run, and river rock.
        </p>
      </section>

      <GravelCalculator />

      <AdSlot slotId="gravel-below-fold" />

      <article className="editorial-section">
        <div className="aeo-answer-box">
          <span className="aeo-answer-label">Quick Answer</span>
          <p>
            One cubic yard of <strong>#57 crushed stone</strong> weighs{' '}
            <strong>2,700 lb (1.35 US tons)</strong> and covers{' '}
            <strong>108 sq ft at 3 inches deep</strong>. A 20×10 ft driveway pad
            at 3 in deep with a 10% compaction buffer requires{' '}
            <strong>2.04 cubic yards (2.75 US tons)</strong>.
          </p>
        </div>

        <h2>Worked Example: 20 ft × 10 ft Driveway Pad (3 in Depth)</h2>
        <p>
          Suppose you are surfacing a <strong>20 ft × 10 ft</strong> parking pad
          with <strong>3 inches</strong> of <strong>#57 Crushed Stone</strong>{' '}
          (2,700 lb/cu yd) and a <strong>10%</strong> compaction buffer:
        </p>
        <ul>
          <li>
            <strong>Net Volume:</strong> 20 × 10 × (3 ÷ 12) ={' '}
            <strong>50.00 cu ft</strong> (1.8519 cu yd, 2.50 US tons net)
          </li>
          <li>
            <strong>Order Volume (+10%):</strong> 50 × 1.10 ={' '}
            <strong>55.00 cu ft</strong> (<strong>2.0370 cu yd</strong>)
          </li>
          <li>
            <strong>Order Weight:</strong> 2.0370 × 2,700 ÷ 2,000 ={' '}
            <strong>2.75 US tons</strong> (or <strong>110 × 0.5 cu ft</strong>{' '}
            retail bags).
          </li>
        </ul>

        <h2>Aggregate Material Density Comparison</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Aggregate Type</th>
                <th>lb / cu yd</th>
                <th>US Tons / cu yd</th>
                <th>Typical Project</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#57 Crushed Stone (3/4 in)</td>
                <td>2,700 lb</td>
                <td>1.35 tons</td>
                <td>Driveways, French drains, slab base</td>
              </tr>
              <tr>
                <td>All-Purpose Gravel</td>
                <td>2,835 lb</td>
                <td>1.42 tons</td>
                <td>General fill &amp; utility beds</td>
              </tr>
              <tr>
                <td>Pea Gravel (3/8 in)</td>
                <td>2,592 lb</td>
                <td>1.30 tons</td>
                <td>Walkways, patios, play areas</td>
              </tr>
              <tr>
                <td>Crusher Run / Road Base</td>
                <td>2,970 lb</td>
                <td>1.49 tons</td>
                <td>Compacted paver &amp; driveway sub-base</td>
              </tr>
              <tr>
                <td>River Rock</td>
                <td>2,403 lb</td>
                <td>1.20 tons</td>
                <td>Dry creek beds &amp; decorative borders</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout-warn">
          <strong>Subgrade Tip:</strong> Always lay non-woven geotextile
          landscape fabric under driveway or walkway gravel so heavy stone does
          not sink into soft clay or mud after rain.
        </div>

        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {gravelFaqs.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          Topping adjacent garden beds with organic bark? Try our{' '}
          <Link href="/mulch-calculator/">Mulch Calculator</Link>.
        </p>
      </article>
    </>
  );
}
