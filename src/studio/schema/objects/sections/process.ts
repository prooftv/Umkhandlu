import { NumberIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'process',
  title: 'Process / Steps',
  type: 'object',
  icon: NumberIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Introduction',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Step Description',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
      validation: (rule) => rule.min(2),
    }),
    defineField({
      name: 'footnote',
      title: 'Footnote / Disclaimer',
      type: 'text',
      rows: 2,
      description: 'e.g. "Contact the council office for more information."',
    }),
  ],
  preview: {
    select: { title: 'heading', steps: 'steps' },
    prepare({ title, steps }) {
      return {
        title: title || 'Process',
        subtitle: `${steps?.length || 0} steps`,
      };
    },
  },
});
