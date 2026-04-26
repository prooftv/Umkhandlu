import { getBaseUrl } from '@/utils/getBaseUrl';
import type { LinkFragmentType } from './sanity/queries/fragments/fragment.types';

export const getBaseURL = getBaseUrl;

/**
 * Generic function to generate a link to a document based on its type and slug
 */
export const getDocumentLink = (
  { _type, slug }: { _type: string; slug: string | null },
  absolute: boolean = false
) => {
  const linkBase = absolute ? getBaseURL() : '';

  switch (_type) {
    case 'page':
      return `${linkBase}/${slug}`;
    case 'post':
      return `${linkBase}/blog/${slug}`;
    case 'category':
      return `${linkBase}/category/${slug}`;
    case 'person':
      return `${linkBase}/people/${slug}`;
    case 'listing':
      return `${linkBase}/directory/${slug}`;
    case 'notice':
      return `${linkBase}/notices/${slug}`;
    case 'opportunity':
      return `${linkBase}/opportunities/${slug}`;
    case 'homePage':
      return `${linkBase}/`;
    default:
      return `${linkBase}/`;
  }
};

export const getLinkByLinkObject = (
  link: Pick<LinkFragmentType, 'type' | 'external' | 'internal'>
) => {
  const { type, external, internal } = link;

  if (type === 'external') {
    return external || '';
  }

  if (type === 'internal' && internal) {
    return getDocumentLink(internal, false);
  }
};
