import { WarningOutlineIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'conflictLog',
  title: 'Conflict Log',
  icon: WarningOutlineIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'campaign',
      title: 'Project',
      type: 'reference',
      to: [{ type: 'campaign' }],
      validation: (rule) => rule.required(),
      description: 'The infrastructure project this conflict relates to.',
    }),
    defineField({
      name: 'field',
      title: 'Contested Field',
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
      title: 'Conflict Type',
      type: 'string',
      options: {
        list: [
          { title: '🟥 Numerical', value: 'numerical' },
          { title: '🟧 Status', value: 'status' },
          { title: '🟨 Time', value: 'time' },
          { title: '🟦 Workforce / EPWP', value: 'workforce' },
          { title: '🟪 Political / Context', value: 'political' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'claims',
      title: 'Competing Claims',
      type: 'array',
      validation: (rule) => rule.required().min(2),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'source',
              title: 'Source',
              type: 'string',
              options: {
                list: [
                  { title: 'Engineer (weight: 100)', value: 'engineer' },
                  { title: 'Municipality (weight: 90)', value: 'municipality' },
                  { title: 'PMU (weight: 85)', value: 'pmu' },
                  { title: 'Contractor (weight: 60)', value: 'contractor' },
                  { title: 'CLO / Councillor (weight: 40)', value: 'clo' },
                  {
                    title: 'Operator Observation (weight: 30)',
                    value: 'observation',
                  },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Claimed Value',
              type: 'string',
              validation: (rule) => rule.required(),
              description:
                'What this source claims. e.g. "70%" or "Construction phase"',
            }),
            defineField({
              name: 'date',
              title: 'Date of Claim',
              type: 'date',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'evidence',
              title: 'Evidence',
              type: 'text',
              rows: 2,
              description:
                'Reference to IPC, site diary, meeting minutes, etc.',
            }),
          ],
          preview: {
            select: { source: 'source', value: 'value', date: 'date' },
            prepare({ source, value, date }) {
              const weights: Record<string, number> = {
                engineer: 100,
                municipality: 90,
                pmu: 85,
                contractor: 60,
                clo: 40,
                observation: 30,
              };
              const w = weights[source as string] || 0;
              return {
                title: `${source} → ${value}`,
                subtitle: `Weight: ${w} | ${date || ''}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'displayTruth',
      title: 'Resolved Display Value',
      type: 'string',
      description:
        'The value shown publicly. Determined by highest-weight validated source.',
    }),
    defineField({
      name: 'resolutionState',
      title: 'Resolution State',
      type: 'string',
      options: {
        list: [
          { title: '🟡 Pending', value: 'pending' },
          { title: '🟠 Partially Resolved', value: 'partial' },
          { title: '🟢 Resolved', value: 'resolved' },
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
      title: 'Resolution Note',
      type: 'text',
      rows: 3,
      description:
        'How this conflict was resolved. Who confirmed, what meeting, what date.',
    }),
    defineField({
      name: 'detectedAt',
      title: 'Date Detected',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'resolvedAt',
      title: 'Date Resolved',
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
        title: `${icon} ${field} conflict`,
        subtitle: `${campaign || 'Unknown project'} — ${type || ''}`,
      };
    },
  },
});
