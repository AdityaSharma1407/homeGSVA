import Link from 'next/link';
import { AdSlot } from '@/components/common/AdSlot';
import { JsonLd } from '@/components/common/JsonLd';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata(
  'HomeCalc Pro — Home & Renovation Material Estimators Hub',
  'Free, zero-server home renovation and landscaping material estimators for Paint, Concrete, Mulch, Tile, Fencing, and Gravel with dual Imperial/Metric units and a printable Project Bag.',
  '/'
);

const tools = [
  {
    tag: 'Interior & Exterior',
    title: 'Paint Calculator',
    href: '/paint-calculator/',
    desc: 'Estimate gallons or liters with door/window deductions, ceiling & trim options, surface texture multipliers, and quart-vs-gallon container optimization.',
  },
  {
    tag: 'Slabs, Piers & Steps',
    title: 'Concrete Calculator',
    href: '/concrete-calculator/',
    desc: 'Calculate cubic yards, cubic meters, weight, and 40/60/80 lb or 20/25 kg bag counts for slabs, footings, cylindrical columns, and stairs.',
  },
  {
    tag: 'Yard & Landscaping',
    title: 'Mulch Calculator',
    href: '/mulch-calculator/',
    desc: 'Convert rectangular beds, circular tree rings, or direct areas into bulk cubic yards and 2 cu ft / 3 cu ft retail bags.',
  },
  {
    tag: 'Flooring & Backsplash',
    title: 'Tile Wastage Calculator',
    href: '/tile-wastage-calculator/',
    desc: 'Account for grout joints, straight/offset/diagonal layout waste, boxes needed, grout weight, and centered edge-cut checks.',
  },
  {
    tag: 'Perimeter & Footings',
    title: 'Fencing Calculator',
    href: '/fencing-calculator/',
    desc: 'Size posts, rails, pickets, gate deductions, and underground post-hole concrete bags in one unified bill of materials.',
  },
  {
    tag: 'Driveways & Drainage',
    title: 'Gravel Calculator',
    href: '/gravel-calculator/',
    desc: 'Estimate US tons, metric tonnes, cubic yards, and compaction buffers across #57 crushed stone, pea gravel, crusher run, and river rock.',
  },
];

const hubItemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'HomeCalc Pro Material Estimators',
  itemListElement: tools.map((t, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: t.title,
    url: `https://home.gsvalab.com${t.href}`,
  })),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={hubItemListSchema} />

      <section className="page-hero">
        <h1>Home &amp; Renovation Material Estimators</h1>
        <p>
          Precision, zero-server calculators for homeowners and contractors.
          Switch seamlessly between US Imperial and Metric units, save multiple
          rooms or yard zones to your local <strong>Project Bag</strong>, and
          print a clean hardware-store shopping checklist.
        </p>
      </section>

      <section className="hub-grid" aria-label="Available Material Estimators">
        {tools.map((tool) => (
          <article key={tool.href} className="hub-card">
            <div>
              <span className="hub-card-tag">{tool.tag}</span>
              <h2>{tool.title}</h2>
              <p>{tool.desc}</p>
            </div>
            <Link href={tool.href} className="btn btn-primary">
              Open {tool.title}
            </Link>
          </article>
        ))}
      </section>

      <AdSlot slotId="home-hub-mid" />

      <section className="editorial-section">
        <h2>How the Multi-Zone Project Bag Saves Money</h2>
        <p>
          Most online calculators force you to estimate one room or one patio at
          a time, rounding up each zone independently. If your living room needs
          1.3 gallons and your hallway needs 1.2 gallons, buying per-room totals
          4 gallons—even though the combined job only requires 2.5 gallons (3
          whole gallons).
        </p>
        <p>
          HomeCalc Pro stores your unrounded quantities in your browser&apos;s{' '}
          <code>localStorage</code> and re-aggregates matching materials across
          enabled zones. That way, you buy for the whole project without leaving
          half-used cans or extra bags in the garage.
        </p>

        <h2>Built for Field Use &amp; Print</h2>
        <ul>
          <li>
            <strong>100% Client-Side &amp; Instant:</strong> Every calculation
            runs deterministically in your browser with zero server round-trips.
          </li>
          <li>
            <strong>IEEE-754 Safe Rounding:</strong> Exact binary floating-point
            drift is prevented so boundary quantities never unexpectedly round up
            an extra bag or box.
          </li>
          <li>
            <strong>Print Shopping Checklist:</strong> Open the{' '}
            <strong>Project Bag</strong> in the top bar and click{' '}
            <em>Print Shopping Checklist</em> for an ink-friendly, ad-free sheet
            with aisle checkboxes.
          </li>
        </ul>
      </section>
    </>
  );
}
