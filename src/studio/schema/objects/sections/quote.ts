import { CommentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'quote',
  title: 'Quote / Testimonial',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Quote Text',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'person' }],
      description: 'Select a person, or use the manual fields below.',
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name (manual)',
      type: 'string',
      hidden: ({ parent }) => !!parent?.author,
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Role (manual)',
      type: 'string',
      hidden: ({ parent }) => !!parent?.author,
    }),
    defineField({
      name: 'image',
      title: 'Author Photo (manual)',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => !!parent?.author,
    }),
  ],
  preview: {
    select: {
      text: 'text',
      manualName: 'authorName',
      refFirst: 'author.firstName',
      refLast: 'author.lastName',
    },
    prepare({ text, manualName, refFirst, refLast }) {
      const name = refFirst ? `${refFirst} ${refLast}` : manualName;
      return {
        title: text?.substring(0, 60) || 'Quote',
        subtitle: name ? `— ${name}` : 'Quote',
      };
    },
  },
});
