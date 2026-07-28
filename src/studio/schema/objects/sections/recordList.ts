import { DocumentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'recordList',
  title: 'Documents & Records List',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Documents & Records',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'filterType',
      title: 'Filter by Type',
      type: 'string',
      options: {
        list: [
          { title: 'All', value: 'all' },
          { title: 'Agenda', value: 'agenda' },
          { title: 'Meeting Minutes', value: 'minutes' },
          { title: 'Resolutions', value: 'resolution' },
          { title: 'Land Allocations', value: 'land-allocation' },
          { title: 'Dispute Resolutions', value: 'dispute-resolution' },
          { title: 'Public Notices', value: 'public-notice' },
          { title: 'Policies', value: 'policy' },
          { title: 'Reports', value: 'report' },
          { title: 'External Resources', value: 'external-resource' },
        ],
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'limit',
      title: 'Max to Show',
      type: 'number',
      initialValue: 10,
      validation: (rule) => rule.min(1).max(50),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title || 'Record List',
        subtitle: 'Documents & Records',
      };
    },
  },
});
