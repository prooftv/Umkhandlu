import { UsersIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'peopleGrid',
  title: 'Community People Grid',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Our Community',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'filterType',
      title: 'Filter by Type',
      type: 'string',
      options: {
        list: [
          { title: 'All', value: 'all' },
          { title: 'Inkosi', value: 'inkosi' },
          { title: 'Izinduna', value: 'induna' },
          { title: 'Council Members', value: 'council' },
          { title: 'Youth Representatives', value: 'youth' },
          { title: 'Community Members', value: 'community' },
          { title: 'Authors', value: 'author' },
        ],
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'limit',
      title: 'Max People to Show',
      type: 'number',
      initialValue: 12,
      validation: (rule) => rule.min(1).max(50),
    }),
  ],
  preview: {
    select: { title: 'heading', filterType: 'filterType' },
    prepare({ title, filterType }) {
      return {
        title: title || 'People Grid',
        subtitle: `People — ${filterType || 'all'}`,
      };
    },
  },
});
