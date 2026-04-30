import { BulbOutlineIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'campaignList',
  title: 'Campaigns & Activations',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Community Campaigns',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'filterType',
      title: 'Filter by Type',
      type: 'string',
      options: {
        list: [
          { title: 'All', value: 'all' },
          { title: 'Ad / Sponsorship', value: 'ad' },
          { title: 'Brand Activations', value: 'activation' },
          { title: 'CSR Initiatives', value: 'csr' },
        ],
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'filterStatus',
      title: 'Filter by Status',
      type: 'string',
      options: {
        list: [
          { title: 'All', value: 'all' },
          { title: 'Active', value: 'active' },
          { title: 'Completed', value: 'completed' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'limit',
      title: 'Max Campaigns to Show',
      type: 'number',
      initialValue: 12,
      validation: (rule) => rule.min(1).max(50),
    }),
  ],
  preview: {
    select: { title: 'heading', filterType: 'filterType' },
    prepare({ title, filterType }) {
      return {
        title: title || 'Campaign List',
        subtitle: `Campaigns — ${filterType || 'all'}`,
      };
    },
  },
});
