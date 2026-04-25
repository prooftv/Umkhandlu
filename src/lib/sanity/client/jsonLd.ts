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
