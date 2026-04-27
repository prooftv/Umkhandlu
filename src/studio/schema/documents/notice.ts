import { BellIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

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
        ],
        layout: 'radio',
        direction: 'horizontal',
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
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'pinned',
      title: 'Pin to Top',
      type: 'boolean',
      initialValue: false,
      description: 'Pinned notices appear first.',
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
