import Link from 'next/link';
import { AdSlot } from '@/components/common/AdSlot';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { JsonLd } from '@/components/common/JsonLd';
import { ConcreteCalculator } from '@/components/calculators/ConcreteCalculator';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHowToSchema,
  buildPageMetadata,
} from '@/lib/seo';

const canonicalPath = '/concrete-calculator/';

export const metadata = buildPageMetadata(
  'Concrete Calculator — Cubic Yards, Weight & Bag Counts | HomeCalc Pro',
  'Estimate concrete volume in cubic yards or cubic meters, total weight, and 40/60/80 lb or 20/25 kg bag counts for slabs, footings, columns, and steps.',
  canonicalPath
);

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Concrete Calculator' },
];

const concreteFaqs = [
  {
    question: 'Why add a 10% concrete waste buffer?',
    answer:
      'Gravel sub-bases are rarely perfectly level, and concrete sticks to wheelbarrows and chutes. Running 2 bags short mid-pour creates a cold joint.',
  },
  {
    question: 'When should I order a ready-mix truck instead of bags?',
    answer:
      'Anything over 1.5 cubic yards (68+ 80 lb bags) is usually cheaper and far less labor-intensive via short-load ready-mix delivery.',
  },
  {
    question: 'How thick should a patio slab be?',
    answer:
      '4 inches is standard for foot-traffic patios and walkways; 5–6 inches with rebar or wire mesh is recommended for driveways.',
  },
  {
    question: 'How do I estimate concrete for fence posts?',
    answer:
      'Use the HomeCalc Pro Fencing Calculator, which subtracts the buried wood post volume from the cylindrical hole automatically.',
  },
];

const concreteHowTo = {
  name: 'How to Calculate Concrete Yards and Bags for a Slab',
  description:
    'Calculate concrete volume in cubic yards and pre-mixed 40/60/80 lb bag counts.',
  steps: [
    'Multiply slab length (ft) × width (ft) × thickness (in ÷ 12) to get net cubic feet.',
    'Add 10% waste buffer for uneven subgrade and spillage.',
    'Divide total cubic feet by 27 for cubic yards, or by 0.60 for 80 lb bags (0.45 for 60 lb, 0.30 for 40 lb).',
  ],
};

export default function ConcreteCalculatorPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, canonicalPath)} />
      <JsonLd data={buildFaqSchema(concreteFaqs)} />
      <JsonLd data={buildHowToSchema(concreteHowTo)} />

      <Breadcrumb items={breadcrumbs} />

      <section className="page-hero">
        <h1>Concrete Calculator</h1>
        <p>
          Calculate exact concrete volume, weight, and pre-mixed bag counts for
          patio slabs, footings, cylindrical post piers, and solid concrete
          steps.
        </p>
      </section>

      <ConcreteCalculator />

      <AdSlot slotId="concrete-below-fold" />

      <article className="editorial-section">
        <div className="aeo-answer-box">
          <span className="aeo-answer-label">Quick Answer</span>
          <p>
            One cubic yard of concrete equals <strong>27 cubic feet</strong>, or{' '}
            <strong>45 bags of 80 lb</strong>, <strong>60 bags of 60 lb</strong>
            , or <strong>90 bags of 40 lb</strong> pre-mixed concrete. A
            standard <strong>10×10 ft slab at 4 in thick</strong> with 10%
            waste requires <strong>1.36 cubic yards</strong> (
            <strong>62 × 80 lb bags</strong>).
          </p>
        </div>

        <h2>Worked Example: 10 ft × 10 ft Patio Slab (4 in Thick)</h2>
        <p>
          For a <strong>10 ft × 10 ft</strong> patio poured{' '}
          <strong>4 inches</strong> thick with a standard <strong>10%</strong>{' '}
          spillage and uneven-subgrade buffer:
        </p>
        <ul>
          <li>
            <strong>Net Volume:</strong> 10 × 10 × (4 ÷ 12) ={' '}
            <strong>33.3333 cu ft</strong>
          </li>
          <li>
            <strong>Order Volume (+10%):</strong> 33.3333 × 1.10 ={' '}
            <strong>36.6667 cu ft</strong> (<strong>1.3580 cu yd</strong>)
          </li>
          <li>
            <strong>Estimated Weight (150 lb/cu ft):</strong>{' '}
            <strong>5,500 lb</strong>
          </li>
          <li>
            <strong>Bag Equivalents:</strong> <strong>62 × 80 lb</strong> bags,{' '}
            <strong>82 × 60 lb</strong> bags, or <strong>123 × 40 lb</strong>{' '}
            bags.
          </li>
        </ul>

        <h2>Mathematical Formulas</h2>
        <div className="formula-box">
          Slab / Footing: Net ft³ = Length(ft) × Width(ft) × (Thickness(in) ÷
          12)
          <br />
          Column / Pier: Net ft³ = π × (Diameter(ft) ÷ 2)² × Height(ft) ×
          Quantity
          <br />
          Steps: Net ft³ = Width × Tread × Riser × [N(N+1)/2] + (Platform ×
          Width × N × Riser)
          <br />
          Order yd³ = [Net ft³ × (1 + Waste% / 100)] ÷ 27
        </div>

        <h2>Standard Concrete Bag Yield Table (Quikrete No. 1101)</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bag Size</th>
                <th>Yield per Bag</th>
                <th>Bags per Cubic Yard</th>
                <th>Best Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>40 lb (18.1 kg)</td>
                <td>0.30 cu ft (8.5 L)</td>
                <td>90 bags</td>
                <td>Small post repairs &amp; tight carries</td>
              </tr>
              <tr>
                <td>60 lb (27.2 kg)</td>
                <td>0.45 cu ft (12.7 L)</td>
                <td>60 bags</td>
                <td>Fence posts &amp; small footings</td>
              </tr>
              <tr>
                <td>80 lb (36.3 kg)</td>
                <td>0.60 cu ft (17.0 L)</td>
                <td>45 bags</td>
                <td>Slabs, walkways &amp; heavy piers</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout-warn">
          <strong>Set vs. Cure Warning:</strong> Concrete sets hard enough to
          walk on in 24–48 hours, reaches ~70% strength at 7 days, and achieves
          full design compressive strength at <strong>28 days</strong>. Keep
          slabs moist for the first 7 days to prevent surface crazing.
        </div>

        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {concreteFaqs.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          Setting fence posts? Try our{' '}
          <Link href="/fencing-calculator/">Fencing Calculator</Link>, which
          subtracts buried post volume automatically.
        </p>
      </article>
    </>
  );
}
