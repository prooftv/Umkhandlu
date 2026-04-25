export const twitterFragment = /* groq */ `
  _type,
  site,
  creator,
  cardType,
  handle,
`;

export const imageFragment = /* groq */ `
  _type,
  crop {
    _type,
    right,
    top,
    left,
    bottom
  },
  hotspot {
    _type,
    x,
    y,
    height,
    width,
  },
  asset->{...},
`;

export const openGraphFragment = /* groq */ `
  _type,
  siteName,
  url,
  description,
  title,
  image {
    ${imageFragment}
  },
`;

export const metaAttributesFragment = /* groq */ `
  _type,
  attributeValueString,
  attributeType,
  attributeKey,
  attributeValueImage {
    ${imageFragment}
  },
`;

export const additionalMetaTagFragment = /* groq */ `
  _key,
  _type,
  metaAttributes[] {
    ${metaAttributesFragment}
  },
`;

export const seoFragment = /* groq */ `
  _type,
  metaTitle,
  noIndex,
  seoKeywords,
  metaDescription,
  metaImage{
    ${imageFragment}
  },
  additionalMetaTags[]{
    ${additionalMetaTagFragment}
  },
  openGraph {
    ${openGraphFragment}
  },
  twitter {
    ${twitterFragment}
  }
`;

export const linkFragment = /* groq */ `
  _type,
  type,
  openInNewTab,
  external,
  href,
  internal->{
    _type,
    _id,
    "slug": slug.current
  },
`;

const customLinkFragment = /* groq */ `
  ...customLink{
    ${linkFragment}
  },
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  },
`;

const contentFragment = /* groq */ `
  content[]{
    ...,
    ${markDefsFragment}
  },
`;

export const buttonFragment = /* groq */ `
  _key,
  _type,
  variant,
  text,
  link {
    ${linkFragment}
  },
`;

export const buttonsFragment = /* groq */ `
  buttons[]{
    ${buttonFragment}
  },
`;

export const heroSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  ${buttonsFragment}
`;

export const mediaTextSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  image,
  imagePosition,
  ${buttonsFragment}
`;

export const categoryFragment = /* groq */ `
  _id,
  _type,
  title,
  "slug": slug.current,
  description,
`;

export const personFragment = /* groq */ `
  _id,
  _type,
  firstName,
  lastName,
  image,
  role,
  personType,
  email,
  phone,
  organization,
  website,
  logo,
  skills,
  biography,
  "slug": slug.current,
`;

export const postCardFragment = /* groq */ `
  _type,
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  image,
  "categories": categories[]->{${categoryFragment}},
  "date": coalesce(date, _updatedAt),
  "author": author->{${personFragment}},
  "wordCount": count(string::split(coalesce(pt::text(content), ''), " ")),
`;

export const postFragment = /* groq */ `
  ${postCardFragment}
  ${contentFragment}
  seo {
    ${seoFragment}
  },
`;

export const postListSectionFragment = /* groq */ `
    _type,
    heading,
    numberOfPosts,
    "posts": *[_type == 'post'] | order(_createdAt desc, _id desc) [0...20] {
      ${postFragment}
    }
`;

export const dividerSectionFragment = /* groq */ `
  _type,
  height
`;

export const ctaSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  ${buttonsFragment}
`;

export const subscribeSectionFragment = /* groq */ `
  _type,
  heading,
  content,
  buttonText
`;

export const cardGridFragment = /* groq */ `
  _type,
  heading,
  ${contentFragment}
  icon,
`;

export const cardGridsSectionFragment = /* groq */ `
  ${cardGridFragment}
  cards[]{
    ${cardGridFragment}
  },
`;

export const teamGridSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  "members": members[]->{${personFragment}}
`;

export const noticeFragment = /* groq */ `
  _id,
  _type,
  title,
  "slug": slug.current,
  noticeType,
  date,
  excerpt,
  pinned,
`;

export const noticeListSectionFragment = /* groq */ `
  _type,
  heading,
  numberOfNotices,
  filterType,
  "notices": *[_type == 'notice' && select(
    ^.filterType == 'all' || !defined(^.filterType) => true,
    noticeType == ^.filterType
  )] | order(pinned desc, date desc) [0...^.numberOfNotices] {
    ${noticeFragment}
  }
`;

export const gallerySectionFragment = /* groq */ `
  _type,
  heading,
  description,
  images[] {
    _key,
    alt,
    caption,
    ${imageFragment}
  }
`;

