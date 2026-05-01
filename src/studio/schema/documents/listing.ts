import { PinIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import StudioNote from '../../components/StudioNote';

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
          { title: 'Accommodation', value: 'accommodation' },
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
      validation: (rule) => rule.max(300),
      options: { aiAssist: { translateAction: true } },
    }),
    defineField({
      name: 'content',
      title: 'Full Details',
      type: 'blockContent',
      description:
        'Detailed write-up about this listing. History, services, facilities, etc.',
      hidden: ({ parent }) => parent?.listingType === 'area',
    }),
    defineField({
      name: 'location',
      title: 'Location / Address',
      type: 'string',
    }),
    defineField({
      name: 'geopoint',
      title: 'Map Location',
      type: 'geopoint',
      description: 'Pin this listing on the map. Click to set coordinates.',
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Info',
      type: 'string',
      description: 'Phone number, email, or other contact details.',
    }),
    defineField({
      name: 'whatsappContact',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'International format, e.g. +27612345678',
      hidden: ({ parent }) => parent?.listingType === 'area',
    }),
    defineField({
      name: 'website',
      title: 'Website / Social Media',
      type: 'url',
      description: 'Website, Facebook page, or other online presence.',
      hidden: ({ parent }) => parent?.listingType === 'area',
    }),
    defineField({
      name: 'servicesOffered',
      title: 'Services Offered',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'e.g. Primary care, Maternity, Dispensary (clinics) or Grades 8-12, Matric (schools) or Plumbing, Electrical (businesses)',
      hidden: ({ parent }) => parent?.listingType === 'area',
    }),
    defineField({
      name: 'operatingHours',
      title: 'Operating Hours',
      type: 'string',
      description: 'e.g. Mon-Fri 8:00-16:00, Sat 8:00-12:00',
      hidden: ({ parent }) => parent?.listingType === 'area',
    }),
    defineField({
      name: 'verificationNote',
      title: 'Verification Guide',
      type: 'string',
      hidden: ({ parent }) => parent?.listingType === 'area',
      components: {
        field: () =>
          StudioNote({
            title: 'Verification levels',
            description:
              'Community Submitted = unverified. Verified by Induna = local headman confirms it exists. Council Approved = full council verification. Set the correct level below.',
          }),
      },
    }),
    defineField({
      name: 'verifiedByInduna',
      title: 'Verification Status',
      type: 'string',
      options: {
        list: [
          { title: 'Community Submitted', value: 'community' },
          { title: 'Verified by Induna', value: 'induna' },
          { title: 'Council Approved', value: 'council' },
        ],
      },
      initialValue: 'community',
      description: 'Level of verification for this listing.',
      hidden: ({ parent }) => parent?.listingType === 'area',
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      description: 'Main photo. Recommended: 1200×600px, JPG or PNG.',
      options: {
        hotspot: true,
        aiAssist: { imageDescriptionField: 'alt' },
      },
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
    defineField({
      name: 'images',
      title: 'Additional Photos',
      type: 'array',
      description: 'Additional photos of the facility, products, or services.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        },
      ],
      hidden: ({ parent }) => parent?.listingType === 'area',
    }),
    defineField({
      name: 'relatedArea',
      title: 'Related Area',
      type: 'reference',
      to: [{ type: 'listing' }],
      description: 'The area/isigodi this listing belongs to.',
      options: {
        filter: 'listingType == "area"',
      },
      hidden: ({ parent }) => parent?.listingType === 'area',
    }),
    defineField({
      name: 'induna',
      title: 'Induna (Headman)',
      type: 'reference',
      to: [{ type: 'person' }],
      description: 'The induna responsible for this area.',
      hidden: ({ parent }) => parent?.listingType !== 'area',
    }),
    defineField({
      name: 'relatedListings',
      title: 'Related Listings',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'listing' }] }],
      description: 'Schools, clinics, businesses within this area.',
      hidden: ({ parent }) => parent?.listingType !== 'area',
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
