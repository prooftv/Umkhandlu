import { defineArrayMember, defineField } from 'sanity';
import adBanner from '../objects/sections/adBanner';
import cardGrid from '../objects/sections/cardGrid';
import contactForm from '../objects/sections/contactForm';
import cta from '../objects/sections/cta';
import divider from '../objects/sections/divider';
import gallery from '../objects/sections/gallery';
import hero from '../objects/sections/hero';
import listingGrid from '../objects/sections/listingGrid';
import logoGrid from '../objects/sections/logoGrid';
import mediaText from '../objects/sections/mediaText';
import noticeList from '../objects/sections/noticeList';
import opportunityList from '../objects/sections/opportunityList';
import postList from '../objects/sections/postList';
import process from '../objects/sections/process';
import programList from '../objects/sections/programList';
import recordList from '../objects/sections/recordList';
import subscribe from '../objects/sections/subscribe';
import teamGrid from '../objects/sections/teamGrid';

const pageSectionsObjects = [
  adBanner,
  cardGrid,
  contactForm,
  cta,
  divider,
  gallery,
  hero,
  listingGrid,
  logoGrid,
  mediaText,
  noticeList,
  opportunityList,
  postList,
  process,
  programList,
  recordList,
  subscribe,
  teamGrid,
];

export default defineField({
  name: 'pageSections',
  title: 'Page Sections',
  type: 'array',
  of: pageSectionsObjects.map(({ name }) => defineArrayMember({ type: name })),
  group: 'content',
});
