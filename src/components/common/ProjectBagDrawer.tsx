'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  aggregateProjectMaterials,
  clearProjectBag,
  loadProjectBag,
  PROJECT_BAG_EVENT,
  removeZoneFromBag,
  toggleZoneInBag,
  type ProjectBagState,
} from '@/lib/storage/projectBag';
import { PrintSheet } from './PrintSheet';

export const ProjectBagDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bag, setBag] = useState<ProjectBagState>({
    version: 1,
    unitSystem: 'imperial',
    items: [],
  });

  useEffect(() => {
    setMounted(true);
    setBag(loadProjectBag());
    const handler = () => {
      setBag(loadProjectBag());
    };
    window.addEventListener(PROJECT_BAG_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(PROJECT_BAG_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const enabledCount = bag.items.filter((i) => i.enabled).length;
  const aggregated = aggregateProjectMaterials(bag.items);
  const totalCost = bag.items
    .filter((i) => i.enabled)
    .reduce((sum, i) => sum + i.estimatedCost, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-navy no-print"
        onClick={() => setOpen(true)}
        aria-label={`Open Project Bag (${bag.items.length} zones)`}
      >
        Project Bag ({bag.items.length})
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="bag-drawer-backdrop no-print"
            role="dialog"
            aria-modal="true"
            aria-label="Multi-Zone Project Bag"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div className="bag-drawer">
              <div className="bag-drawer-header">
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.1rem' }}>
                    Project Bag ({enabledCount}/{bag.items.length} active)
                  </h2>
                  <p
                    style={{
                      margin: '0.15rem 0 0',
                      fontSize: '0.8rem',
                      color: 'var(--color-ink-secondary)',
                    }}
                  >
                    Saved locally in your browser · Zero server upload
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="bag-drawer-body">
                {bag.items.length === 0 ? (
                  <p style={{ color: 'var(--color-ink-secondary)' }}>
                    Your Project Bag is empty. Use{' '}
                    <strong>Add Zone to Project Bag</strong> on any estimator to
                    combine rooms, slabs, or yard beds into one shopping list.
                  </p>
                ) : (
                  <>
                    {aggregated.length > 0 && (
                      <div className="bag-summary-box">
                        <strong
                          style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            color: 'var(--color-navy)',
                            marginBottom: '0.45rem',
                          }}
                        >
                          Combined Shopping Totals
                        </strong>
                        {aggregated.map((line) => (
                          <div
                            key={line.estimator}
                            style={{
                              fontSize: '0.88rem',
                              marginBottom: '0.4rem',
                            }}
                          >
                            <strong>{line.title}:</strong>{' '}
                            <span className="mono-num">
                              {line.combinedSummary}
                            </span>
                            {line.individualSumNote && (
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: '0.78rem',
                                  color: 'var(--color-success)',
                                  fontWeight: 600,
                                }}
                              >
                                {line.individualSumNote}
                              </span>
                            )}
                          </div>
                        ))}
                        {totalCost > 0 && (
                          <div
                            style={{
                              marginTop: '0.5rem',
                              paddingTop: '0.45rem',
                              borderTop: '1px solid var(--color-border-strong)',
                              fontWeight: 700,
                            }}
                          >
                            Est. Total Cost:{' '}
                            <span className="mono-num">
                              ${totalCost.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {bag.items.map((item) => (
                      <div key={item.id} className="bag-zone-item">
                        <div className="bag-zone-head">
                          <label className="checkbox-row">
                            <input
                              type="checkbox"
                              checked={item.enabled}
                              onChange={() => setBag(toggleZoneInBag(item.id))}
                            />
                            <strong>{item.zoneName}</strong>
                          </label>
                          <button
                            type="button"
                            className="preset-chip"
                            onClick={() => setBag(removeZoneFromBag(item.id))}
                            aria-label={`Remove ${item.zoneName}`}
                          >
                            Remove
                          </button>
                        </div>
                        <div
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--color-ink-secondary)',
                          }}
                        >
                          <span style={{ textTransform: 'capitalize' }}>
                            {item.estimator}
                          </span>{' '}
                          · {item.dimensionsSummary}
                        </div>
                        <div
                          className="mono-num"
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            marginTop: '0.25rem',
                          }}
                        >
                          {item.primaryQuantityLabel}
                          {item.estimatedCost > 0
                            ? ` · $${item.estimatedCost.toFixed(2)}`
                            : ''}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="bag-drawer-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePrint}
                  disabled={enabledCount === 0}
                >
                  Print Shopping Checklist
                </button>
                {bag.items.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setBag(clearProjectBag())}
                  >
                    Clear All Zones
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {mounted
        ? createPortal(<PrintSheet items={bag.items} />, document.body)
        : <PrintSheet items={bag.items} />}
    </>
  );
};
