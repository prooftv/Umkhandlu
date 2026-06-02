import { BellIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import StudioNote from '../../components/StudioNote';

export default defineType({
  name: 'developmentNotice',
  title: 'Development Notices',
  icon: BellIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Notice Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'e.g. Notice of Intent — Proposed Fuel Station, Ward 7',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'noticeType',
      title: 'Notice Type',
      type: 'string',
      options: {
        list: [
          { title: 'Environmental Impact Assessment (EIA)', value: 'eia' },
          { title: 'Rezoning Application (SPLUMA)', value: 'rezoning' },
          { title: 'Land Use Change (SPLUMA)', value: 'land-use' },
          { title: 'Township Establishment (SPLUMA)', value: 'township' },
          { title: 'Building Plan Approval', value: 'building' },
          { title: 'Mining / Excavation Permit', value: 'mining' },
          { title: 'Liquor License', value: 'liquor' },
          { title: 'Cell Tower / Mast', value: 'telecom' },
          { title: 'Deceased Estate (Form J187)', value: 'estate' },
          { title: 'Liquidation / Insolvency', value: 'liquidation' },
          { title: 'PTO / Land Transfer', value: 'pto' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Open for Comment', value: 'open' },
          { title: 'Comment Period Closed', value: 'closed' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
          { title: 'Withdrawn', value: 'withdrawn' },
        ],
      },
      initialValue: 'open',
    }),
    defineField({
      name: 'legalMandate',
      title: 'Legal Mandate',
      type: 'string',
      description:
        'Governing legislation. e.g. SPLUMA, NEMA, Insolvency Act No. 24 of 1936',
    }),
    defineField({
      name: 'retentionPeriod',
      title: 'Minimum Retention Period',
      type: 'string',
      description:
        'How long this notice must remain published. e.g. 30 days, 3 months, Full project duration, Permanent',
    }),
    defineField({
      name: 'fee',
      title: 'Publication Fee (ZAR)',
      type: 'number',
      description:
        'Fee charged to the applicant. R0 for traditional council notices (COP model). Suggested: PTO R100–R150 | Estate R350–R450 | SPLUMA R650–R850 | EIA R950–R1,200',
      initialValue: 0,
    }),
    defineField({
      name: 'feeStatus',
      title: 'Fee Status',
      type: 'string',
      options: {
        list: [
          { title: 'Free (Council Notice)', value: 'free' },
          { title: 'Invoiced', value: 'invoiced' },
          { title: 'Paid', value: 'paid' },
        ],
      },
      initialValue: 'free',
    }),
    defineField({
      name: 'guideNote',
      title: 'Guide',
      type: 'string',
      components: {
        field: () =>
          StudioNote({
            title: 'Public participation notice',
            description:
              'This notice invites public comment on a proposed development. Set the comment deadline and provide contact details for objections.',
          }),
      },
    }),
    defineField({
      name: 'applicant',
      title: 'Applicant / Developer',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Company or person proposing the development.',
    }),
    defineField({
      name: 'referenceNumber',
      title: 'Reference / Application Number',
      type: 'string',
      description: 'Municipal or departmental reference number.',
    }),
    defineField({
      name: 'description',
      title: 'Description of Proposed Development',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(500),
      options: { aiAssist: { translateAction: true } },
    }),
    defineField({
      name: 'content',
      title: 'Full Notice Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'location',
      title: 'Site Location / Address',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'geopoint',
      title: 'Map Location',
      type: 'geopoint',
      description: 'Pin the proposed development site on the map.',
    }),
    defineField({
      name: 'commentDeadline',
      title: 'Comment Deadline',
      type: 'date',
      validation: (rule) => rule.required(),
      description: 'Last date for public comments/objections.',
    }),
    defineField({
      name: 'commentContact',
      title: 'Where to Submit Comments',
      type: 'text',
      rows: 3,
      description:
        'Name, email, phone, or address where objections must be sent.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Date Published',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'image',
      title: 'Site Plan / Notice Image',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: { imageDescriptionField: 'alt' },
      },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'documents',
      title: 'Supporting Documents',
      type: 'array',
      description: 'EIA reports, site plans, application forms.',
      of: [
        {
          type: 'file',
          options: { accept: '.pdf,.doc,.docx' },
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
    defineField({
      name: 'relatedArea',
      title: 'Affected Area',
      type: 'reference',
      to: [{ type: 'listing' }],
      options: { filter: 'listingType == "area"' },
    }),
    defineField({
      name: 'relatedCampaign',
      title: 'Related Campaign',
      type: 'reference',
      to: [{ type: 'campaign' }],
      description:
        'Optional campaign reference for development notices or procurement-related communications tied to a project.',
    }),
  ],
  orderings: [
    {
      title: 'Deadline (Soonest)',
      name: 'deadlineAsc',
      by: [{ field: 'commentDeadline', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      noticeType: 'noticeType',
      status: 'status',
      deadline: 'commentDeadline',
    },
    prepare({ title, noticeType, status, deadline }) {
      const deadlineStr = deadline
        ? `Closes ${new Date(deadline).toLocaleDateString()}`
        : '';
      return {
        title,
        subtitle: `${noticeType || 'notice'} — ${status || 'open'} — ${deadlineStr}`,
      };
    },
  },
});
