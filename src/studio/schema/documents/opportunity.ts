import { StarIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'opportunity',
  title: 'Opportunities',
  icon: StarIcon,
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
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'string',
      description: 'Who is offering this opportunity.',
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
