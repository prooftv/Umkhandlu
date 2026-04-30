import { RocketIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import StudioNote from '../../components/StudioNote';

export default defineType({
  name: 'program',
  title: 'Programs & Events',
  icon: RocketIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Program or event name. 60-80 characters.',
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
      description:
        'Brief description shown in program cards. 100-200 characters.',
      validation: (rule) => rule.max(300),
      title: 'Short Description',
      type: 'text',
      rows: 3,
      options: { aiAssist: { translateAction: true } },
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
      description: 'Event/program image. Recommended: 1200×600px, JPG or PNG.',
      options: {
        hotspot: true,
        aiAssist: { imageDescriptionField: 'alt' },
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        }),
      ],
    }),
    defineField({
      name: 'statusNote',
      title: 'Status Guide',
      type: 'string',
      components: {
        field: () =>
          StudioNote({
            title: 'Keep status updated',
            description:
              'Set to Upcoming before the event, Active while running, Completed when done. This controls how the program appears on the site.',
          }),
      },
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
