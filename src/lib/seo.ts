import type { Metadata } from 'next';
import type { Crumb } from '@/components/common/Breadcrumb';

export const SITE_ORIGIN = 'https://home.gsvalab.com';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToData {
  name: string;
  description: string;
  steps: string[];
}

export function buildPageMetadata(
  title: string,
  description: string,
  canonicalPath: string
): Metadata {
  const normalized = canonicalPath.endsWith('/')
    ? canonicalPath
    : `${canonicalPath}/`;
  const canonicalUrl = `${SITE_ORIGIN}${normalized}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: 'HomeCalc Pro',
      title,
      description,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export function buildBreadcrumbSchema(
  crumbs: Crumb[],
  canonicalPath: string
): Record<string, unknown> {
  const normalized = canonicalPath.endsWith('/')
    ? canonicalPath
    : `${canonicalPath}/`;
  const canonicalUrl = `${SITE_ORIGIN}${normalized}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.label,
      item: crumb.href ? `${SITE_ORIGIN}${crumb.href}` : canonicalUrl,
    })),
  };
}

export function buildFaqSchema(items: FaqItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildHowToSchema(howTo: HowToData): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((text, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      text,
    })),
  };
}
