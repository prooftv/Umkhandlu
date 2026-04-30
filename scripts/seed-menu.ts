/**
 * Template Menu Structure
 *
 * Seeds the standard navigation layout:
 * Home | About ▾ | Community ▾ | Directory ▾ | Contact
 *
 * Generic — no council-specific links. Council scripts can patch
 * additional menu items (e.g. area links) after this runs.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-menu.ts
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    'Missing env vars. Run with:\n  SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-menu.ts'
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-08-22',
  useCdn: false,
});

const menu = [
  {
    _key: 'menu-home',
    _type: 'menuItem',
    text: 'Home',
    type: 'link',
    link: {
      _type: 'link',
      type: 'internal',
      internal: { _type: 'reference', _ref: 'homePage' },
    },
  },
  {
    _key: 'menu-about',
    _type: 'menuItem',
    text: 'About',
    type: 'child-menu',
    childMenu: [
      {
        _key: 'menu-about-council',
        _type: 'menuItem',
        text: 'The Council',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-about' },
        },
      },
      {
        _key: 'menu-about-leadership',
        _type: 'menuItem',
        text: 'Leadership',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-leadership' },
        },
      },
      {
        _key: 'menu-about-land',
        _type: 'menuItem',
        text: 'Land & Governance',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-land' },
        },
      },
    ],
  },
  {
    _key: 'menu-community',
    _type: 'menuItem',
    text: 'Community',
    type: 'child-menu',
    childMenu: [
      {
        _key: 'menu-community-notices',
        _type: 'menuItem',
        text: 'Notices',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-notices' },
        },
      },
      {
        _key: 'menu-community-opportunities',
        _type: 'menuItem',
        text: 'Opportunities',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-opportunities' },
        },
      },
      {
        _key: 'menu-community-programs',
        _type: 'menuItem',
        text: 'Programs',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-programs' },
        },
      },
      {
        _key: 'menu-community-projects',
        _type: 'menuItem',
        text: 'Projects',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-projects' },
        },
      },
    ],
  },
  {
    _key: 'menu-directory',
    _type: 'menuItem',
    text: 'Directory',
    type: 'child-menu',
    childMenu: [
      {
        _key: 'menu-directory-all',
        _type: 'menuItem',
        text: 'All Listings',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-directory' },
        },
      },
      {
        _key: 'menu-directory-schools',
        _type: 'menuItem',
        text: 'Schools',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-schools' },
        },
      },
      {
        _key: 'menu-directory-health',
        _type: 'menuItem',
        text: 'Health',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-health' },
        },
      },
      {
        _key: 'menu-directory-economy',
        _type: 'menuItem',
        text: 'Local Economy',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-economy' },
        },
      },
    ],
  },
  {
    _key: 'menu-contact',
    _type: 'menuItem',
    text: 'Contact',
    type: 'link',
    link: {
      _type: 'link',
      type: 'internal',
      internal: { _type: 'reference', _ref: 'page-contact' },
    },
  },
];

async function seed() {
  await client.patch('siteSettings').set({ menu }).commit();
  console.log(
    'Menu updated: Home | About ▾ | Community ▾ | Directory ▾ | Contact'
  );
}

seed().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
