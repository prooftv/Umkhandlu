import { BarChartIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'stats',
  title: 'Stats / Numbers',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Number / Value',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'e.g. 500+, 12, 3',
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'e.g. Households, Council Members, Schools',
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
      validation: (rule) => rule.min(2).max(6),
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare({ title, items }) {
      return {
        title: title || 'Stats',
        subtitle: `${items?.length || 0} stats`,
      };
    },
  },
});
