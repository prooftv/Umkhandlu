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
      title: 'Sponsors (from People)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'person' }] }],
      description:
        'Reference existing sponsor/partner profiles. Their logo and website will be used.',
    }),
    defineField({
      name: 'logos',
      title: 'Additional Logos (inline)',
      type: 'array',
      description:
        'For organizations not in the People directory. Sponsors from People appear first.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Organization Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Website URL',
              type: 'url',
            }),
          ],
          preview: {
            select: { title: 'name', media: 'logo' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', sponsors: 'sponsors', logos: 'logos' },
    prepare({ title, sponsors, logos }) {
      const count = (sponsors?.length || 0) + (logos?.length || 0);
      return {
        title: title || 'Logo Grid',
        subtitle: `${count} partner${count !== 1 ? 's' : ''}`,
      };
    },
  },
});
