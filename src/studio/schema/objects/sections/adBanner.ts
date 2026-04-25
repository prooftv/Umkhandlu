import { BlockElementIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'adBanner',
  title: 'Ad / Sponsor Banner',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'For internal reference only — not displayed.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Banner Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'sponsor',
      title: 'Sponsor',
      type: 'reference',
      to: [{ type: 'sponsor' }],
      description:
        'Link to a sponsor. Name and website auto-fill. Leave empty to set manually.',
    }),
    defineField({
      name: 'sponsorName',
      title: 'Sponsor Name (manual)',
      type: 'string',
      hidden: ({ parent }) => !!parent?.sponsor,
    }),
    defineField({
      name: 'link',
      title: 'Link URL (manual)',
      type: 'url',
      hidden: ({ parent }) => !!parent?.sponsor,
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
    }),
    defineField({
      name: 'size',
      title: 'Banner Size',
      type: 'string',
      options: {
        list: [
          { title: 'Full Width', value: 'full' },
          { title: 'Half Width', value: 'half' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'full',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      manualSponsor: 'sponsorName',
      refSponsor: 'sponsor.name',
      media: 'image',
    },
    prepare({ title, manualSponsor, refSponsor, media }) {
      const sponsor = refSponsor || manualSponsor;
      return {
        title: title || 'Ad Banner',
        subtitle: sponsor ? `Sponsor: ${sponsor}` : 'Ad Banner',
        media,
      };
    },
  },
});
