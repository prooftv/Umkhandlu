import { WarningOutlineIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'conflictLog',
  title: 'Verification Records',
  icon: WarningOutlineIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'campaign',
      title: 'Project',
      type: 'reference',
      to: [{ type: 'campaign' }],
      validation: (rule) => rule.required(),
      description: 'The infrastructure project this record relates to.',
    }),
    defineField({
      name: 'field',
      title: 'Reported Field',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: 'Progress %', value: 'progress' },
          { title: 'Project Phase', value: 'phase' },
          { title: 'Workforce / EPWP Numbers', value: 'workforce' },
          { title: 'Timeline / Dates', value: 'timeline' },
          { title: 'Project Status', value: 'status' },
          { title: 'Budget / Expenditure', value: 'budget' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'conflictType',
      title: 'Variance Type',
      type: 'string',
      options: {
        list: [
          { title: 'Numerical Variance', value: 'numerical' },
          { title: 'Status Variance', value: 'status' },
          { title: 'Timeline Variance', value: 'time' },
          { title: 'Workforce Variance', value: 'workforce' },
          { title: 'Contextual Variance', value: 'political' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'claims',
      title: 'Source Records',
      type: 'array',
      validation: (rule) => rule.required().min(2),
      description:
        'Each source that reported a value for this field. Minimum 2 sources required.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'source',
              title: 'Source Authority',
              type: 'string',
              options: {
                list: [
                  { title: 'Engineer Certification', value: 'engineer' },
                  { title: 'Municipal Record', value: 'municipality' },
                  { title: 'PMU Verification', value: 'pmu' },
                  { title: 'Contractor Report', value: 'contractor' },
                  { title: 'CLO / Ward Councillor', value: 'clo' },
                  {
                    title: 'Field Observation',
                    value: 'observation',
                  },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Reported Value',
              type: 'string',
              validation: (rule) => rule.required(),
              description:
                'The value reported by this source. e.g. "55%" or "Construction phase"',
            }),
            defineField({
              name: 'date',
              title: 'Date Reported',
              type: 'date',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'evidence',
              title: 'Supporting Evidence (Description)',
              type: 'text',
              rows: 2,
              description:
                'Reference to IPC, site diary, meeting minutes, certificate, etc.',
            }),
            defineField({
              name: 'evidenceFiles',
              title: 'Evidence Documents',
              type: 'array',
              description:
                'Upload IPC certificates, site diary pages, photos, meeting minutes as audit trail.',
              of: [
                {
                  type: 'file',
                  options: { accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png' },
                  fields: [
                    defineField({
                      name: 'title',
                      type: 'string',
                      title: 'Document Title',
                    }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: { source: 'source', value: 'value', date: 'date' },
            prepare({ source, value, date }) {
              return {
                title: `${source} → ${value}`,
                subtitle: date || '',
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'displayTruth',
      title: 'Verified Reporting Value',
      type: 'string',
      description:
        'The value used for public reporting. Determined by the applicable governance authority.',
    }),
    defineField({
      name: 'resolutionState',
      title: 'Verification Status',
      type: 'string',
      options: {
        list: [
          { title: '🟡 Pending Review', value: 'pending' },
          { title: '🟠 Under Review', value: 'partial' },
          { title: '🟢 Verified', value: 'resolved' },
          { title: '🔴 Escalated', value: 'escalated' },
        ],
      },
      initialValue: 'pending',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'escalationLevel',
      title: 'Escalation Level',
      type: 'string',
      options: {
        list: [
          { title: 'Operator', value: 'operator' },
          { title: 'Engineer Review', value: 'engineer' },
          { title: 'PMU Validation', value: 'pmu' },
          { title: 'Site Meeting', value: 'site_meeting' },
          { title: 'Municipal Decision', value: 'municipal' },
        ],
      },
      hidden: ({ parent }) => parent?.resolutionState !== 'escalated',
    }),
    defineField({
      name: 'resolutionNote',
      title: 'Verification Note',
      type: 'text',
      rows: 3,
      description:
        'How this variance was resolved. Authority, meeting reference, date confirmed.',
    }),
    defineField({
      name: 'detectedAt',
      title: 'Date Identified',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'resolvedAt',
      title: 'Date Verified',
      type: 'date',
      hidden: ({ parent }) => parent?.resolutionState !== 'resolved',
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'detectedDesc',
      by: [{ field: 'detectedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      campaign: 'campaign.title',
      field: 'field',
      state: 'resolutionState',
      type: 'conflictType',
    },
    prepare({ campaign, field, state, type }) {
      const stateIcons: Record<string, string> = {
        pending: '🟡',
        partial: '🟠',
        resolved: '🟢',
        escalated: '🔴',
      };
      const icon = stateIcons[state as string] || '⚪';
      return {
        title: `${icon} ${field} — ${type || 'variance'}`,
        subtitle: campaign || 'Unknown project',
      };
    },
  },
});
