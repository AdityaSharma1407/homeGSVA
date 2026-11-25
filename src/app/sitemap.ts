import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const ROUTES = [
  '/',
  '/paint-calculator/',
  '/concrete-calculator/',
  '/mulch-calculator/',
  '/tile-wastage-calculator/',
  '/fencing-calculator/',
  '/gravel-calculator/',
  '/about/',
  '/methodology/',
  '/privacy-policy/',
  '/terms/',
  '/contact/',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `https://home.gsvalab.com${route}`,
    lastModified: new Date('2026-11-25'),
    changeFrequency: route === '/' || route.includes('calculator') ? 'weekly' : 'monthly',
    priority: route === '/' ? 1.0 : route.includes('calculator') ? 0.9 : 0.6,
  }));
}
