import { StarIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import StudioNote from '../../components/StudioNote';

export default defineType({
  name: 'opportunity',
  title: 'Opportunities',
  icon: StarIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Job title or opportunity name. 60-80 characters.',
      validation: (rule) => rule.required().max(120),
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'opportunityType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Job', value: 'job' },
          { title: 'Training / Learnership', value: 'training' },
          { title: 'Bursary', value: 'bursary' },
          { title: 'Funding / Grant', value: 'funding' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      description: 'What the opportunity involves. 200-500 characters.',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } },
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'string',
      description: 'Who is offering this opportunity.',
    }),
    defineField({
      name: 'deadlineNote',
      title: 'Deadline Guide',
      type: 'string',
      components: {
        field: () =>
          StudioNote({
            title: 'Deadline matters',
            description:
              'Opportunities with a past deadline are automatically hidden from the site. Leave deadline empty if the opportunity is ongoing.',
          }),
      },
    }),
    defineField({
      name: 'deadline',
      title: 'Application Deadline',
      type: 'datetime',
    }),
    defineField({
      name: 'link',
      title: 'Apply / More Info URL',
      type: 'url',
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      description:
        'Optional image for opportunity cards. Recommended: 1200×600px.',
      options: {
        hotspot: true,
        aiAssist: { imageDescriptionField: 'alt' },
      },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'relatedArea',
      title: 'Related Area',
      type: 'reference',
      to: [{ type: 'listing' }],
      description: 'Link to a specific area/village if applicable.',
      options: {
        filter: 'listingType == "area"',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Deadline (Soonest)',
      name: 'deadlineAsc',
      by: [{ field: 'deadline', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'opportunityType',
      org: 'organization',
      deadline: 'deadline',
    },
    prepare({ title, type, org, deadline }) {
      const sub = [type, org, deadline?.split('T')[0]]
        .filter(Boolean)
        .join(' — ');
      return { title, subtitle: sub };
    },
  },
});
