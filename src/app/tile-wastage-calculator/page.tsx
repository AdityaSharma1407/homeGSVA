import Link from 'next/link';
import { AdSlot } from '@/components/common/AdSlot';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { JsonLd } from '@/components/common/JsonLd';
import { TileCalculator } from '@/components/calculators/TileCalculator';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
  buildPageMetadata,
} from '@/lib/seo';

const canonicalPath = '/tile-wastage-calculator/';

export const metadata = buildPageMetadata(
  'Tile Wastage Calculator — Boxes, Grout & Edge-Cut Checker | HomeCalc Pro',
  'Estimate floor and wall tiles, boxes needed, grout weight, and centered layout edge cuts with grout joint spacing and straight, running-bond, or diagonal waste presets.',
  canonicalPath
);

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tile Wastage Calculator' },
];

const tileFaqs = [
  {
    question: 'Why does grout gap affect tile count?',
    answer:
      'Adding a 1/8 in or 3/16 in grout joint slightly increases each tile’s effective pitch, which can save 1–2 boxes on large rooms.',
  },
  {
    question: 'What is the centered layout edge-cut check?',
    answer:
      'Professional tile setters snap a center chalk line and check whether centering on a grout joint or centering on a tile avoids narrow sliver cuts along the walls.',
  },
  {
    question: 'How accurate is the grout weight estimate?',
    answer:
      'It uses the industry standard joint-volume formula assuming 1.9 kg/L cementitious grout density and includes your waste factor for float-bucket loss.',
  },
];

const tileHowTo = {
  name: 'How to Calculate Tiles and Boxes with Wastage',
  description:
    'Estimate floor or wall tiles, boxes, and grout weight with layout waste.',
  steps: [
    'Measure room area in square inches (Length ft × Width ft × 144) minus any tub or island deductions.',
    'Calculate effective tile area: (Tile Length + Grout Gap) × (Tile Width + Grout Gap).',
    'Divide net area by effective tile area, add 10%–20% layout waste, and divide by pieces per box.',
  ],
};

export default function TileCalculatorPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, canonicalPath)} />
      <JsonLd data={buildFaqSchema(tileFaqs)} />
      <JsonLd data={buildHowToSchema(tileHowTo)} />

      <Breadcrumb items={breadcrumbs} />

      <section className="page-hero">
        <h1>Tile Wastage Calculator</h1>
        <p>
          Compute exact tile counts and boxes with grout-joint pitch, layout
          pattern waste presets, grout weight estimation, and centered edge-cut
          warnings.
        </p>
      </section>

      <TileCalculator />

      <AdSlot slotId="tile-below-fold" />

      <article className="editorial-section">
        <div className="aeo-answer-box">
          <span className="aeo-answer-label">Quick Answer</span>
          <p>
            Add <strong>10% waste</strong> for straight-grid tile layouts,{' '}
            <strong>15%</strong> for running-bond/offset patterns, and{' '}
            <strong>20%</strong> for diagonal or herringbone layouts. A 12×10 ft
            floor with 12×24 in tiles (1/8 in grout, 10% waste) requires{' '}
            <strong>65 tiles (9 boxes of 8)</strong>.
          </p>
        </div>

        <h2>Worked Example: 12 ft × 10 ft Floor with 12×24 in Tile</h2>
        <p>
          For a <strong>12 ft × 10 ft</strong> (120 sq ft = 17,280 sq in) floor
          using <strong>12 in × 24 in</strong> porcelain tiles with a{' '}
          <strong>1/8 in (0.125 in)</strong> grout joint, <strong>10%</strong>{' '}
          straight-grid waste, and <strong>8 tiles per box</strong>:
        </p>
        <ul>
          <li>
            <strong>Effective Tile Area:</strong> (12 + 0.125) × (24 + 0.125) ={' '}
            <strong>292.5156 sq in</strong>
          </li>
          <li>
            <strong>Base Tiles:</strong> 17,280 ÷ 292.5156 ={' '}
            <strong>59.07 tiles</strong>
          </li>
          <li>
            <strong>With 10% Waste:</strong> ⌈59.07 × 1.10⌉ ={' '}
            <strong>65 tiles</strong>
          </li>
          <li>
            <strong>Boxes to Buy:</strong> ⌈65 ÷ 8⌉ = <strong>9 boxes</strong>.
          </li>
        </ul>

        <h2>Tile Layout Pattern Waste Guide</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Layout Pattern</th>
                <th>Recommended Waste %</th>
                <th>Why Extra Cuts Happen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Straight Grid (Stacked)</td>
                <td>10%</td>
                <td>Square perimeter cuts &amp; occasional chipped corners</td>
              </tr>
              <tr>
                <td>Running Bond / 1/3 Offset</td>
                <td>15%</td>
                <td>Staggered half-tile offcuts along two opposite walls</td>
              </tr>
              <tr>
                <td>Diagonal (45°) or Herringbone</td>
                <td>20%</td>
                <td>Triangular perimeter cuts on all four walls</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout-warn">
          <strong>Dye Lot &amp; Caliber Warning:</strong> Always inspect box
          labels at the store to verify every box shares the same{' '}
          <strong>dye lot</strong> (shade) and <strong>caliber</strong> (exact
          fired millimeter size). Keep 2–4 spare tiles in storage for future
          plumbing repairs.
        </div>

        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {tileFaqs.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          Finishing the room walls as well? Estimate your paint with our{' '}
          <Link href="/paint-calculator/">Paint Calculator</Link>.
        </p>
      </article>
    </>
  );
}
