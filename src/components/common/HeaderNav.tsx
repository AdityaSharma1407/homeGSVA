'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Paint', href: '/paint-calculator/' },
  { label: 'Concrete', href: '/concrete-calculator/' },
  { label: 'Mulch', href: '/mulch-calculator/' },
  { label: 'Tile', href: '/tile-wastage-calculator/' },
  { label: 'Fencing', href: '/fencing-calculator/' },
  { label: 'Gravel', href: '/gravel-calculator/' },
];

export const HeaderNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="nav-links" aria-label="Material Estimators">
      {NAV_ITEMS.map((item) => {
        const isCurrent =
          pathname === item.href || `${pathname}/` === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="nav-link"
            aria-current={isCurrent ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
