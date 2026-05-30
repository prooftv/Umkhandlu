import {
  BellIcon,
  BulbOutlineIcon,
  CogIcon,
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  PinIcon,
  RocketIcon,
  StarIcon,
  UsersIcon,
  WarningOutlineIcon,
} from '@sanity/icons';
import type { StructureResolver } from 'sanity/structure';
import { SITE_NAME } from '@/lib/siteConfig';

export const structure: StructureResolver = (S) =>
  S.list()
    .title(SITE_NAME)
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

      // Governance
      S.documentTypeListItem('notice')
        .title('Community Notices')
        .icon(BellIcon),
      S.documentTypeListItem('developmentNotice')
        .title('Development Notices')
        .icon(BellIcon),
      S.documentTypeListItem('record')
        .title('Documents & Records')
        .icon(FolderIcon),
      S.documentTypeListItem('conflictLog')
        .title('Verification Records')
        .icon(WarningOutlineIcon),

      S.divider(),

      // People & Programs
      S.documentTypeListItem('person')
        .title('Leadership & People')
        .icon(UsersIcon),
      S.documentTypeListItem('program')
        .title('Programs & Events')
        .icon(RocketIcon),
      S.documentTypeListItem('opportunity')
        .title('Opportunities')
        .icon(StarIcon),

      S.divider(),

      // Content
      S.documentTypeListItem('post').title('Posts & Stories'),
      S.documentTypeListItem('category').title('Categories'),

      S.divider(),

      // Directory & Sponsors
      S.documentTypeListItem('listing')
        .title('Directory Listings')
        .icon(PinIcon),
      S.documentTypeListItem('sponsor')
        .title('Sponsors & Partners')
        .icon(StarIcon),
      S.documentTypeListItem('campaign')
        .title('Campaigns & Activations')
        .icon(BulbOutlineIcon),

      S.divider(),

      // Settings
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ]);
