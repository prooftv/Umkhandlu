import { DocumentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import StudioNote from '../../components/StudioNote';

export default defineType({
  name: 'record',
  title: 'Documents & Records',
  icon: DocumentIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'recordType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Meeting Minutes', value: 'minutes' },
          { title: 'Resolution', value: 'resolution' },
          { title: 'Land Allocation', value: 'land-allocation' },
          { title: 'Dispute Resolution', value: 'dispute-resolution' },
          { title: 'Public Notice', value: 'public-notice' },
          { title: 'Policy', value: 'policy' },
          { title: 'Report', value: 'report' },
          { title: 'External Resource', value: 'external-resource' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      options: { aiAssist: { translateAction: true } },
    }),
    defineField({
      name: 'statusNote',
      title: 'Status Guide',
      type: 'string',
      hidden: ({ parent }) =>
        parent?.recordType !== 'land-allocation' &&
        parent?.recordType !== 'dispute-resolution',
      components: {
        field: () =>
          StudioNote({
            title: 'Land & dispute records',
            description:
              'Set the status and who approved it. This creates a public record of the decision — do not include personal details of applicants.',
          }),
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Approved', value: 'approved' },
          { title: 'Pending', value: 'pending' },
          { title: 'Rejected', value: 'rejected' },
          { title: 'Resolved', value: 'resolved' },
        ],
      },
      description: 'For land allocations and dispute resolutions.',
      hidden: ({ parent }) =>
        parent?.recordType !== 'land-allocation' &&
        parent?.recordType !== 'dispute-resolution',
    }),
    defineField({
      name: 'approvedBy',
      title: 'Approved / Resolved By',
      type: 'reference',
      to: [{ type: 'person' }],
      description: 'The Inkosi or authority who approved this decision.',
      hidden: ({ parent }) =>
        parent?.recordType !== 'land-allocation' &&
        parent?.recordType !== 'dispute-resolution',
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'file',
      title: 'Attached File (PDF)',
      type: 'file',
      description: 'Upload a PDF or document if available.',
      hidden: ({ parent }) => parent?.recordType === 'external-resource',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description:
        'Link to an external document (e.g. Ingonyama Trust resource).',
      hidden: ({ parent }) => parent?.recordType !== 'external-resource',
    }),
    defineField({
      name: 'source',
      title: 'Source Organization',
      type: 'string',
      description: 'e.g. Ingonyama Trust Board, Department of Land Affairs',
      hidden: ({ parent }) => parent?.recordType !== 'external-resource',
    }),
    defineField({
      name: 'relatedArea',
      title: 'Related Area',
      type: 'reference',
      to: [{ type: 'listing' }],
      description: 'Link to a specific area/village if applicable.',
      options: {
        filter: 'listingType == "area"',
      },
    }),
  ],
  orderings: [
    {
      title: 'Date (Newest)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', recordType: 'recordType', date: 'date' },
    prepare({ title, recordType, date }) {
      return {
        title,
        subtitle: `${recordType || 'record'} — ${date || 'No date'}`,
      };
    },
  },
});
