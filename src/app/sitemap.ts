import type { MetadataRoute } from 'next';
import { client } from '@/lib/sanity/client/client';
import { getSitemapQuery } from '@/lib/sanity/queries/queries';
import { getBaseUrl } from '@/utils/getBaseUrl';

function getPriority(href: string): number {
  if (href === '/') return 1.0;
  // Core pages (about, land, directory, notices, etc)
  if (
    href === '/about' ||
    href === '/land' ||
    href === '/leadership' ||
    href === '/directory' ||
    href === '/notices' ||
    href === '/opportunities' ||
    href === '/programs' ||
    href === '/contact' ||
    href === '/media' ||
    href === '/youth' ||
    href === '/schools' ||
    href === '/health' ||
    href === '/economy' ||
    href === '/projects' ||
    href === '/blog'
  )
    return 0.8;
  // Individual content pages
  if (href.startsWith('/notices/') || href.startsWith('/opportunities/'))
    return 0.7;
  if (href.startsWith('/blog/') || href.startsWith('/directory/')) return 0.6;
  if (href.startsWith('/areas/') || href.startsWith('/programs/')) return 0.5;
  if (href.startsWith('/campaigns/')) return 0.5;
  if (href.startsWith('/records/')) return 0.5;
  if (href.startsWith('/development-notices/')) return 0.6;
  if (href.startsWith('/category/') || href.startsWith('/people/')) return 0.4;
  return 0.7;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const paths = await client.fetch(getSitemapQuery);

    if (!paths) return [];

    const baseUrl = getBaseUrl();

    return paths.map((path) => ({
      url: new URL(path.href ?? '/', baseUrl).toString(),
      lastModified: new Date(path._updatedAt),
      changeFrequency: (path.href === '/'
        ? 'daily'
        : path.href?.startsWith('/development-notices/')
          ? 'weekly'
          : path.href?.startsWith('/notices/')
            ? 'weekly'
            : 'weekly') as 'daily' | 'weekly',
      priority: getPriority(path.href ?? '/'),
    }));
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    return [];
  }
}
