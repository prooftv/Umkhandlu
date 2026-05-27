import campaign from './documents/campaign';
import category from './documents/category';
import developmentNotice from './documents/developmentNotice';
import listing from './documents/listing';
import notice from './documents/notice';
import opportunity from './documents/opportunity';
import page from './documents/page';
import person from './documents/person';
import post from './documents/post';
import program from './documents/program';
import record from './documents/record';
import sponsor from './documents/sponsor';
import blockContent from './objects/blockContent';
import button from './objects/button';
import link from './objects/link';
import menuItem from './objects/menuItem';
import adBanner from './objects/sections/adBanner';
import campaignList from './objects/sections/campaignList';
import card from './objects/sections/card';
import cardGrid from './objects/sections/cardGrid';
import communityMap from './objects/sections/communityMap';
import contactForm from './objects/sections/contactForm';
import cta from './objects/sections/cta';
import divider from './objects/sections/divider';
import embed from './objects/sections/embed';
import faq from './objects/sections/faq';
import gallery from './objects/sections/gallery';
import hero from './objects/sections/hero';
import listingGrid from './objects/sections/listingGrid';
import logoGrid from './objects/sections/logoGrid';
import mediaText from './objects/sections/mediaText';
import noticeList from './objects/sections/noticeList';
import opportunityList from './objects/sections/opportunityList';
import organogram from './objects/sections/organogram';
import peopleGrid from './objects/sections/peopleGrid';
import postList from './objects/sections/postList';
import process from './objects/sections/process';
import programList from './objects/sections/programList';
import quote from './objects/sections/quote';
import recordList from './objects/sections/recordList';
import richText from './objects/sections/richText';
import sponsorGrid from './objects/sections/sponsorGrid';
import stats from './objects/sections/stats';
import subscribe from './objects/sections/subscribe';
import teamGrid from './objects/sections/teamGrid';
import seoTypes from './objects/seo';
import blogPage from './singletons/blogPage';
import homePage from './singletons/homePage';
import settings from './singletons/settings';

export const schemaTypes = [
  // Singletons
  settings,
  homePage,
  blogPage,

  // Documents
  page,
  post,
  person,
  category,
  developmentNotice,
  notice,
  listing,
  opportunity,
  program,
  record,
  sponsor,
  campaign,

  // Sections
  adBanner,
  campaignList,
  communityMap,
  cta,
  hero,
  mediaText,
  postList,
  card,
  cardGrid,
  contactForm,
  divider,
  embed,
  faq,
  gallery,
  listingGrid,
  logoGrid,
  noticeList,
  opportunityList,
  organogram,
  process,
  programList,
  peopleGrid,
  quote,
  recordList,
  richText,
  sponsorGrid,
  stats,
  subscribe,
  teamGrid,

  // Objects
  blockContent,
  link,
  button,
  menuItem,
  ...seoTypes,
];
