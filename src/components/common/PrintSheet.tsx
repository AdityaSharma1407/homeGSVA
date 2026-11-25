'use client';

import React, { useEffect, useState } from 'react';
import {
  aggregateProjectMaterials,
  type ProjectZoneItem,
} from '@/lib/storage/projectBag';

interface PrintSheetProps {
  items: ProjectZoneItem[];
}

export const PrintSheet: React.FC<PrintSheetProps> = ({ items }) => {
  const [dateLabel, setDateLabel] = useState<string>('');

  useEffect(() => {
    setDateLabel(new Date().toLocaleDateString());
  }, []);

  const active = items.filter((i) => i.enabled);
  const aggregated = aggregateProjectMaterials(active);
  const totalCost = active.reduce((sum, i) => sum + i.estimatedCost, 0);

  return (
    <section className="print-only-sheet" aria-label="Printable Shopping Checklist">
      <div className="print-header">
        <h1 style={{ margin: 0, fontSize: '18pt' }}>
          HomeCalc Pro — Hardware Store Shopping Checklist
        </h1>
        <p style={{ margin: '4pt 0 0', fontSize: '10pt', color: '#444' }}>
          Generated from https://home.gsvalab.com
          {dateLabel ? ` · ${dateLabel}` : ''}
        </p>
      </div>

      {active.length === 0 ? (
        <p>No active zones in your Project Bag.</p>
      ) : (
        <>
          <h2 style={{ fontSize: '13pt', marginBottom: '6pt' }}>
            1. Combined Material Totals (Minimized Rounding Waste)
          </h2>
          <table className="print-table">
            <thead>
              <tr>
                <th>Got It</th>
                <th>Material Group</th>
                <th>Zones</th>
                <th>Combined Quantity to Buy</th>
              </tr>
            </thead>
            <tbody>
              {aggregated.map((line) => (
                <tr key={line.estimator}>
                  <td>
                    <span className="print-checkbox" />
                  </td>
                  <td>{line.title}</td>
                  <td>{line.zoneCount}</td>
                  <td>
                    <strong>{line.combinedSummary}</strong>
                    {line.individualSumNote ? ` (${line.individualSumNote})` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ fontSize: '13pt', marginBottom: '6pt' }}>
            2. Zone-by-Zone Breakdown
          </h2>
          <table className="print-table">
            <thead>
              <tr>
                <th>Check</th>
                <th>Zone Label</th>
                <th>Estimator</th>
                <th>Dimensions</th>
                <th>Zone Estimate</th>
                <th>Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              {active.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="print-checkbox" />
                  </td>
                  <td>{item.zoneName}</td>
                  <td style={{ textTransform: 'capitalize' }}>{item.estimator}</td>
                  <td>{item.dimensionsSummary}</td>
                  <td>{item.primaryQuantityLabel}</td>
                  <td>
                    {item.estimatedCost > 0
                      ? `$${item.estimatedCost.toFixed(2)}`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalCost > 0 && (
            <p style={{ fontSize: '12pt', fontWeight: 700, textAlign: 'right' }}>
              Estimated Total Material Cost: ${totalCost.toFixed(2)}
            </p>
          )}
        </>
      )}
    </section>
  );
};
