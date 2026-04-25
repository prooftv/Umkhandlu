import { PinIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'listing',
  title: 'Directory Listings',
  icon: PinIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'listingType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'School', value: 'school' },
          { title: 'Clinic / Health', value: 'clinic' },
          { title: 'Business', value: 'business' },
          { title: 'Church', value: 'church' },
          { title: 'Community Facility', value: 'facility' },
          { title: 'Village / Area', value: 'area' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'location',
      title: 'Location / Address',
      type: 'string',
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Info',
      type: 'string',
      description: 'Phone number, email, or other contact details.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Featured listings appear first.',
    }),
  ],
  orderings: [
    {
      title: 'Name (A-Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      listingType: 'listingType',
      media: 'image',
    },
    prepare({ title, listingType, media }) {
      return {
        title,
        subtitle: listingType || 'listing',
        media,
      };
    },
  },
});
