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
  *[((_type in ["page", "post", "category", "person", "notice", "opportunity", "listing", "program", "campaign"] && defined(slug.current) && !(_id in path("drafts.**"))) || (_type in ["homePage", "blogPage"])) && seo.noIndex != true]{
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
    }
  }
`);

export const areaSlugs = defineQuery(`
  *[_type == "listing" && listingType == "area" && defined(slug.current)][0..$limit].slug.current
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
    content[]{ ..., markDefs[]{ ..., ...customLink{ ${linkFragment} } } },
    pinned,
    "relatedArea": relatedArea->{ name, "slug": slug.current }
  }
`);

export const noticeSlugs = defineQuery(`
  *[_type == "notice" && defined(slug.current)][0..$limit].slug.current
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
    "relatedArea": relatedArea->{ name, "slug": slug.current }
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
    documents[] {
      _key,
      title,
      "url": asset->url
    },
    seo {
      ${seoFragment}
    }
  }
`);

export const campaignSlugs = defineQuery(`
  *[_type == "campaign" && defined(slug.current)][0..$limit].slug.current
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
