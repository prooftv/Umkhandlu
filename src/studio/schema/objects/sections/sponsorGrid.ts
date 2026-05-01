import { StarIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sponsorGrid',
  title: 'Sponsors & Partners Grid',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Our Partners & Sponsors',
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
          { title: 'NGO / Foundation', value: 'ngo' },
          { title: 'Business', value: 'business' },
          { title: 'Government', value: 'government' },
          { title: 'Community Organization', value: 'community' },
        ],
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'limit',
      title: 'Max Sponsors to Show',
      type: 'number',
      initialValue: 12,
      validation: (rule) => rule.min(1).max(50),
    }),
  ],
  preview: {
    select: { title: 'heading', filterType: 'filterType' },
    prepare({ title, filterType }) {
      return {
        title: title || 'Sponsor Grid',
        subtitle: `Sponsors — ${filterType || 'all'}`,
      };
    },
  },
});
