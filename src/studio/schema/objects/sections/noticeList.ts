import { BellIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'noticeList',
  title: 'Notice List',
  type: 'object',
  icon: BellIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Community Notices',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'numberOfNotices',
      title: 'Number of Notices to Show',
      type: 'number',
      initialValue: 5,
      validation: (rule) => rule.required().min(1).max(20),
    }),
    defineField({
      name: 'filterType',
      title: 'Filter by Type',
      type: 'string',
      options: {
        list: [
          { title: 'All', value: 'all' },
          { title: 'Meetings', value: 'meeting' },
          { title: 'Announcements', value: 'announcement' },
          { title: 'Alerts', value: 'alert' },
          { title: 'Opportunities', value: 'opportunity' },
        ],
      },
      initialValue: 'all',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Notice List', subtitle: 'Notices' };
    },
  },
});
