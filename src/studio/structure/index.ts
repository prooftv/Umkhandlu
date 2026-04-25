import {
  BellIcon,
  CogIcon,
  DocumentIcon,
  HomeIcon,
  PinIcon,
  RocketIcon,
  UsersIcon,
} from '@sanity/icons';
import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Umkhandlu')
    .items([
      // Pages
      S.listItem()
        .title('Home')
        .child(S.document().schemaType('homePage').documentId('homePage'))
        .icon(HomeIcon),
      S.listItem()
        .title('Blog Page')
        .child(S.document().schemaType('blogPage').documentId('blogPage'))
        .icon(DocumentIcon),
      S.documentTypeListItem('page').title('Pages'),

      S.divider(),

      // Content
      S.documentTypeListItem('post').title('Posts & Stories'),
      S.documentTypeListItem('notice')
        .title('Community Notices')
        .icon(BellIcon),
      S.documentTypeListItem('category').title('Categories'),

      S.divider(),

      // People
      S.documentTypeListItem('person')
        .title('Leadership & People')
        .icon(UsersIcon),
      S.documentTypeListItem('program')
        .title('Programs & Events')
        .icon(RocketIcon),

      S.divider(),

      // Directory
      S.documentTypeListItem('listing')
        .title('Directory Listings')
        .icon(PinIcon),

      S.divider(),

      // Settings
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ]);
