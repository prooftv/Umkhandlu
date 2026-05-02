import { UsersIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'organogram',
  title: 'Organogram / Structure',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Governance Structure',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'inkosi',
      title: 'Inkosi (Chief)',
      type: 'reference',
      to: [{ type: 'person' }],
      description: 'The head of the traditional authority.',
    }),
    defineField({
      name: 'izinduna',
      title: 'Izinduna (Headmen)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'person' }] }],
      description: 'Headmen responsible for each isigodi.',
    }),
    defineField({
      name: 'council',
      title: 'Council Members',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'person' }] }],
      description: 'Additional council members and representatives.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title || 'Organogram',
        subtitle: 'Governance Structure',
      };
    },
  },
});
