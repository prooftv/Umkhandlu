import { HelpCircleIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faq',
  title: 'FAQ / Accordion',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Frequently Asked Questions',
    }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'blockContent',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare({ title, items }) {
      return {
        title: title || 'FAQ',
        subtitle: `${items?.length || 0} questions`,
      };
    },
  },
});