export const listingFragment = /* groq */ `
  _id,
  _type,
  name,
  "slug": slug.current,
  listingType,
  description,
  location,
  contactInfo,
  whatsappContact,
  servicesOffered,
  operatingHours,
  verifiedByInduna,
  featured,
  image,
`;

export const listingGridSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  filterType,
  limit,
  "listings": *[_type == 'listing' && select(
    ^.filterType == 'all' || !defined(^.filterType) => true,
    listingType == ^.filterType
  )] | order(featured desc, name asc) [0...^.limit] {
    ${listingFragment}
  }
`;

export const logoGridSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  "sponsors": sponsors[]->{
    _id,
    firstName,
    lastName,
    organization,
    website,
    logo {
      ${imageFragment}
    },
    image {
      ${imageFragment}
    }
  },
  logos[] {
    _key,
    name,
    url,
    logo {
      ${imageFragment}
    }
  }
`;

export const adBannerSectionFragment = /* groq */ `
  _type,
  title,
  image,
  link,
  sponsorName,
  startDate,
  endDate,
  size
`;

export const opportunityFragment = /* groq */ `
  _id,
  _type,
  title,
  "slug": slug.current,
  opportunityType,
  description,
  organization,
  deadline,
  link,
  featured,
`;

export const opportunityListSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  filterType,
  limit,
  "opportunities": *[_type == 'opportunity' && (deadline > now() || !defined(deadline)) && select(
    ^.filterType == 'all' || !defined(^.filterType) => true,
    opportunityType == ^.filterType
  )] | order(featured desc, deadline asc) [0...^.limit] {
    ${opportunityFragment}
  }
`;

export const programFragment = /* groq */ `
  _id,
  _type,
  title,
  "slug": slug.current,
  programType,
  status,
  date,
  description,
  image,
`;

export const programListSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  filterStatus,
  limit,
  "programs": *[_type == 'program' && select(
    ^.filterStatus == 'all' || !defined(^.filterStatus) => true,
    status == ^.filterStatus
  )] | order(date desc) [0...^.limit] {
    ${programFragment}
  }
`;

export const processSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  steps[] {
    _key,
    title,
    description
  },
  footnote
`;

export const recordFragment = /* groq */ `
  _id,
  _type,
  title,
  "slug": slug.current,
  recordType,
  date,
  summary,
  "fileUrl": file.asset->url,
`;

export const recordListSectionFragment = /* groq */ `
  _type,
  heading,
  filterType,
  limit,
  "records": *[_type == 'record' && select(
    ^.filterType == 'all' || !defined(^.filterType) => true,
    recordType == ^.filterType
  )] | order(date desc) [0...^.limit] {
    ${recordFragment}
  }
`;

export const contactFormSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  showMap,
  mapEmbedUrl
`;

export const pageBuilderFragment = /* groq */ `
  pageSections[]{
    ...,
    _key,
    _type,
    _type == 'adBanner' => {${adBannerSectionFragment}},
    _type == 'cardGrid' => {${cardGridsSectionFragment}},
    _type == 'contactForm' => {${contactFormSectionFragment}},
    _type == 'cta' => {${ctaSectionFragment}},
    _type == 'divider' => {${dividerSectionFragment}},
    _type == 'gallery' => {${gallerySectionFragment}},
    _type == 'hero' => {${heroSectionFragment}},
    _type == 'listingGrid' => {${listingGridSectionFragment}},
    _type == 'logoGrid' => {${logoGridSectionFragment}},
    _type == 'mediaText' => {${mediaTextSectionFragment}},
    _type == 'noticeList' => {${noticeListSectionFragment}},
    _type == 'opportunityList' => {${opportunityListSectionFragment}},
    _type == 'postList' => {${postListSectionFragment}},
    _type == 'process' => {${processSectionFragment}},
    _type == 'programList' => {${programListSectionFragment}},
    _type == 'recordList' => {${recordListSectionFragment}},
    _type == 'subscribe' => {${subscribeSectionFragment}},
    _type == 'teamGrid' => {${teamGridSectionFragment}}
  },
`;

export const menuItemFragment = /* groq */ `
  _type,
  _key,
  text,
  type,
  link {
    ${linkFragment}
  },
`;

export const menuFragment = /* groq */ `
  menu[]{
    ${menuItemFragment}
    childMenu[]{
      ${menuItemFragment}
    }
  }
`;

export const pageFragment = /* groq */ `
  ${pageBuilderFragment}
  seo {
    ${seoFragment}
  },
`;
