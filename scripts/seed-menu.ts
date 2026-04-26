/**
 * Template Menu Structure
 *
 * Updates the navigation to the standard grouped layout:
 * Home | Council ▾ | Community ▾ | Contact
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-menu.ts
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '60v9eb0r';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN');
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
    _key: 'menu-council',
    _type: 'menuItem',
    text: 'Council',
    type: 'child-menu',
    childMenu: [
      {
        _key: 'menu-about',
        _type: 'menuItem',
        text: 'About',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-about' },
        },
      },
      {
        _key: 'menu-leadership',
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
        _key: 'menu-land',
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
        _key: 'menu-notices',
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
        _key: 'menu-directory',
        _type: 'menuItem',
        text: 'Directory',
        type: 'link',
        link: {
          _type: 'link',
          type: 'internal',
          internal: { _type: 'reference', _ref: 'page-directory' },
        },
      },
      {
        _key: 'menu-areas',
        _type: 'menuItem',
        text: 'Areas',
        type: 'link',
        link: {
          _type: 'link',
          type: 'external',
          external: '/areas/mndozo',
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
  console.log('Menu updated: Home | Council ▾ | Community ▾ | Contact');
}

seed().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
