import { EarthGlobeIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'communityMap',
  title: 'Community Map',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Community Map',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'centerLat',
      title: 'Default Center Latitude',
      type: 'number',
      description: 'e.g. -28.7 for KZN',
      initialValue: -28.7,
    }),
    defineField({
      name: 'centerLng',
      title: 'Default Center Longitude',
      type: 'number',
      description: 'e.g. 30.5 for KZN',
      initialValue: 30.5,
    }),
    defineField({
      name: 'zoom',
      title: 'Default Zoom Level',
      type: 'number',
      initialValue: 12,
      validation: (rule) => rule.min(1).max(18),
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
          { title: 'Accommodation', value: 'accommodation' },
          { title: 'Churches', value: 'church' },
          { title: 'Community Facilities', value: 'facility' },
          { title: 'Villages / Areas', value: 'area' },
        ],
      },
      initialValue: 'all',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Community Map', subtitle: 'Interactive Map' };
    },
  },
});
