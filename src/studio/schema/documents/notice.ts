import { BellIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import StudioNote from '../../components/StudioNote';

export default defineType({
  name: 'notice',
  title: 'Notices',
  icon: BellIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Clear, descriptive title. 60-80 characters recommended.',
      validation: (rule) => rule.required().max(120),
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'noticeType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Meeting', value: 'meeting' },
          { title: 'Announcement', value: 'announcement' },
          { title: 'Resolution', value: 'resolution' },
          { title: 'Alert', value: 'alert' },
          { title: 'Opportunity', value: 'opportunity' },
          { title: 'Employment', value: 'employment' },
          { title: 'SMME / Procurement', value: 'smme' },
          { title: 'Project Update', value: 'project-update' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'announcement',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'excerpt',
      description:
        '1-2 sentence summary shown in notice lists. 100-200 characters.',
      validation: (rule) => rule.max(300),
      title: 'Short Description',
      type: 'text',
      rows: 3,
      options: { aiAssist: { translateAction: true } },
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      description: 'Optional image for notice cards. Recommended: 1200×600px.',
      options: {
        hotspot: true,
        aiAssist: { imageDescriptionField: 'alt' },
      },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'pinned',
      title: 'Pin to Top',
      type: 'boolean',
      initialValue: false,
      description: 'Pinned notices appear first.',
    }),
    defineField({
      name: 'linkingNote',
      title: 'Linking Guide',
      type: 'string',
      components: {
        field: () =>
          StudioNote({
            title: 'Link this notice',
            description:
              'Select a Related Area so this notice appears on the area page. If this notice is part of a campaign, link it below.',
          }),
      },
    }),
    defineField({
      name: 'relatedArea',
      title: 'Related Area',
      type: 'reference',
      to: [{ type: 'listing' }],
      description: 'Link to a specific area/village if applicable.',
      options: {
        filter: 'listingType == "area"',
      },
    }),
    defineField({
      name: 'relatedCampaign',
      title: 'Related Campaign',
      type: 'reference',
      to: [{ type: 'campaign' }],
      description: 'Link to a campaign if this notice supports one.',
    }),
    defineField({
      name: 'originNotice',
      title: 'Follow-up to (Origin Notice)',
      type: 'reference',
      to: [{ type: 'notice' }],
      description:
        'If this is a follow-up meeting, link the original notice here.',
    }),
    defineField({
      name: 'location',
      title: 'Venue / Location',
      type: 'string',
      description:
        'Where this meeting takes place. e.g. "Soccer ground opposite Izazi High School"',
    }),
    defineField({
      name: 'attendance',
      title: 'Expected Attendance',
      type: 'number',
      description:
        'Expected number of attendees (for notices) or actual count (update after meeting).',
    }),
    defineField({
      name: 'weatherContext',
      title: 'Environmental Context',
      type: 'environmentalContext',
      description:
        'Auto-captured from Open-Meteo on page visit. Do not edit manually.',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Date (Newest)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      noticeType: 'noticeType',
      date: 'date',
    },
    prepare({ title, noticeType, date }) {
      return {
        title,
        subtitle: `${noticeType || 'notice'} — ${date ? new Date(date).toLocaleDateString() : 'No date'}`,
      };
    },
  },
});
