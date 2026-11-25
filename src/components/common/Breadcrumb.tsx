import React from 'react';
import Link from 'next/link';

export interface Crumb {
  label: string;
  href?: string;
}

export const Breadcrumb: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav className="breadcrumb no-print" aria-label="Breadcrumb">
    {items.map((item, idx) => (
      <React.Fragment key={item.label}>
        {idx > 0 && <span aria-hidden="true">/</span>}
        {item.href ? (
          <Link href={item.href}>{item.label}</Link>
        ) : (
          <span aria-current="page">{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);
