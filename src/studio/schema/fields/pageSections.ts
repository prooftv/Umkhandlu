import { defineArrayMember, defineField } from 'sanity';
import cardGrid from '../objects/sections/cardGrid';
import contactForm from '../objects/sections/contactForm';
import cta from '../objects/sections/cta';
import divider from '../objects/sections/divider';
import gallery from '../objects/sections/gallery';
import hero from '../objects/sections/hero';
import logoGrid from '../objects/sections/logoGrid';
import mediaText from '../objects/sections/mediaText';
import noticeList from '../objects/sections/noticeList';
import postList from '../objects/sections/postList';
import subscribe from '../objects/sections/subscribe';
import teamGrid from '../objects/sections/teamGrid';

const pageSectionsObjects = [
  cardGrid,
  contactForm,
  cta,
  divider,
  gallery,
  hero,
  logoGrid,
  mediaText,
  noticeList,
  postList,
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
