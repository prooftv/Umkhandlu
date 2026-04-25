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
      type: 'string',
      validation: (rule) => rule.required(),
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
