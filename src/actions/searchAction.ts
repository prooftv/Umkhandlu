'use server';

import { client } from '@/lib/sanity/client/client';

export type SearchResult = {
  _id: string;
  _type: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  listingType: string | null;
};

export async function searchAction(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const results = await client.fetch<SearchResult[]>(
    `*[
      !(_id in path("drafts.**")) &&
      _type in ["page", "post", "person", "listing", "notice", "opportunity", "program"] &&
      (
        title match $q ||
        name match $q ||
        firstName match $q ||
        lastName match $q ||
        excerpt match $q ||
        description match $q
      )
    ] | order(_type asc) [0...20] {
      _id,
      _type,
      "title": coalesce(title, name, firstName + " " + lastName),
      "slug": slug.current,
      "excerpt": coalesce(excerpt, description),
      "listingType": listingType
    }`,
    { q: `${q}*` }
  );

  return results;
}
