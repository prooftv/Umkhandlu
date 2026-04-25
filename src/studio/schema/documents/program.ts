import { RocketIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'program',
  title: 'Programs & Events',
  icon: RocketIcon,
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
      name: 'programType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Youth Event', value: 'youth-event' },
          { title: 'Skills Program', value: 'skills' },
          { title: 'School Collaboration', value: 'school' },
          { title: 'Community Project', value: 'community' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        }),
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Active', value: 'active' },
          { title: 'Completed', value: 'completed' },
        ],
      },
      initialValue: 'upcoming',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      programType: 'programType',
      status: 'status',
      media: 'image',
    },
    prepare({ title, programType, status, media }) {
      return {
        title,
        subtitle: `${programType || 'program'} — ${status || 'upcoming'}`,
        media,
      };
    },
  },
});
