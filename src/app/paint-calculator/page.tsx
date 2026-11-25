import Link from 'next/link';
import { AdSlot } from '@/components/common/AdSlot';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { JsonLd } from '@/components/common/JsonLd';
import { PaintCalculator } from '@/components/calculators/PaintCalculator';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
  buildPageMetadata,
} from '@/lib/seo';

const canonicalPath = '/paint-calculator/';

export const metadata = buildPageMetadata(
  'Paint Calculator — Gallons, Liters & Container Optimizer | HomeCalc Pro',
  'Calculate exact wall, ceiling, and trim paint needed in gallons or liters with door/window deductions, surface texture multipliers, and quart-vs-gallon optimization.',
  canonicalPath
);

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Paint Calculator' },
];

const paintFaqs = [
  {
    question: 'Should I deduct doors and windows when calculating paint?',
    answer:
      'Yes, deducting standard 21 sq ft doors and 15 sq ft windows prevents overbuying by 15–25% in bedrooms and kitchens.',
  },
  {
    question: 'When do I need a separate primer coat?',
    answer:
      'Always prime bare drywall, patched joint compound, stained surfaces, or when switching from a dark color to a light shade.',
  },
  {
    question: 'How much extra paint should I keep for touch-ups?',
    answer:
      'The default 5% waste buffer covers roller nap absorption and minor touch-ups. Increase to 10% for deep accent colors.',
  },
  {
    question: 'Does ceiling paint use the same coverage rate?',
    answer:
      'Flat ceiling paint typically covers 350–400 sq ft/gal on smooth drywall, though popcorn or acoustic ceilings can absorb 20–30% more.',
  },
  {
    question: 'How do I combine multiple rooms in one paint order?',
    answer:
      'Use Add Zone to Project Bag after each room. The Project Bag sums exact unrounded gallons across rooms so you minimize extra cans.',
  },
];

const paintHowTo = {
  name: 'How to Calculate Paint Needed for a Room',
  description:
    'Step-by-step method to estimate interior or exterior paint gallons with door and window deductions.',
  steps: [
    'Measure room length, width, and wall height to compute gross wall area: 2 × (L + W) × H.',
    'Subtract 21 sq ft per standard door and 15 sq ft per standard window.',
    'Multiply net paintable area by number of coats, surface texture multiplier (1.00–1.20), and waste buffer.',
    'Divide effective area by paint coverage rate (350 sq ft/gal or 10 m²/L) and round up.',
  ],
};

export default function PaintCalculatorPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, canonicalPath)} />
      <JsonLd data={buildFaqSchema(paintFaqs)} />
      <JsonLd data={buildHowToSchema(paintHowTo)} />

      <Breadcrumb items={breadcrumbs} />

      <section className="page-hero">
        <h1>Paint Calculator</h1>
        <p>
          Estimate interior or exterior paint with automatic door and window
          deductions, surface porosity multipliers, primer sizing, and smart
          gallon-vs-quart container splitting.
        </p>
      </section>

      <PaintCalculator />

      <AdSlot slotId="paint-below-fold" />

      <article className="editorial-section">
        <div className="aeo-answer-box">
          <span className="aeo-answer-label">Quick Answer</span>
          <p>
            One gallon of interior wall paint covers approximately{' '}
            <strong>350 sq ft (32.5 m²)</strong> per coat on smooth drywall. For
            a standard 12×10 ft bedroom with 8 ft ceilings (301 sq ft net after
            deducting 1 door and 2 windows),{' '}
            <strong>2 coats require 1.81 gallons</strong> (buy{' '}
            <strong>2 × 1-gallon cans</strong>).
          </p>
        </div>

        <h2>Worked Example: 12 ft × 10 ft Bedroom</h2>
        <p>
          Suppose you are repainting a standard <strong>12 ft × 10 ft</strong>{' '}
          bedroom with <strong>8 ft</strong> ceilings, <strong>1 door</strong>{' '}
          (21 sq ft), and <strong>2 windows</strong> (15 sq ft each), applying{' '}
          <strong>2 coats</strong> over smooth drywall with a{' '}
          <strong>5%</strong> waste buffer and standard{' '}
          <strong>350 sq ft/gal</strong> paint:
        </p>
        <ul>
          <li>
            <strong>Gross Wall Area:</strong> 2 × (12 + 10) × 8 ={' '}
            <strong>352 sq ft</strong>
          </li>
          <li>
            <strong>Openings Deducted:</strong> (1 × 21) + (2 × 15) ={' '}
            <strong>51 sq ft</strong>
          </li>
          <li>
            <strong>Net Paintable Area:</strong> 352 − 51 ={' '}
            <strong>301 sq ft</strong>
          </li>
          <li>
            <strong>Effective Area (2 coats + 5% waste):</strong> 301 × 2 × 1.00
            × 1.05 = <strong>632.10 sq ft</strong>
          </li>
          <li>
            <strong>Exact Gallons:</strong> 632.10 ÷ 350 ={' '}
            <strong>1.8060 gallons</strong> → Buy{' '}
            <strong>2 × 1-gallon cans</strong>.
          </li>
        </ul>

        <h2>Mathematical Formula</h2>
        <div className="formula-box">
          Net Area = max(0, Gross Wall Area − Openings) + Ceiling + Trim
          <br />
          Effective Area = Net Area × Coats × Surface Multiplier × (1 + Waste% /
          100)
          <br />
          Gallons Exact = Effective Area ÷ Coverage Rate (sq ft/gal)
        </div>

        <h2>Paint Coverage &amp; Surface Multiplier Reference</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Surface Condition</th>
                <th>Multiplier</th>
                <th>Typical Coverage (Imperial)</th>
                <th>Typical Coverage (Metric)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Smooth Painted Drywall</td>
                <td>1.00×</td>
                <td>350–400 sq ft/gal</td>
                <td>9–10 m²/L</td>
              </tr>
              <tr>
                <td>Textured / Orange Peel / Porous</td>
                <td>1.15×</td>
                <td>300–325 sq ft/gal</td>
                <td>7.5–8.5 m²/L</td>
              </tr>
              <tr>
                <td>Unpainted Drywall / Raw Plaster</td>
                <td>1.20×</td>
                <td>250–300 sq ft/gal</td>
                <td>6.5–7.5 m²/L</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout-warn">
          <strong>Field Tip:</strong> Never buy 4 quarts when 1 gallon is
          needed—four individual quarts typically cost 30–50% more than a single
          gallon can. Our container optimizer automatically rounds up to a whole
          gallon once your remainder exceeds 0.50 gallons.
        </div>

        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {paintFaqs.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          Planning a full interior refresh? Pair this with our{' '}
          <Link href="/tile-wastage-calculator/">Tile Wastage Calculator</Link>{' '}
          for bathroom or kitchen floors.
        </p>
      </article>
    </>
  );
}
