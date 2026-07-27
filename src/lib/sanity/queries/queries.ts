import { defineQuery } from 'next-sanity';
import {
  campaignFragment,
  categoryFragment,
  linkFragment,
  listingFragment,
  menuFragment,
  noticeFragment,
  opportunityFragment,
  pageFragment,
  personFragment,
  postCardFragment,
  postFragment,
  programFragment,
  recordFragment,
  seoFragment,
} from './fragments/fragments';

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  title,
  description,
  primaryColor,
  secondaryColor,
  contactEmail,
  contactPhone,
  address,
  socialLinks,
  gtmId,
  webhookUrl,
  ${menuFragment}
}`);

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  _id,
  _type,
  ...,
  ${pageFragment}
}`);

export const blogPageQuery = defineQuery(`*[_type == "blogPage"][0]{
  _id,
  _type,
  ...,
  ${pageFragment}
}`);

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    "slug": slug.current,
    ${pageFragment}
  }
`);

export const getSitemapQuery = defineQuery(`
  *[((_type in ["page", "post", "category", "person", "notice", "opportunity", "listing", "program", "campaign", "record", "developmentNotice"] && defined(slug.current) && !(_id in path("drafts.**"))) || (_type in ["homePage", "blogPage"])) && seo.noIndex != true]{
    "href": select(
      _type == "page" => "/" + slug.current,
      _type == "post" => "/blog/" + slug.current,
      _type == "category" => "/category/" + slug.current,
      _type == "person" => "/people/" + slug.current,
      _type == "listing" && listingType == "area" => "/areas/" + slug.current,
      _type == "listing" && listingType != "area" => "/directory/" + slug.current,
      _type == "notice" => "/notices/" + slug.current,
      _type == "opportunity" => "/opportunities/" + slug.current,
      _type == "program" => "/programs/" + slug.current,
      _type == "campaign" => "/campaigns/" + slug.current,
      _type == "record" => "/records/" + slug.current,
      _type == "developmentNotice" => "/development-notices/" + slug.current,
      _type == "blogPage" => "/blog",
      _type == "homePage" => "/",
      slug.current
    ),
    _updatedAt
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    ${postFragment}
  }
`);

export const categoryQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug] [0] {
    ${categoryFragment}
  }
`);

export const personQuery = defineQuery(`
  *[_type == "person" && slug.current == $slug] [0] {
    ${personFragment}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)][0..$limit].slug.current
`);

export const categorySlugs = defineQuery(`
  *[_type == "category" && defined(slug.current)][0..$limit].slug.current
`);

export const personSlugs = defineQuery(`
  *[_type == "person" && defined(slug.current)][0..$limit].slug.current
`);

export const areaDetailQuery = defineQuery(`
  *[_type == "listing" && listingType == "area" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    description,
    location,
    geopoint,
    image,
    "induna": induna->{${personFragment}},
    "relatedListings": relatedListings[]->{${listingFragment}},
    "notices": *[_type == "notice" && references(^._id)] | order(pinned desc, date desc) [0...5] {
      ${noticeFragment}
    },
    "programs": *[_type == "program" && references(^._id)] | order(date desc) [0...5] {
      ${programFragment}
    },
    "opportunities": *[_type == "opportunity" && references(^._id) && (deadline > now() || !defined(deadline))] | order(featured desc, deadline asc) [0...5] {
      ${opportunityFragment}
    },
    "records": *[_type == "record" && references(^._id)] | order(date desc) [0...5] {
      ${recordFragment}
    },
    "campaigns": *[_type == "campaign" && references(^._id) && status in ["active", "completed"]] | order(startDate desc) [0...5] {
      ${campaignFragment}
    },
    "developmentNotices": *[_type == "developmentNotice" && references(^._id) && status in ["open", "closed"]] | order(commentDeadline asc) [0...5] {
      _id,
      title,
      "slug": slug.current,
      noticeType,
      status,
      applicant,
      commentDeadline,
      publishDate,
      location
    }
  }
`);

