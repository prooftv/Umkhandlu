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
      description:
        'Legacy operator-entered coordinate. It is not shown as an authoritative map pin; use a published spatial feature reference below.',
    }),
    defineField({
      name: 'spatialFeatureId',
      title: 'Published spatial feature ID',
      type: 'string',
      description:
        'UUID of the matching approved, publicly redistributable feature in Unami Control Centre. Link only after verifying that it represents this exact listing.',
      validation: (rule) =>
        rule.regex(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        ),
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
      name: 'areaLevel',
      title: 'Area Level',
      type: 'string',
      description: 'Geographic classification level for this area.',
      options: {
        list: [
          { title: 'District Municipality', value: 'district' },
          { title: 'Local Municipality', value: 'municipality' },
          { title: 'Ward', value: 'ward' },
          { title: 'Traditional Authority', value: 'traditional-authority' },
          { title: 'Isigodi (Village / Settlement)', value: 'isigodi' },
          { title: 'Settlement / Locality', value: 'settlement' },
        ],
        layout: 'radio',
      },
      hidden: ({ parent }) => parent?.listingType !== 'area',
    }),
    defineField({
      name: 'wardNumber',
      title: 'Ward Number',
      type: 'number',
      description: 'Municipal ward number (if applicable).',
      hidden: ({ parent }) => parent?.listingType !== 'area',
    }),
    defineField({
      name: 'mdbWardId',
      title: 'MDB Ward ID',
      type: 'string',
      description:
        'Stable national MDB ward identifier (e.g. 52504001). Used to match authoritative MDB 2026 geometry from the Control Centre. Do not edit manually — set from the MDB dataset.',
      hidden: ({ parent }) =>
        parent?.listingType !== 'area' || parent?.areaLevel !== 'ward',
    }),
    defineField({
      name: 'municipality',
      title: 'Local Municipality',
      type: 'string',
      description: 'The local municipality this area falls within.',
      options: {
        list: [
          { title: 'Newcastle Local Municipality', value: 'newcastle' },
          { title: 'Dannhauser Local Municipality', value: 'dannhauser' },
          { title: 'eMadlangeni Local Municipality', value: 'emadlangeni' },
          { title: 'Amajuba District (cross-municipal)', value: 'amajuba' },
        ],
        layout: 'radio',
      },
      hidden: ({ parent }) => parent?.listingType !== 'area',
    }),
    defineField({
      name: 'parentArea',
      title: 'Parent Area',
      type: 'reference',
      to: [{ type: 'listing' }],
      description:
        'The larger area this area belongs to (e.g. isigodi → ward → municipality → district).',
      options: {
        filter: 'listingType == "area" && _id != ^._id',
      },
      hidden: ({ parent }) => parent?.listingType !== 'area',
    }),
    defineField({
      name: 'boundary',
      title: 'Area Boundary (GeoJSON)',
      type: 'text',
      description:
        'GeoJSON polygon prepared via QGIS from authorised institutional source. Do not edit manually.',
      hidden: ({ parent }) => parent?.listingType !== 'area',
    }),
    defineField({
      name: 'boundarySource',
      title: 'Boundary Source',
      type: 'string',
      description:
        'Institution and dataset. e.g. "KZN COGTA Ward Boundaries 2022"',
      hidden: ({ parent }) => parent?.listingType !== 'area',
    }),
    defineField({
      name: 'boundaryDate',
      title: 'Boundary Dataset Date',
      type: 'date',
      description: 'Date of the source dataset (not import date).',
      hidden: ({ parent }) => parent?.listingType !== 'area',
    }),
    defineField({
      name: 'boundaryPermission',
      title: 'Redistribution Permission',
      type: 'string',
      options: {
        list: [
          {
            title: 'Reference only (display, no redistribution)',
            value: 'reference',
          },
          { title: 'Display permitted', value: 'display' },
          { title: 'Redistribution confirmed', value: 'redistribute' },
        ],
      },
      initialValue: 'reference',
      hidden: ({ parent }) => parent?.listingType !== 'area',
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
