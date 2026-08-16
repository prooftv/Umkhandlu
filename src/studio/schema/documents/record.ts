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
          { title: 'Agenda', value: 'agenda' },
          { title: 'Meeting Minutes', value: 'minutes' },
          { title: 'Resolution', value: 'resolution' },
          { title: 'Land Allocation', value: 'land-allocation' },
          { title: 'Dispute Resolution', value: 'dispute-resolution' },
          { title: 'Public Notice', value: 'public-notice' },
          { title: 'Policy', value: 'policy' },
          { title: 'Report', value: 'report' },
          { title: 'Infrastructure Concern', value: 'infrastructure-concern' },
          { title: 'Project Outcome', value: 'project-outcome' },
          { title: 'Community Decision', value: 'community-decision' },
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
      validation: (rule) => rule.max(300),
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
          { title: 'Adopted', value: 'adopted' },
          { title: 'Approved', value: 'approved' },
          { title: 'Pending', value: 'pending' },
          { title: 'Open', value: 'open' },
          { title: 'Rejected', value: 'rejected' },
          { title: 'Resolved', value: 'resolved' },
        ],
      },
      description: 'Status of this record.',
    }),
    defineField({
      name: 'approvedBy',
      title: 'Approved / Resolved By',
      type: 'reference',
      to: [{ type: 'person' }],
      description: 'The Inkosi or authority who approved this decision.',
      hidden: ({ parent }) =>
        parent?.recordType !== 'land-allocation' &&
        parent?.recordType !== 'dispute-resolution' &&
        parent?.recordType !== 'community-decision' &&
        parent?.recordType !== 'resolution',
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'originNotice',
      title: 'Origin Notice',
      type: 'reference',
      to: [{ type: 'notice' }],
      description: 'The notice (e.g. meeting) that produced this record.',
    }),
    defineField({
      name: 'parentRecord',
      title: 'Parent Record',
      type: 'reference',
      to: [{ type: 'record' }],
      description:
        'The record this was produced from (e.g. minutes → resolution).',
    }),
    defineField({
      name: 'evidence',
      title: 'Evidence & Attachments',
      type: 'array',
      description: 'Petitions, attendance registers, signatures, photos, PDFs.',
      hidden: ({ parent }) => parent?.recordType === 'external-resource',
      of: [{ type: 'evidenceAttachment', options: { accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp' } }],
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
    defineField({
      name: 'relatedCampaign',
      title: 'Related Project / Campaign',
      type: 'reference',
      to: [{ type: 'campaign' }],
      description:
        'Link to an infrastructure project if this record documents its outcome.',
    }),
    defineField({
      name: 'verificationNote',
      title: 'Verification Note',
      type: 'text',
      rows: 2,
      description:
        'How this record was verified. e.g. "Confirmed by Inkosi at council meeting 15 May 2026"',
    }),
    defineField({
      name: 'location',
      title: 'Venue / Location',
      type: 'string',
      description:
        'Where this event took place. e.g. "Soccer ground opposite Izazi High School"',
    }),
    defineField({
      name: 'attendance',
      title: 'Attendance',
      type: 'number',
      description: 'Number of people present.',
    }),
    defineField({
      name: 'weatherContext',
      title: 'Environmental Context',
      type: 'environmentalContext',
      description:
        'Auto-captured from Open-Meteo on page visit. Do not edit manually.',
      readOnly: true,
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
