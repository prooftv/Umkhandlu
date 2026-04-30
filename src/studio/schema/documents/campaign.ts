import { BulbOutlineIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'campaign',
  title: 'Campaigns',
  icon: BulbOutlineIcon,
  type: 'document',
  groups: [
    { name: 'details', title: 'Details', default: true },
    { name: 'media', title: 'Media & Assets' },
    { name: 'tracking', title: 'Tracking & Impact' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Campaign Title',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'campaignType',
      title: 'Campaign Type',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Sponsorship', value: 'ad' },
          { title: 'Activation', value: 'activation' },
          { title: 'Initiative', value: 'csr' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Approved', value: 'approved' },
          { title: 'Active', value: 'active' },
          { title: 'Completed', value: 'completed' },
          { title: 'Reported', value: 'reported' },
        ],
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'sponsor',
      title: 'Sponsor / Partner',
      type: 'reference',
      to: [{ type: 'sponsor' }],
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'details',
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'blockContent',
      group: 'details',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      group: 'details',
    }),

    // Media
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'image',
      group: 'media',
      description: 'For ad campaigns — the banner creative.',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
      hidden: ({ parent }) => parent?.campaignType !== 'ad',
    }),
    defineField({
      name: 'gallery',
      title: 'Activation / CSR Photos',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        },
      ],
      hidden: ({ parent }) => parent?.campaignType === 'ad',
    }),

    // Relationships
    defineField({
      name: 'relatedAreas',
      title: 'Target Areas',
      type: 'array',
      group: 'details',
      of: [
        {
          type: 'reference',
          to: [{ type: 'listing' }],
          options: {
            filter: 'listingType == "area"',
          },
        },
      ],
      description: 'Areas/villages this campaign targets.',
    }),
    defineField({
      name: 'relatedProgram',
      title: 'Related Program',
      type: 'reference',
      to: [{ type: 'program' }],
      group: 'details',
      description: 'Link to a program if this campaign supports one.',
    }),
    defineField({
      name: 'link',
      title: 'External Link',
      type: 'url',
      group: 'details',
      description: 'Sponsor website, application form, or landing page.',
    }),

    // Tracking & Impact
    defineField({
      name: 'budget',
      title: 'Budget (ZAR)',
      type: 'number',
      group: 'tracking',
      description: 'Campaign budget in Rands.',
    }),
    defineField({
      name: 'beneficiaries',
      title: 'Beneficiaries Reached',
      type: 'number',
      group: 'tracking',
      description: 'Number of community members impacted.',
    }),
    defineField({
      name: 'impactSummary',
      title: 'Impact Summary',
      type: 'text',
      rows: 4,
      group: 'tracking',
      description:
        'Summary of outcomes — for CSR reports and sponsor feedback.',
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      group: 'tracking',
      of: [{ type: 'string' }],
      description:
        'e.g. 500 school bags delivered, 3 community clean-ups, 2 banner placements',
    }),
  ],
  orderings: [
    {
      title: 'Start Date (Newest)',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      campaignType: 'campaignType',
      status: 'status',
      sponsor: 'sponsor.name',
      media: 'image',
    },
    prepare({ title, campaignType, status, sponsor, media }) {
      const typeLabel =
        { ad: '📢 Ad', activation: '🎯 Activation', csr: '💚 CSR' }[
          campaignType as string
        ] || campaignType;
      return {
        title,
        subtitle: `${typeLabel} — ${status || 'draft'}${sponsor ? ` — ${sponsor}` : ''}`,
        media,
      };
    },
  },
});