export const areaSlugs = defineQuery(`
  *[_type == "listing" && listingType == "area" && defined(slug.current)][0..$limit].slug.current
`);

export const areaListPageQuery = defineQuery(`
  *[_type == "listing" && listingType == "area" && defined(slug.current)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    location,
    image,
    "induna": induna->{ firstName, lastName }
  }
`);

export const listingDetailQuery = defineQuery(`
  *[_type == "listing" && listingType != "area" && slug.current == $slug][0]{
    ${listingFragment}
    content[]{ ..., markDefs[]{ ..., ...customLink{ ${linkFragment} } } },
    images[] {
      _key,
      alt,
      caption,
      asset->{ _id, url }
    }
  }
`);

export const listingSlugs = defineQuery(`
  *[_type == "listing" && listingType != "area" && defined(slug.current)][0..$limit].slug.current
`);

export const programDetailQuery = defineQuery(`
  *[_type == "program" && slug.current == $slug][0]{
    ${programFragment}
    content[]{ ..., markDefs[]{ ..., ...customLink{ ${linkFragment} } } },
    "relatedArea": relatedArea->{ name, "slug": slug.current }
  }
`);

export const programSlugs = defineQuery(`
  *[_type == "program" && defined(slug.current)][0..$limit].slug.current
`);

export const noticeDetailQuery = defineQuery(`
  *[_type == "notice" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    noticeType,
    date,
    excerpt,
    image,
    content[]{ ..., markDefs[]{ ..., ...customLink{ ${linkFragment} } } },
    pinned,
    "relatedArea": relatedArea->{ name, "slug": slug.current },
    "relatedCampaign": relatedCampaign->{ title, "slug": slug.current, campaignType, status },
    "originNotice": originNotice->{ title, "slug": slug.current, noticeType, date },
    "followUpNotices": *[_type == "notice" && originNotice._ref == ^._id] | order(date asc) {
      _id, title, "slug": slug.current, noticeType, date
    },
    "producedRecords": *[_type == "record" && originNotice._ref == ^._id] | order(date asc) {
      _id, title, "slug": slug.current, recordType, date, status,
      "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
        _id, title, "slug": slug.current, recordType, date, status,
        "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
          _id, title, "slug": slug.current, recordType, date, status,
          "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
            _id, title, "slug": slug.current, recordType, date, status
          }
        }
      }
    }
  }
`);

export const noticeSlugs = defineQuery(`
  *[_type == "notice" && defined(slug.current)][0..$limit].slug.current
`);

export const noticeLineageQuery = defineQuery(`
  *[_type == "notice" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    noticeType,
    date,
    excerpt,
    "relatedArea": relatedArea->{ name, "slug": slug.current },
    "originNotice": originNotice->{ title, "slug": slug.current, noticeType, date },
    "followUpNotices": *[_type == "notice" && originNotice._ref == ^._id] | order(date asc) {
      _id, title, "slug": slug.current, noticeType, date,
      "producedRecords": *[_type == "record" && originNotice._ref == ^._id] | order(date asc) {
        _id, title, "slug": slug.current, recordType, date, status, summary, verificationNote,
        evidence[]{ _key, title, "url": asset->url },
        "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
          _id, title, "slug": slug.current, recordType, date, status, summary,
          evidence[]{ _key, title, "url": asset->url }
        }
      }
    },
    "producedRecords": *[_type == "record" && originNotice._ref == ^._id] | order(date asc) {
      _id, title, "slug": slug.current, recordType, date, status, summary, verificationNote,
      evidence[]{ _key, title, "url": asset->url },
      "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
        _id, title, "slug": slug.current, recordType, date, status, summary,
        evidence[]{ _key, title, "url": asset->url },
        "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
          _id, title, "slug": slug.current, recordType, date, status, summary,
          evidence[]{ _key, title, "url": asset->url }
        }
      }
    }
  }
`);

