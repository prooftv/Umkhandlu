import { defineQuery } from 'next-sanity';
import {
  categoryFragment,
  listingFragment,
  menuFragment,
  noticeFragment,
  opportunityFragment,
  pageFragment,
  personFragment,
  postCardFragment,
  postFragment,
  programFragment,
} from './fragments/fragments';

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  title,
  description,
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
    slug,
    ${pageFragment}
  }
`);

export const getSitemapQuery = defineQuery(`
  *[((_type in ["page", "post", "category", "person", "notice", "opportunity"] && defined(slug.current)) || (_type == "listing" && listingType == "area" && defined(slug.current)) || (_type in ["homePage", "blogPage"])) && seo.noIndex != true]{
    "href": select(
      _type == "page" => "/" + slug.current,
      _type == "post" => "/blog/" + slug.current,
      _type == "category" => "/category/" + slug.current,
      _type == "person" => "/author/" + slug.current,
      _type == "listing" => "/areas/" + slug.current,
      _type == "notice" => "/notices/" + slug.current,
      _type == "opportunity" => "/opportunities/" + slug.current,
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
    }
  }
`);

export const areaSlugs = defineQuery(`
  *[_type == "listing" && listingType == "area" && defined(slug.current)][0..$limit].slug.current
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
