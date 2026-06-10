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
  skills,
  biography,
  gallery[] {
    _key,
    alt,
    caption,
    asset->{ _id, url }
  },
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
    "posts": *[_type == 'post'] | order(_createdAt desc, _id desc) [0...10] {
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

export const organogramSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  "inkosi": inkosi->{${personFragment}},
  "izinduna": izinduna[]->{${personFragment}},
  "council": council[]->{${personFragment}}
`;

export const peopleGridSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  filterType,
  limit,
  "people": *[_type == 'person' && select(
    ^.filterType == 'all' || !defined(^.filterType) => true,
    personType == ^.filterType
  )] | order(firstName asc) [0...12] {
    ${personFragment}
  }
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
  image,
  "relatedCampaign": relatedCampaign->{ title, "slug": slug.current },
`;

export const noticeListSectionFragment = /* groq */ `
  _type,
  heading,
  numberOfNotices,
  filterType,
  "notices": *[_type == 'notice' && select(
    ^.filterType == 'all' || !defined(^.filterType) => true,
    noticeType == ^.filterType
  )] | order(pinned desc, date desc) [0...10] {
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
  geopoint,
  contactInfo,
  whatsappContact,
  website,
  servicesOffered,
  operatingHours,
  verifiedByInduna,
  featured,
  image,
  "imageUrl": image.asset->url,
  "areaName": relatedArea->name,
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
  )] | order(featured desc, name asc) [0...12] {
    ${listingFragment}
  }
`;

export const sponsorFragment = /* groq */ `
  _id,
  _type,
  name,
  "slug": slug.current,
  sponsorType,
  logo,
  website,
  description,
`;

export const logoGridSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  "sponsors": sponsors[]->{${sponsorFragment}}
`;

export const sponsorGridSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  filterType,
  limit,
  "sponsors": *[_type == 'sponsor' && select(
    ^.filterType == 'all' || !defined(^.filterType) => true,
    sponsorType == ^.filterType
  )] | order(name asc) [0...12] {
    ${sponsorFragment}
  }
`;

export const adBannerSectionFragment = /* groq */ `
  _type,
  title,
  image,
  link,
  sponsorName,
  "sponsor": sponsor->{
    name,
    website
  },
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
  image,
`;

export const campaignFragment = /* groq */ `
  _id,
  _type,
  title,
  "slug": slug.current,
  campaignType,
  status,
  description,
  targetAudience,
  tags,
  startDate,
  endDate,
  image,
  hideCoverImage,
  link,
  videoUrl,
  "audioFileUrl": audioFile.asset->url,
  fundingSource,
  contractor,
  contractNumber,
  consultingEngineer,
  projectPhase,
  localSMMEs,
  smmeDirectory[] {
    _key,
    name,
    service,
    owner,
    verified,
    "logoUrl": logo.asset->url
  },
  budget,
  beneficiaries,
  impactSummary,
  deliverables,
  deliverablesCertified[] {
    _key,
    task,
    status,
    percentageComplete,
    weightage,
    certifiedBy,
    certificationDate,
    notes
  },
  totalDeliverables,
  "verificationRecords": *[_type == "conflictLog" && references(^._id)] | order(detectedAt desc) [0...5] {
    _id,
    field,
    conflictType,
    displayTruth,
    resolutionState,
    resolutionNote,
    detectedAt,
    resolvedAt,
    claims[] {
      source,
      value,
      date,
      evidence
    }
  },
  communityNote[] {
    _key,
    date,
    issuedBy,
    message
  },
  projectUpdates[] {
    _key,
    date,
    title,
    content[]{ ..., markDefs[]{ ..., ...customLink{ ${linkFragment} } } },
    gallery[] {
      _key,
      alt,
      caption,
      asset->{ _id, url }
    },
    videoUrl
  },
  "sponsor": sponsor->{ name, "slug": slug.current, logo, "logoUrl": logo.asset->url, website, sponsorType },
  "contactPerson": contactPerson->{ firstName, lastName, role, "slug": slug.current },
  "relatedAreas": relatedAreas[]->{ name, "slug": slug.current, "induna": induna->{ firstName, lastName, role } },
  "relatedProgram": relatedProgram->{ title, "slug": slug.current },
  "relatedOpportunities": *[_type == "opportunity" && references(^._id) && (deadline > now() || !defined(deadline))] | order(featured desc, deadline asc) [0...5] {
    ${opportunityFragment}
  },
  "relatedDevelopmentNotices": *[_type == "developmentNotice" && references(^._id) && status in ["open", "closed"]] | order(commentDeadline asc) [0...5] {
    _id,
    title,
    "slug": slug.current,
    noticeType,
    status,
    applicant,
    commentDeadline,
    publishDate,
    location
  },
  "relatedNotices": *[_type == "notice" && references(^._id)] | order(date desc) [0...5] {
    ${noticeFragment}
  },
`;

export const campaignListSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  filterType,
  filterStatus,
  limit,
  "campaigns": *[_type == 'campaign' && select(
    ^.filterType == 'all' || !defined(^.filterType) => true,
    campaignType == ^.filterType
  ) && select(
    ^.filterStatus == 'all' || !defined(^.filterStatus) => true,
    status == ^.filterStatus
  )] | order(startDate desc) [0...12] {
    ${campaignFragment}
  }
`;

export const communityMapSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  centerLat,
  centerLng,
  zoom,
  filterType,
  "listings": *[_type == 'listing' && defined(geopoint) && select(
    ^.filterType == 'all' || !defined(^.filterType) => true,
    listingType == ^.filterType
  )] | order(featured desc, name asc) {
    ${listingFragment}
  }
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
  )] | order(featured desc, deadline asc) [0...12] {
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
  )] | order(date desc) [0...12] {
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
  status,
  "approvedBy": approvedBy->{ firstName, lastName, role },
  "fileUrl": file.asset->url,
  externalUrl,
  source,
`;

export const recordListSectionFragment = /* groq */ `
  _type,
  heading,
  filterType,
  limit,
  "records": *[_type == 'record' && select(
    ^.filterType == 'all' || !defined(^.filterType) => true,
    recordType == ^.filterType
  )] | order(date desc) [0...10] {
    ${recordFragment}
  }
`;

export const richTextSectionFragment = /* groq */ `
  _type,
  heading,
  ${contentFragment}
`;

export const faqSectionFragment = /* groq */ `
  _type,
  heading,
  items[] {
    _key,
    question,
    answer[]{ ..., ${markDefsFragment} }
  }
`;

export const statsSectionFragment = /* groq */ `
  _type,
  heading,
  items[] {
    _key,
    value,
    label
  }
`;

export const embedSectionFragment = /* groq */ `
  _type,
  heading,
  url,
  aspectRatio
`;

export const quoteSectionFragment = /* groq */ `
  _type,
  text,
  "author": author->{
    firstName,
    lastName,
    role,
    image
  },
  authorName,
  authorRole,
  image
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
    _type == 'campaignList' => {${campaignListSectionFragment}},
    _type == 'cardGrid' => {${cardGridsSectionFragment}},
    _type == 'communityMap' => {${communityMapSectionFragment}},
    _type == 'contactForm' => {${contactFormSectionFragment}},
    _type == 'cta' => {${ctaSectionFragment}},
    _type == 'divider' => {${dividerSectionFragment}},
    _type == 'embed' => {${embedSectionFragment}},
    _type == 'faq' => {${faqSectionFragment}},
    _type == 'gallery' => {${gallerySectionFragment}},
    _type == 'hero' => {${heroSectionFragment}},
    _type == 'listingGrid' => {${listingGridSectionFragment}},
    _type == 'logoGrid' => {${logoGridSectionFragment}},
    _type == 'mediaText' => {${mediaTextSectionFragment}},
    _type == 'noticeList' => {${noticeListSectionFragment}},
    _type == 'opportunityList' => {${opportunityListSectionFragment}},
    _type == 'organogram' => {${organogramSectionFragment}},
    _type == 'postList' => {${postListSectionFragment}},
    _type == 'process' => {${processSectionFragment}},
    _type == 'programList' => {${programListSectionFragment}},
    _type == 'peopleGrid' => {${peopleGridSectionFragment}},
    _type == 'quote' => {${quoteSectionFragment}},
    _type == 'recordList' => {${recordListSectionFragment}},
    _type == 'richText' => {${richTextSectionFragment}},
    _type == 'sponsorGrid' => {${sponsorGridSectionFragment}},
    _type == 'stats' => {${statsSectionFragment}},
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
