import { UserIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'person',
  title: 'People',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: (doc) => `${doc?.firstName}-${doc?.lastName}`.toLowerCase(),
        maxLength: 96,
      },
    }),
    defineField({
      name: 'image',
      title: 'Picture',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        }),
      ],
      options: {
        hotspot: true,
        aiAssist: { imageDescriptionField: 'alt' },
      },
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'e.g. Inkosi, Council Member, Youth Coordinator, Sponsor',
    }),
    defineField({
      name: 'personType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Inkosi (Chief)', value: 'inkosi' },
          { title: 'Induna (Headman)', value: 'induna' },
          { title: 'Council Member', value: 'council' },
          { title: 'Youth Representative', value: 'youth' },
          { title: 'Community Member', value: 'community' },
          { title: 'Author', value: 'author' },
        ],
      },
      initialValue: 'council',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'string',
      description: 'e.g. Unami Foundation, Ingonyama Trust, School name',
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Skills or trades (e.g. Builder, Mechanic, Farmer, Designer)',
    }),
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'role',
      image: 'image',
    },
    prepare({ firstName, lastName, role, image }) {
      return {
        title: `${firstName} ${lastName}`,
        subtitle: role || 'Person',
        media: image,
      };
    },
  },
});
