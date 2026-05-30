import { BulbOutlineIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import StudioNote from '../../components/StudioNote';

export default defineType({
  name: 'campaign',
  title: 'Campaigns',
  icon: BulbOutlineIcon,
  type: 'document',
  groups: [
    { name: 'details', title: 'Details', default: true },
    { name: 'media', title: 'Media & Assets' },
    { name: 'tracking', title: 'Tracking & Impact' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── Details ───────────────────────────────────────────
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
      name: 'contactPerson',
      title: 'Contact Person',
      type: 'reference',
      to: [{ type: 'person' }],
      group: 'details',
      description: 'Person managing this campaign.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'details',
      validation: (rule) => rule.max(300),
      options: { aiAssist: { translateAction: true } },
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'blockContent',
      group: 'details',
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target Audience',
      type: 'string',
      group: 'details',
      description: 'e.g. Youth 18-35, Women, Farmers, Learners',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'details',
      description: 'Freeform tags for categorisation.',
      options: { layout: 'tags' },
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

    // ─── Relationships ─────────────────────────────────────
    defineField({
      name: 'fundingSource',
      title: 'Funding Source',
      type: 'string',
      group: 'details',
      description: 'e.g. WSIG, MIG, RBIG, EPWP, Own Revenue',
      hidden: ({ parent }) => parent?.campaignType !== 'csr',
    }),
    defineField({
      name: 'contractor',
      title: 'Main Contractor',
      type: 'string',
      group: 'details',
      description: 'Company or agency doing the construction/implementation.',
      hidden: ({ parent }) => parent?.campaignType !== 'csr',
    }),
    defineField({
      name: 'contractNumber',
      title: 'Contract / Tender Number',
      type: 'string',
      group: 'details',
      description: 'e.g. BMT 04/2025/26',
      hidden: ({ parent }) => parent?.campaignType !== 'csr',
    }),
    defineField({
      name: 'consultingEngineer',
      title: 'Consulting Engineer',
      type: 'string',
      group: 'details',
      description: 'Engineering firm or health & safety agent.',
      hidden: ({ parent }) => parent?.campaignType !== 'csr',
    }),
    defineField({
      name: 'localSMMEs',
      title: 'Local SMMEs Involved',
      type: 'number',
      group: 'tracking',
      description: 'Number of local small businesses benefiting.',
      hidden: ({ parent }) => parent?.campaignType !== 'csr',
    }),
    defineField({
      name: 'projectPhase',
      title: 'Project Phase',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Planning', value: 'planning' },
          { title: 'Procurement', value: 'procurement' },
          { title: 'Construction', value: 'construction' },
          { title: 'Commissioning', value: 'commissioning' },
          { title: 'Operational', value: 'operational' },
        ],
      },
      description: 'Current construction/implementation phase.',
      hidden: ({ parent }) => parent?.campaignType !== 'csr',
    }),
    defineField({
      name: 'progressLog',
      title: 'Progress Updates',
      type: 'array',
      group: 'tracking',
      description: 'Timestamped progress entries.',
      hidden: ({ parent }) => parent?.campaignType !== 'csr',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'date',
              type: 'date',
              title: 'Date',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'update',
              type: 'text',
              title: 'Update',
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'update', subtitle: 'date' },
          },
        },
      ],
    }),
    defineField({
      name: 'relatedListings',
      title: 'Related Infrastructure',
      type: 'array',
      group: 'details',
      of: [{ type: 'reference', to: [{ type: 'listing' }] }],
      description:
        'Schools, clinics, facilities this project serves or connects to.',
      hidden: ({ parent }) => parent?.campaignType !== 'csr',
    }),
    defineField({
      name: 'relatedAreas',
      title: 'Target Areas',
      type: 'array',
      group: 'details',
      of: [
        {
          type: 'reference',
          to: [{ type: 'listing' }],
          options: { filter: 'listingType == "area"' },
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

    // ─── Media & Assets ────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
        aiAssist: { imageDescriptionField: 'alt' },
      },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'hideCoverImage',
      title: 'Hide Cover Image on Detail Page',
      type: 'boolean',
      group: 'media',
      initialValue: false,
      description:
        'Enable to hide the large cover image on the campaign page. Useful for poster/flyer images that are too tall.',
    }),
    defineField({
      name: 'stakeholderLogos',
      title: 'Stakeholder Logos (Info Board)',
      type: 'array',
      group: 'media',
      description:
        'Logos displayed on the Project Info Board footer. Add municipality, funder, contractor logos.',
      hidden: ({ parent }) => parent?.campaignType !== 'csr',
      of: [
        {
          type: 'image',
          options: { hotspot: false },
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              title: 'Organization Name',
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'image',
      group: 'media',
      description: 'For sponsorship campaigns — the banner creative.',
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
    defineField({
      name: 'videoUrl',
      title: 'Video Embed URL',
      type: 'url',
      group: 'media',
      description:
        'Paste the embed URL. YouTube: click Share → Embed → copy the src URL. e.g. https://www.youtube.com/embed/xxxxx',
    }),
    defineField({
      name: 'audioFile',
      title: 'Audio File',
      type: 'file',
      group: 'media',
      description: 'Audio recording, podcast, or voice note (MP3, WAV).',
      options: { accept: 'audio/*' },
    }),
    defineField({
      name: 'documents',
      title: 'Documents & Reports',
      type: 'array',
      group: 'media',
      description: 'PDFs, proposals, reports, or other documents.',
      of: [
        {
          type: 'file',
          options: { accept: '.pdf,.doc,.docx,.xls,.xlsx' },
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Document Title',
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),

    // ─── Tracking & Impact ─────────────────────────────────
    defineField({
      name: 'trackingNote',
      title: 'Tracking Guide',
      type: 'string',
      group: 'tracking',
      components: {
        field: () =>
          StudioNote({
            title: 'When to fill these fields',
            description:
              'Budget: when confirmed. Beneficiaries + Deliverables: when campaign is completed. Impact Summary: when reporting to sponsors. Leave empty until then.',
          }),
      },
    }),
    defineField({
      name: 'budget',
      title: 'Budget (ZAR)',
      type: 'number',
      group: 'tracking',
      description: 'Campaign budget in Rands. Fill when confirmed.',
    }),
    defineField({
      name: 'beneficiaries',
      title: 'Beneficiaries Reached',
      type: 'number',
      group: 'tracking',
      description:
        'Fill when campaign is completed. Number of community members impacted.',
    }),
    defineField({
      name: 'impactSummary',
      title: 'Impact Summary',
      type: 'text',
      rows: 4,
      group: 'tracking',
      description:
        'Fill when reporting. Summary of outcomes for CSR reports and sponsor feedback.',
      options: { aiAssist: { translateAction: true } },
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables (Completed)',
      type: 'array',
      group: 'tracking',
      of: [{ type: 'string' }],
      description:
        'Add as you complete them. e.g. Weir construction, Borehole drilling, Rising main installation',
    }),
    defineField({
      name: 'totalDeliverables',
      title: 'Total Planned Deliverables',
      type: 'number',
      group: 'tracking',
      description:
        'Total number of deliverables in scope. Progress bar shows completed / total.',
      validation: (rule) => rule.min(1),
    }),

    // ─── SEO ───────────────────────────────────────────────
    defineField({
      title: 'SEO & Metadata',
      name: 'seo',
      type: 'seoMetaFields',
      group: 'seo',
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
