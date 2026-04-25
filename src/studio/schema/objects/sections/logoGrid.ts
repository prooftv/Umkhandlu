import { StarIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'logoGrid',
  title: 'Sponsors / Partners',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Our Partners & Sponsors',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'sponsors',
      title: 'Sponsors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'sponsor' }] }],
      description: 'Select sponsors/partners to display.',
    }),
  ],
  preview: {
    select: { title: 'heading', sponsors: 'sponsors' },
    prepare({ title, sponsors }) {
      return {
        title: title || 'Logo Grid',
        subtitle: `${sponsors?.length || 0} sponsors`,
      };
    },
  },
});
