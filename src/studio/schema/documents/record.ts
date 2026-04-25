import { DocumentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

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
          { title: 'Public Notice', value: 'public-notice' },
          { title: 'Policy', value: 'policy' },
          { title: 'Report', value: 'report' },
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
