import category from './documents/category';
import listing from './documents/listing';
import notice from './documents/notice';
import page from './documents/page';
import person from './documents/person';
import post from './documents/post';
import program from './documents/program';
import blockContent from './objects/blockContent';
import button from './objects/button';
import link from './objects/link';
import menuItem from './objects/menuItem';
import adBanner from './objects/sections/adBanner';
import card from './objects/sections/card';
import cardGrid from './objects/sections/cardGrid';
import contactForm from './objects/sections/contactForm';
import cta from './objects/sections/cta';
import divider from './objects/sections/divider';
import gallery from './objects/sections/gallery';
import hero from './objects/sections/hero';
import listingGrid from './objects/sections/listingGrid';
import logoGrid from './objects/sections/logoGrid';
import mediaText from './objects/sections/mediaText';
import noticeList from './objects/sections/noticeList';
import postList from './objects/sections/postList';
import programList from './objects/sections/programList';
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
  notice,
  listing,
  program,

  // Sections
  adBanner,
  cta,
  hero,
  mediaText,
  postList,
  card,
  cardGrid,
  contactForm,
  divider,
  gallery,
  listingGrid,
  logoGrid,
  noticeList,
  programList,
  subscribe,
  teamGrid,

  // Objects
  blockContent,
  link,
  button,
  menuItem,
  ...seoTypes,
];
