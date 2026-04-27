import { StarIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sponsor',
  title: 'Sponsors & Partners',
  icon: StarIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Organization Name',
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
      name: 'sponsorType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'NGO / Foundation', value: 'ngo' },
          { title: 'Business', value: 'business' },
          { title: 'Government Department', value: 'government' },
          { title: 'Community Organization', value: 'community' },
          { title: 'Individual Donor', value: 'individual' },
        ],
      },
      initialValue: 'ngo',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description:
        'Organization logo. Recommended: 400×200px, PNG with transparent background.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      type: 'sponsorType',
      media: 'logo',
    },
    prepare({ title, type, media }) {
      return {
        title,
        subtitle: type || 'Sponsor',
        media,
      };
    },
  },
});
