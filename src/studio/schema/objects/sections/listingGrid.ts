import { PinIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'listingGrid',
  title: 'Directory / Listings Grid',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Explore Mndozo',
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
          { title: 'Schools', value: 'school' },
          { title: 'Clinics / Health', value: 'clinic' },
          { title: 'Businesses', value: 'business' },
          { title: 'Churches', value: 'church' },
          { title: 'Community Facilities', value: 'facility' },
        ],
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'limit',
      title: 'Max Listings to Show',
      type: 'number',
      initialValue: 12,
      validation: (rule) => rule.min(1).max(50),
    }),
  ],
  preview: {
    select: { title: 'heading', filterType: 'filterType' },
    prepare({ title, filterType }) {
      return {
        title: title || 'Listing Grid',
        subtitle: `Directory — ${filterType || 'all'}`,
      };
    },
  },
});
