import { getBaseURL, getDocumentLink } from '@/lib/links';
import type { PostFragmentType } from '../queries/fragments/fragment.types';
import { urlForImage } from './utils';

export function generateArticleJsonLd(post: PostFragmentType) {
  const url = getDocumentLink(post, true);
  const image = post.image
    ? urlForImage(post.image)?.width(1200).height(630).url()
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    ...(image && { image: [image] }),
    ...(post.date && { datePublished: post.date }),
    ...(post.author && {
      author: {
        '@type': 'Person',
        name: `${post.author.firstName} ${post.author.lastName}`,
        ...(post.author.slug && {
          url: getDocumentLink(
            { _type: 'person', slug: post.author.slug },
            true
          ),
        }),
      },
    }),
    url,
  };
}

export function generateWebSiteJsonLd(title: string, description?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    url: getBaseURL(),
    ...(description && { description }),
  };
}

export function generatePersonJsonLd(person: {
  firstName: string;
  lastName: string;
  role?: string;
  organization?: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: `${person.firstName} ${person.lastName}`,
    ...(person.role && { jobTitle: person.role }),
    ...(person.organization && {
      worksFor: { '@type': 'Organization', name: person.organization },
    }),
    url: getDocumentLink({ _type: 'person', slug: person.slug }, true),
  };
}

export function generateLocalBusinessJsonLd(listing: {
  name: string;
  slug: string;
  listingType: string;
  description?: string;
  location?: string;
  contactInfo?: string;
  operatingHours?: string;
}) {
  const typeMap: Record<string, string> = {
    school: 'School',
    clinic: 'MedicalClinic',
    business: 'LocalBusiness',
    church: 'Church',
    facility: 'CivicStructure',
    accommodation: 'LodgingBusiness',
  };

  return {
    '@context': 'https://schema.org',
    '@type': typeMap[listing.listingType] || 'Place',
    name: listing.name,
    ...(listing.description && { description: listing.description }),
    ...(listing.location && {
      address: { '@type': 'PostalAddress', addressLocality: listing.location },
    }),
    ...(listing.contactInfo && { telephone: listing.contactInfo }),
    ...(listing.operatingHours && {
      openingHours: listing.operatingHours,
    }),
    url: getDocumentLink({ _type: 'listing', slug: listing.slug }, true),
  };
}

export function generateEventJsonLd(program: {
  title: string;
  slug: string;
  description?: string;
  date?: string;
  status?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: program.title,
    ...(program.description && { description: program.description }),
    ...(program.date && { startDate: program.date }),
    ...(program.status && {
      eventStatus:
        program.status === 'upcoming'
          ? 'https://schema.org/EventScheduled'
          : program.status === 'completed'
            ? 'https://schema.org/EventPostponed'
            : undefined,
    }),
    url: getDocumentLink({ _type: 'program', slug: program.slug }, true),
  };
}
