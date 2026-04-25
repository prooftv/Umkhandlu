import { RocketIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'programList',
  title: 'Programs & Events List',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Programs & Events',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'filterStatus',
      title: 'Filter by Status',
      type: 'string',
      options: {
        list: [
          { title: 'All', value: 'all' },
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Active', value: 'active' },
          { title: 'Completed', value: 'completed' },
        ],
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'limit',
      title: 'Max to Show',
      type: 'number',
      initialValue: 6,
      validation: (rule) => rule.min(1).max(20),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title || 'Program List',
        subtitle: 'Programs & Events',
      };
    },
  },
});
