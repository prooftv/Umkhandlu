import { StarIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'opportunityList',
  title: 'Opportunities List',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Opportunities',
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
          { title: 'Jobs', value: 'job' },
          { title: 'Training / Learnerships', value: 'training' },
          { title: 'Bursaries', value: 'bursary' },
          { title: 'Funding / Grants', value: 'funding' },
        ],
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'limit',
      title: 'Max to Show',
      type: 'number',
      initialValue: 10,
      validation: (rule) => rule.min(1).max(50),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title || 'Opportunities',
        subtitle: 'Opportunities List',
      };
    },
  },
});
