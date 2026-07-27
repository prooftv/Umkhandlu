'use server';

import { client } from '@/lib/sanity/client/client';

export type SearchResult = {
  _id: string;
  _type: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  listingType: string | null;
  noticeType: string | null;
  recordType: string | null;
  opportunityType: string | null;
  status: string | null;
};

export async function searchAction(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const results = await client.fetch<SearchResult[]>(
    `*[
      !(_id in path("drafts.**")) &&
      _type in [
        "page", "post", "person", "listing", "notice",
        "opportunity", "program", "record", "campaign",
        "developmentNotice", "sponsor", "category"
      ] &&
      (
        title match $q ||
        name match $q ||
        firstName match $q ||
        lastName match $q ||
        excerpt match $q ||
        description match $q ||
        summary match $q ||
        impactSummary match $q ||
        organization match $q ||
        role match $q ||
        location match $q ||
        source match $q ||
        applicant match $q ||
        legalMandate match $q
      )
    ] | order(_type asc, _updatedAt desc) [0...30] {
      _id,
      _type,
      "title": coalesce(title, name, firstName + " " + lastName),
      "slug": slug.current,
      "excerpt": coalesce(excerpt, description, summary, applicant),
      "listingType": listingType,
      "noticeType": noticeType,
      "recordType": recordType,
      "opportunityType": opportunityType,
      "status": status
    }`,
    { q: `${q}*` }
  );

  return results;
}