export const opportunityDetailQuery = defineQuery(`
  *[_type == "opportunity" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    opportunityType,
    description,
    organization,
    deadline,
    link,
    featured,
    "relatedArea": relatedArea->{ name, "slug": slug.current },
    "relatedCampaign": relatedCampaign->{ title, "slug": slug.current }
  }
`);

export const opportunitySlugs = defineQuery(`
  *[_type == "opportunity" && defined(slug.current)][0..$limit].slug.current
`);

export const campaignDetailQuery = defineQuery(`
  *[_type == "campaign" && slug.current == $slug][0]{
    ${campaignFragment}
    content[]{ ..., markDefs[]{ ..., ...customLink{ ${linkFragment} } } },
    gallery[] {
      _key,
      alt,
      caption,
      asset->{ _id, url }
    },
    progressLog[] {
      _key,
      date,
      update
    },
    "stakeholderLogos": stakeholderLogos[] {
      _key,
      name,
      "url": asset->url
    },
    documents[] {
      _key,
      title,
      "url": asset->url
    },
    "relatedListings": relatedListings[]->{${listingFragment}},
    seo {
      ${seoFragment}
    }
  }
`);

export const campaignSlugs = defineQuery(`
  *[_type == "campaign" && defined(slug.current)][0..$limit].slug.current
`);

export const recordDetailQuery = defineQuery(`
  *[_type == "record" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    recordType,
    date,
    summary,
    status,
    "approvedBy": approvedBy->{ firstName, lastName, role, "slug": slug.current },
    content[]{ ..., markDefs[]{ ..., ...customLink{ ${linkFragment} } } },
    evidence[]{ _key, title, "url": asset->url },
    externalUrl,
    source,
    verificationNote,
    "originNotice": originNotice->{ title, "slug": slug.current, noticeType },
    "parentRecord": parentRecord->{ title, "slug": slug.current, recordType },
    "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
      _id, title, "slug": slug.current, recordType, date, status,
      "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
        _id, title, "slug": slug.current, recordType, date, status,
        "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
          _id, title, "slug": slug.current, recordType, date, status
        }
      }
    },
    "relatedArea": relatedArea->{ name, "slug": slug.current },
    "relatedCampaign": relatedCampaign->{ title, "slug": slug.current, campaignType, status }
  }
`);

export const recordSlugs = defineQuery(`
  *[_type == "record" && defined(slug.current)][0..$limit].slug.current
`);

export const recordListPageQuery = defineQuery(`
  *[_type == "record" && defined(slug.current)] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    recordType,
    date,
    summary,
    status,
    "relatedArea": relatedArea->{ name, "slug": slug.current }
  }
`);

export const devNoticeSlugs = defineQuery(`
  *[_type == "developmentNotice" && defined(slug.current)][0..$limit].slug.current
`);

export const latestContentQuery = defineQuery(`
  *[_type in ["notice", "developmentNotice", "opportunity", "program", "campaign"] && !(_id in path("drafts.**"))] | order(_updatedAt desc) [0]._updatedAt
`);

export const postsArchiveQuery = defineQuery(`
  {
    "allResults": *[
      _type == "post"
      &&
      (
        !defined( $filters.categorySlug ) || references(*[_type == "category" && slug.current == $filters.categorySlug]._id)
      )
      &&
      (
        !defined( $filters.personSlug ) || references(*[_type == "person" && slug.current == $filters.personSlug]._id)
      )
      //
      // Add more filter here if needed
      //
      // The filter value should be passed as a property of the $filter parameter
      //
      // (
      //   !defined( $filters.anotherFilter ) || fieldname == $filters.anotherFilter)
      // )
    ] | order(_createdAt desc, _id desc)
  }
  {
    "total": count(allResults),
    "results": allResults[$from..$to] {
      ${postCardFragment}
    }
  }
`);
